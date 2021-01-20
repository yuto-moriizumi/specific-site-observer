import axios from "axios";
import express from "express";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import mysql2 from "mysql2";
import { JSDOM } from "jsdom";

const router = express.Router();

const connection = mysql2.createConnection({
  host: "db" || "192.168.0.8", //docker使用時はコンテナ名で名前解決可能
  user: "root",
  password: "docker",
  database: "mydb",
});

connection.connect((err) => {
  if (err) {
    console.log("error connecting: " + err.stack);
    return;
  }
  console.log("database connection success");
});

/* GET pages */
router.get("/pages", (req, res) => {
  const data: (mysql2.RowDataPacket | mysql2.OkPacket)[] = [];
  connection
    .query(
      "SELECT url, last_title as title, last_img as img, updated FROM page"
    )
    .on("result", (row) => data.push(row))
    .on("end", () => res.send(data));
});

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-eq2ig8u3.jp.auth0.com/.well-known/jwks.json",
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_DOMAIN,
  algorithms: ["RS256"],
});

// router.use(checkJwt);

//express-jwtは、tokenデコード後reqオブジェクトのuserプロパティに結果オブジェクトを格納します
//しかしなぜか型定義が用意されていないのでここで作ります
declare global {
  namespace Express {
    interface Request {
      user?: { sub: string }; //subはユーザのIDです
    }
  }
}

//購読一覧をstar降順に取得する
router.get("/subscriptions", checkJwt, (req, res) => {
  if (!req.user) {
    res.status(403).send({ error: "token does not contain user information" });
    return;
  }
  console.log(`USER_ID:${req.user.sub}`);

  const data: (mysql2.RowDataPacket | mysql2.OkPacket)[] = [];
  connection
    .query(
      "SELECT `url`, `last_title` as `title`, `last_img` as `img`, `updated`, `rank` as `rating`, `has_new` FROM `Page` INNER JOIN `Subscription` WHERE Page.url=Subscription.page_url " +
        `AND user_id='${req.user.sub}' ORDER BY rating DESC`
    )
    .on("result", (row) => data.push(row))
    .on("end", () => res.send(data));
});

//新規購読を追加する
router.post("/subscriptions", checkJwt, (req, res) => {
  if (!req.user) {
    res.status(403).send({ error: "token does not contain user information" });
    return;
  }
  console.log(`USER_ID:${req.user.sub}`);

  //SQLインジェクションの危険性あり
  //ページを追加する
  connection
    .query("INSERT IGNORE INTO `Page`" + `(url) VALUES ('${req.body.url}')`)
    .on("error", (err) => console.log(err));

  const QUERY =
    "INSERT IGNORE INTO `Subscription`" +
    " (`user_id`, `page_url`, `rank`, `has_new`)" +
    ` VALUES ('${req.user.sub}', '${req.body.url}', ${req.body.star}, 1)`;
  console.log(QUERY);

  //購読を追加する
  connection
    .query(QUERY)
    .on("error", (err) => console.log(err))
    .on("end", () => res.status(201).send());
});

//既読を切り替える
router.post("/subscriptions/new", checkJwt, (req, res) => {
  if (!req.user) {
    res.status(403).send({ error: "token does not contain user information" });
    return;
  }
  console.log(`USER_ID:${req.user.sub}, BODY:${req.body}`);

  //SQLインジェクションの危険性あり
  //既読を切り替える
  connection
    .query(
      "UPDATE `Subscription`" +
        ` SET has_new=${req.body.has_new} WHERE user_id='${req.user.sub}' AND page_url='${req.body.url}'`
    )
    .on("end", () => res.status(201).send());
});

//ランクを変更する
router.post("/subscriptions/rank", checkJwt, (req, res) => {
  if (!req.user) {
    res.status(403).send({ error: "token does not contain user information" });
    return;
  }
  console.log(`USER_ID:${req.user.sub}`);

  //SQLインジェクションの危険性あり
  //ランクを変更する
  connection
    .query(
      "UPDATE `Subscription`" +
        ` SET rank=${req.body.rank} WHERE user_id='${req.user.sub}' AND page_url='${req.body.url}'`
    )
    .on("end", () => res.status(201).send());
});

//既読を削除する
router.post("/subscriptions/delete", checkJwt, (req, res) => {
  if (!req.user) {
    res.status(403).send({ error: "token does not contain user information" });
    return;
  }
  console.log(`USER_ID:${req.user.sub}`);

  //SQLインジェクションの危険性あり
  //既読を削除する
  connection
    .query(
      "DELETE FROM `Subscription`" +
        ` WHERE user_id='${req.user.sub}' AND page_url='${req.body.url}'`
    )
    .on("end", () => res.status(201).send());
});

type Page = {
  url: string;
  last_title: string;
  last_img: string;
  updated: string;
};

//全てのページを更新する
router.post("/pages/update", (req, res) => {
  const pages: Page[] = [];
  connection
    .query("DELETE FROM `Page`")
    .on("result", (row) => pages.push(JSON.parse(JSON.stringify(row))));
  //各ページについて
  pages.forEach((page) => {
    //htmlを取得
    axios
      .get(page.url)
      .then((res) => {
        const document = new JSDOM(res.data).window.document;

        //最初の本を取得
        const book = document.querySelector(".cover");
        if (!book) {
          console.log(`${page.url}'s first book was not found`);
          return;
        }

        //最初のキャプションを取得
        const caption = book.querySelector(".caption");
        if (!caption) {
          console.log(`${page.url}'s caption was not found`);
          return;
        }

        if (caption.textContent === page.last_title) return; //更新が無ければ何もしない

        //サムネイルのエレメントを取得
        const el_thumbnail = book.querySelector("img");
        if (!el_thumbnail) {
          console.log(`${page.url}'s img was not found`);
          return;
        }

        //情報を更新する
        connection.query(
          "UPDATE `Page`" +
            ` SET last_title='${caption.textContent}'` +
            ` last_img='${el_thumbnail.src}` +
            ` updated=${new Date().getTime()}'` +
            ` WHERE url='${page.url}'`
        );
      })
      .catch((err) => console.log(err));
  });
});

export default router;
