const connection = require("../connection");

const getUserByUsername = params => {
  return connection
    .select("*")
    .from("users")
    .where("username", params.username)
    .then(data => {
      return { user: data };
    });
};
//test for fetch username
module.exports = { getUserByUsername };
