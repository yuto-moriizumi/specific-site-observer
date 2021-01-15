import express from "express";
const router = express.Router();
// var router = express.Router();

/* GET users listing. */
router.get("/public", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/private", function (req, res, next) {
  res.send("respond with a resource");
});

export default router;
