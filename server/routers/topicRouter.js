const express = require("express");
const topicRouter = express.Router();
const { fetchTopics } = require("../controllers/topicController");

topicRouter.route("/").get(fetchTopics);

module.exports = { topicRouter };
