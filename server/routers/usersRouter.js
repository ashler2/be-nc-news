const express = require("express");
const usersRouter = express.Router();
const fetchUserByUsername = require("../controllers/userController");

usersRouter.get("/:username", fetchUserByUsername);

module.exports = { usersRouter };
