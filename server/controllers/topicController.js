const { getTopics } = require("../models/topicsModel");

const fetchTopics = (req, res, next) => {
  return getTopics()
    .then(topics => {
      res.status(200).send(topics);
    })
    .catch(next);
};

module.exports = { fetchTopics };
