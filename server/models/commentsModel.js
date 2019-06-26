const connection = require("../connection");

const patchVotes = (params, body) => {
  const votes = connection("comments")
    .where("comments.comment_id", params.comment_id)
    .returning("*");
  //has keys and integer
  if (!Number.isInteger(body.inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: "invaild format - { inc_votes: integer }"
    });
  }
  //incerment
  if (body.inc_votes > 0) votes.increment("votes", body.inc_votes);
  //decrement
  if (body.inc_votes < 0) votes.decrement("votes", Math.abs(body.inc_votes));

  return votes.then(([updatedComments]) => {
    // console.log(updatedVotes);
    return updatedComments;
  });
};

const destoryComment = params => {
  return connection("comments")
    .where("comment_id", params.comment_id)
    .del()
    .then(data => {
      return data;
    });
};

module.exports = { patchVotes, destoryComment };
