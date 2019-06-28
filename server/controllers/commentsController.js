const { patchVotes, destroyComment } = require("../models/commentsModel");

const updateCommentVotes = (req, res, next) => {
  const params = req.params;
  const body = req.body;
  return patchVotes(params, body)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
const deleteComment = (req, res, next) => {
  const params = req.params;

  return destroyComment(params)
    .then(() => {
      res.status(204).send({ msg: "content deleted" });
    })
    .catch(next);
};
module.exports = { updateCommentVotes, deleteComment };
