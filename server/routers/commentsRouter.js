const express = require("express");
const commentRouter = express.Router();
const { send405Error } = require("../error/error");
const {
  updateCommentVotes,
  deleteComment
} = require("../controllers/commentsController");

commentRouter
  .route("/:comment_id")
  .patch(updateCommentVotes)
  .delete(deleteComment)
  .all(send405Error);

module.exports = { commentRouter };
