const connection = require("../connection");

//could refactor to send getArticles to
const getArticlesById = params => {
  if (params.article_id != Number(params.article_id))
    return Promise.reject({
      status: 400,
      msg: "Error - 400 invaild input"
    });

  return connection("articles")
    .count("comments.article_id as comment_count ")
    .select("articles.*")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .groupBy("articles.article_id", "comments.article_id")
    .where("articles.article_id", params.article_id)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "article does not exist"
        });
      }
      article.comment_count = Number(article.comment_count);

      return article;
    });
};

const getArticles = queries => {
  if (queries.order) queries.order = queries.order.toLowerCase();

  if (!["asc", "desc", undefined].includes(queries.order)) {
    return Promise.reject({
      status: 400,
      msg: "error: 400 - invalid innput"
    });
  }

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
      articles.forEach(
        article => (article.comment_count = parseInt(article.comment_count))
      );
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "error: 404 - not found"
        });
      }

      return articles;
    });
};
// not returning the comment count
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
  //way to check that username is a vaild username
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
