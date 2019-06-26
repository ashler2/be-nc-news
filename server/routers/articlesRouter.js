const express = require("express");
const articleRouter = express.Router();
const {
  fetchArticlesById,
  updateVotes
} = require("../controllers/articlesController");

articleRouter
  .route("/:article_id")
  .get(fetchArticlesById)
  .patch(updateVotes);

module.exports = { articleRouter };
