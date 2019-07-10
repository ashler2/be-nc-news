const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const {
  errorPsql400s,
  send404UrlError,
  sendCustomError,
  error500s
} = require("./error/error");

app.use(express.json());

app.use("/api", apiRouter);
app.use(errorPsql400s);

app.use(sendCustomError);

app.use(error500s);
app.all("/*", send404UrlError);

module.exports = { app };
