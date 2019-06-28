const connection = require("../connection");

const patchVotes = (params, body) => {
  const votes = connection("comments")
    .where("comments.comment_id", params.comment_id)
    .returning("*")
    .increment("votes", body.inc_votes || 0);
  //200 when no body sent
  if (Object.keys(body).length === 0)
    return votes.then(([comment]) => {
      return comment;
    });

  //has keys and integer
  if (!Number.isInteger(body.inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: "invalid format - { inc_votes: integer }"
    });
  }
  return votes.then(([updatedComments]) => {
    if (!updatedComments) {
      return Promise.reject({
        status: 404,
        msg: "error 404: comment not found"
      });
    }
    return updatedComments;
  });
};

const destroyComment = params => {
  return connection("comments")
    .where("comment_id", params.comment_id)
    .del()
    .then(deleteCount => {
      if (deleteCount === 0)
        return Promise.reject({
          status: 404,
          msg: "error 404: comment not found"
        });
      else {
        return deleteCount;
      }
    });
};

module.exports = { patchVotes, destroyComment };
