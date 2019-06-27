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
app.all("/*", send404UrlError);
app.use(errorPsql400s);

app.use(sendCustomError);
// how to test error 500
app.use(error500s);
module.exports = { app };
