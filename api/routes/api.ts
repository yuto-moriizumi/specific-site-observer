import express from "express";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import jwtDecode, { JwtPayload } from "jwt-decode";
import mysql2 from "mysql2";

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
    .query("SELECT * FROM page")
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
  // requestProperty: "auth",
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

router.get("/subscriptions", checkJwt, (req, res) => {
  if (!req.user)
    res.status(403).send({ error: "token does not contain user information" });
  const data: (mysql2.RowDataPacket | mysql2.OkPacket)[] = [];
  connection
    .query(
      "SELECT `url`, `last_title` as `title`, `last_img` as `img`, `updated`, `rank` as `rating`, `has_new` FROM `Page` INNER JOIN `Subscription` WHERE Page.url=Subscription.page_url"
    )
    .on("result", (row) => data.push(row))
    .on("end", () => res.send(data));
});

export default router;
