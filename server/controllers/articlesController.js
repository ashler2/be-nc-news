const { getArticlesById } = require("../models/articlesModel");

const fetchArticlesById = (req, res, next) => {
  const params = req.params;
  return getArticlesById(params).then(articles => {
    res.status(200).send({ articles });
  });
};

module.exports = { fetchArticlesById };
