const express = require("express");

const apiRouter = express.Router();
const { topicRouter } = require("./topicRouter");
const { usersRouter } = require("./usersRouter");
// apiRouter.get('/', )
apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", usersRouter);

module.exports = { apiRouter };
