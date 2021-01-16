import createError from "http-errors";
import Express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import apiRouter from "./routes/api";

const app = Express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(Express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "http://localhost:4000" }));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use(
  (
    err: any,
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  }
);

export = app;