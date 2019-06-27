const {
  getArticlesById,
  patchVotes,
  postComment,
  getComments,
  getArticles
} = require("../models/articlesModel");

const fetchArticles = (req, res, next) => {
  const queries = req.query;
  return getArticles(queries)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const fetchArticlesById = (req, res, next) => {
  const params = req.params;
  return getArticlesById(params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const updateVotes = (req, res, next) => {
  const params = req.params;
  const body = req.body;

  return patchVotes(params, body)
    .then(article => {
      res.status(200).send({ article });
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
  const queries = req.query;

  return getComments(params, queries)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

module.exports = {
  fetchArticlesById,
  updateVotes,
  sendComment,
  fetchComment,
  fetchArticles
};
