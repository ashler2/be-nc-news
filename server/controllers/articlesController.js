const { getArticlesById, patchVotes } = require("../models/articlesModel");

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
  console.log(params, body);
  return patchVotes(params, body)
    .then(update => {
      res.status(201).send({ update });
    })
    .catch(next);
};

module.exports = { fetchArticlesById, updateVotes };
