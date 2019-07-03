const express = require("express");
const articleRouter = express.Router();
const { send405Error } = require("../error/error");

const {
  fetchArticlesById,
  updateVotes,
  sendComment,
  fetchComment,
  fetchArticles,
  sendArticle,
  destroyArticle
} = require("../controllers/articlesController");

articleRouter
  .route("/")
  .get(fetchArticles)
  .post(sendArticle)
  .all(send405Error);

articleRouter
  .route("/:article_id")
  .get(fetchArticlesById)
  .patch(updateVotes)
  .delete(destroyArticle)
  .all(send405Error);

articleRouter
  .route("/:article_id/comments")
  .post(sendComment)
  .get(fetchComment)
  .all(send405Error);

module.exports = { articleRouter };
