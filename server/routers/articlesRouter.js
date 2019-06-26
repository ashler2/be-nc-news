const express = require("express");
const articleRouter = express.Router();
const {
  fetchArticlesById,
  updateVotes,
  sendComment,
  fetchComment
} = require("../controllers/articlesController");

articleRouter
  .route("/:article_id")
  .get(fetchArticlesById)
  .patch(updateVotes);

articleRouter
  .route("/:article_id/comments")
  .post(sendComment)
  .get(fetchComment);

module.exports = { articleRouter };
