import express from "express";
import jwt from "express-jwt";
import jwks from "jwks-rsa";

const router = express.Router();

// router.options("/*", (req, res, next) => {
//   // res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   // res.setHeader(
//   //   "Access-Control-Allow-Headers",
//   //   "Content-Type, Accept, X-CSRFToken, authorization"
//   // );
//   // res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:4000");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
//   );
//   res.send();
// });

/* GET users listing. */
router.get("/public", (req, res, next) => {
  // res.setHeader("Content-Type", "application/json");
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:4000");
  res.send(JSON.stringify({ message: "This is public message" }));
});

//JSON API
const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-eq2ig8u3.jp.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://example.com",
  issuer: "https://dev-eq2ig8u3.jp.auth0.com/",
  algorithms: ["RS256"],
});

// router.use(jwtCheck);

router.get("/private", jwtCheck, (req, res) => {
  // res.setHeader("Content-Type", "application/json");
  // // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:4000");
  // res.setHeader("Access-Control-Allow-Credentials", "true");
  // res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  // res.setHeader(
  //   "Access-Control-Allow-Headers",
  //   "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
  // );
  // res.setHeader("Access-Control-Allow-Origin", "https://example.com");
  // res.setHeader("Access-Control-Allow-Headers", "authorization");
  res.send({ message: "This is private message" });
});

export default router;
