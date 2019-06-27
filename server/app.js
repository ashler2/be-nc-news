const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const {
  errorPsql400s,
  send404UrlError,
  sendCustomError
} = require("./error/error");

app.use(express.json());
app.use("/api", apiRouter);
app.all("/*", send404UrlError);
app.use(errorPsql400s);

app.use(sendCustomError);

module.exports = { app };
