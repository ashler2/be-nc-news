const express = require("express");
const topicRouter = express.Router();
const { fetchTopics, sendTopics } = require("../controllers/topicController");
const { send405Error } = require("../error/error");
topicRouter
  .route("/")
  .get(fetchTopics)
  .post(sendTopics)
  .all(send405Error);

module.exports = { topicRouter };
