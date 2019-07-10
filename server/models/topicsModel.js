const connection = require("../connection");

const getTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .then(topics => {
      return { topics };
    });
};
const postTopic = body => {
  const { slug, description } = body;

  return connection("topics")
    .insert({ slug, description })
    .returning("*")
    .then(([topic]) => {
      return topic;
    });
};

module.exports = { getTopics, postTopic };
