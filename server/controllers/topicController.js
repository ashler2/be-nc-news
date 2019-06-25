const { getTopics } = require("../models/topicsModel");

const fetchTopics = (req, res, next) => {
  return getTopics().then(topics => {
    res.status(200).send(topics);
  });
};

module.exports = { fetchTopics };
