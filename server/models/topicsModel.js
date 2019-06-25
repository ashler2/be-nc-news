const connection = require("../connection");

const getTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .then(data => {
      return data;
    });
};

module.exports = { getTopics };
