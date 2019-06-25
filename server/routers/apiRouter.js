const express = require("express");

const apiRouter = express.Router();
const { topicRouter } = require("./topicRouter");
const { usersRouter } = require("./usersRouter");
const { articleRouter } = require("../routers/articlesRouter");
// apiRouter.get('/', )
apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articleRouter);

module.exports = { apiRouter };
