const connection = require("../connection");

//could refactor to send getArticles to
const getArticlesById = params => {
  return connection("articles")
    .count("comments.article_id as comment_count ")
    .select("articles.*")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id", "comments.article_id")
    .where("articles.article_id", params.article_id)
    .then(([article]) => {
      article.comment_count = Number(article.comment_count);
      return article;
    });
};

const getArticles = queries => {
  return connection("articles")
    .count("comments.article_id as comment_count ")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id", "comments.article_id")
    .orderBy(queries.sort_by || "articles.created_at", queries.order || "Desc")
    .modify(query => {
      if (queries.author) query.where("articles.author", "=", queries.author);
      if (queries.topic) query.where("articles.topic", "=", queries.topic);
    })

    .then(articles => {
      return articles;
    });
};

const patchVotes = (params, body) => {
  const votes = connection("articles")
    .where("articles.article_id", params.article_id)
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

  return votes.then(([data]) => {
    return data;
  });
};

const postComment = (params, body) => {
  const article = Number(params.article_id);

  return connection("comments")
    .insert({
      author: body.username,
      article_id: article,
      body: body.body
    })
    .returning("*")
    .then(([postedComment]) => {
      return postedComment;
    });
};

const getComments = (params, queries) => {
  return connection("comments")
    .select("comments.*")
    .where("articles.article_id", "=", params.article_id)
    .join("articles", "articles.article_id", "=", "comments.article_id")
    .modify(query => {
      if (queries.sort_by)
        query.orderBy(queries.sort_by, queries.order || "ASC");
    })
    .then(data => {
      return data;
    });
};
module.exports = {
  getArticlesById,
  patchVotes,
  postComment,
  getComments,
  getArticles
};
