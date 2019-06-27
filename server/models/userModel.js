const connection = require("../connection");

const getUserByUsername = params => {
  return connection
    .select("*")
    .from("users")
    .where("username", params.username)
    .then(([user]) => {
      if (!user)
        return Promise.reject({
          status: 404,
          msg: "404 - invalid username"
        });
      return user;
    });
};

module.exports = { getUserByUsername };
