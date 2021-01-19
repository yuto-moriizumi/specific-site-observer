import dotenv from "dotenv";
//envファイルの読み込み
const result = dotenv.config();
console.log(result.parsed);

import createError from "http-errors";
import Express from "express";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";

import apiRouter from "./routes/api";

const app = Express();

app.use(logger("dev"));
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN_URL }));

app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err: any, req: Express.Request, res: Express.Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export = app;
