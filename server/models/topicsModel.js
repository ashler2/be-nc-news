const connection = require("../connection");

const getTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .then(topics => {
      return { topics };
    });
};

module.exports = { getTopics };
