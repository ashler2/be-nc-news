const {
  getUserByUsername,
  postUser,
  getUsers
} = require("../models/userModel");

const fetchUserByUsername = (req, res, next) => {
  const params = req.params;

  return getUserByUsername(params)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

const sendUser = (req, res, next) => {
  const body = {
    username: req.body.username,
    avatar_url: req.body.avatar_url,
    name: req.body.name
  };

  return postUser(body)
    .then(user => {
      res.status(201).send({ user });
    })
    .catch(next);
};

const fetchUsers = (req, res, next) => {
  return getUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

module.exports = { fetchUserByUsername, sendUser, fetchUsers };
