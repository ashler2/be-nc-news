const express = require("express");
const topicRouter = express.Router();
const { fetchTopics } = require("../controllers/topicController");
const { send405Error } = require("../error/error");
topicRouter
  .route("/")
  .get(fetchTopics)
  .all(send405Error);

module.exports = { topicRouter };
