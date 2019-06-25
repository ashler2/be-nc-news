const express = require("express");
const usersRouter = express.Router();
const { fetchUserByUsername } = require("../controllers/userController");
const { send405Error } = require("../error/error");

usersRouter
  .route("/:username")
  .get(fetchUserByUsername)
  .all(send405Error);

module.exports = { usersRouter };
