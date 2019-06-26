const {
  getArticlesById,
  patchVotes,
  postComment,
  getComments
} = require("../models/articlesModel");

const fetchArticlesById = (req, res, next) => {
  const params = req.params;
  return getArticlesById(params)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const updateVotes = (req, res, next) => {
  const params = req.params;
  const body = req.body;

  return patchVotes(params, body)
    .then(update => {
      res.status(201).send({ update });
    })
    .catch(next);
};

const sendComment = (req, res, next) => {
  const params = req.params;
  const body = req.body;

  return postComment(params, body)
    .then(postedComment => {
      res.status(201).send({ postedComment });
    })
    .catch(next);
};

const fetchComment = (req, res, next) => {
  const params = req.params;
  return getComments(params)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

module.exports = { fetchArticlesById, updateVotes, sendComment, fetchComment };
