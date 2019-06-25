const express = require("express");
const articleRouter = express.Router();
const { fetchArticlesById } = require("../controllers/articlesController");

articleRouter.route("/:article_id").get(fetchArticlesById);

module.exports = { articleRouter };
