const { getUserByUsername } = require("../models/userModel");

const fetchUserByUsername = (req, res, next) => {
  const params = req.params;

  return getUserByUsername(params)
    .then(user => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports = { fetchUserByUsername };
