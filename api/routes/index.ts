import Express from "express";
const router = Express.Router();

/* GET home page. */
router.get(
  "/",
  (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    res.render("index", { title: "Express" });
  }
);

export default router;
