const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const { sendCustomError } = require("./error/error");

app.use(express.json());
app.use("/api", apiRouter);
app.use(sendCustomError);
module.exports = { app };
