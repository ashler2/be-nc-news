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
// need to change so the user cannot be a lenght of 0
const postUser = body => {
  return connection("users")
    .insert(body)
    .returning("*")
    .then(([user]) => {
      return user;
    });
};
const getUsers = () => {
  return connection("users")
    .select("*")
    .then(users => {
      return users;
    });
};

module.exports = { getUserByUsername, postUser, getUsers };
