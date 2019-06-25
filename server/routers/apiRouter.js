const express = require("express");

const apiRouter = express.Router();
const { topicRouter } = require("./topicRouter");
// apiRouter.get('/', )
apiRouter.use("/topics", topicRouter);

module.exports = { apiRouter };
