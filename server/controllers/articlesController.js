const {
  getArticlesById,
  patchVotes,
  postComment,
  getComments,
  getArticles,
  postArticle,
  deleteArticle
} = require("../models/articlesModel");

const fetchArticles = (req, res, next) => {
  const queries = req.query;
  return getArticles(queries)
    .then(articles => {
      res.status(200).send(articles);
    })
    .catch(next);
};
const sendArticle = (req, res, next) => {
  const body = req.body;

  return postArticle(body)
    .then(article => {
      res.status(201).send(article);
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
    .then(comment => {
      res.status(201).send({ comment });
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

const destroyArticle = (req, res, next) => {
  const params = req.params;
  return deleteArticle(params).then(article => {
    res.status(200).send(article);
  });
};
module.exports = {
  fetchArticlesById,
  updateVotes,
  sendComment,
  fetchComment,
  fetchArticles,
  sendArticle,
  destroyArticle
};
