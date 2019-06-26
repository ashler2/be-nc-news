const express = require("express");

const apiRouter = express.Router();
const { topicRouter } = require("./topicRouter");
const { usersRouter } = require("./usersRouter");
const { articleRouter } = require("./articlesRouter");
const { commentRouter } = require("./commentsRouter");
// apiRouter.get('/', )
apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);

module.exports = { apiRouter };
