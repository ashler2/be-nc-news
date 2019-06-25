const connection = require("../connection");

const getTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .then(data => {
      return { topics: data };
    });
};

module.exports = { getTopics };
