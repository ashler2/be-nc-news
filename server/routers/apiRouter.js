const express = require("express");
const { send405Error } = require("../error/error");
const apiRouter = express.Router();
const { topicRouter } = require("./topicRouter");
const { usersRouter } = require("./usersRouter");
const { articleRouter } = require("./articlesRouter");
const { commentRouter } = require("./commentsRouter");
const { apiController } = require("../controllers/apiController");

apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);
apiRouter
  .route("/")
  .get(apiController)
  .all(send405Error);

module.exports = { apiRouter };
