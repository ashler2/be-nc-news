const { getTopics, postTopic } = require("../models/topicsModel");

const fetchTopics = (req, res, next) => {
  return getTopics()
    .then(topics => {
      res.status(200).send(topics);
    })
    .catch(next);
};
const sendTopics = (req, res, next) => {
  const body = req.body;
  return postTopic(body)
    .then(topic => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

module.exports = { fetchTopics, sendTopics };
