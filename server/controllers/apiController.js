const endPoint = require("../../endpoints.json");

const apiController = (req, res, next) => {
  res.status(200).send(endPoint);
};

module.exports = { apiController };
