exports.errorPsql400s = (err, req, res, next) => {
  const codes = ["42703", "23503", "23502", "22P02"];
  //console.log(err.code);
  const message = { msg: "error: 400 - invalid input" };
  // console.log(err);
  if (err.code == "23503" || err.code === "23502")
    res.status(422).send({ msg: "un-processable entity" });
  if (codes.includes(err.code)) {
    res.status(400).send(message);
  } else {
    next(err);
  }
};
exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};
exports.send404UrlError = (req, res, next) => {
  res.status(404).send({ msg: "path does not exist" });
};
exports.sendCustomError = (err, req, res, next) => {
  if (err.status === 404) res.status(404).send(err);
  if (err.status === 400) res.status(400).send(err);
  else {
    next();
  }
};
exports.error500s = (err, req, res, next) => {
  res.status(500).send({ msg: "error: 500 - sever is leaking" });
};
