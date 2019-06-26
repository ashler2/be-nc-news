exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};
exports.sendCustomError = (err, req, res, next) => {
  if (err.status === 404) res.status(404).send(err);
  if (err.status === 400) res.status(400).send(err);
};
