const connection = require("../connection");

const getArticlesById = params => {
  return connection("articles")
    .select("articles.*")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .count("comments.article_id as comment_count ")
    .groupBy("articles.article_id", "comments.article_id")
    .where("articles.article_id", params.article_id)
    .then(([article]) => {
      if (article.comment_count === undefined) article.comment_count === 0;
      article.comment_count = Number(article.comment_count);
      return article;
    });
};

const patchVotes = (params, body) => {
  const votes = connection("articles")
    .where("articles.article_id", params.article_id)
    .returning("*");
  //has key name

  //incerment
  if (body.inc_votes > 0) votes.increment("votes", body.inc_votes);

  //decrement
  if (body.inc_votes < 0) votes.decrement("votes", Math.abs(body.inc_votes));

  return votes.then(([data]) => {
    return data;
  });

  return connection("articles")
    .where("articles.article_id", params.article_id)
    .increment("votes", body.inc_votes)
    .returning("*")
    .then(([data]) => {
      return data;
    });
};
module.exports = { getArticlesById, patchVotes };
