const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../index.js");

const { formatDate, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex, Promise) {
  const topicsInsertions = knex("topics").insert(topicData);
  const usersInsertions = knex("users").insert(userData);
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return Promise.all([topicsInsertions, usersInsertions]).then(() => {
        const artData = formatDate(articleData);
        return knex("articles")
          .insert(artData)
          .returning("*");
      });
    })
    .then(articleRows => {
      formatDate(commentData);
      const articleRef = makeRefObj(articleRows, "article_id", "title");
      const formattedComments = formatComments(commentData, articleRef);
      return knex("comments").insert(formattedComments);
    });
};
