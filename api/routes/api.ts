import express from "express";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";

const router = express.Router();

/* GET users listing. */
router.get("/pages", (req, res) => {
  res.send(JSON.stringify({ message: "This is public message" }));
});

//JSON API
console.log(process.env.AUTH0_DOMAIN, process.env.AUTH0_AUDIENCE);

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

router.get("/private", checkJwt, (req, res) => {
  console.log(req.headers.authorization);
  res.send({ message: "This is private message" });
});

export default router;
