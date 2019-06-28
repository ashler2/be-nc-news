const connection = require("../connection");

//could refactor to send getArticles to
const getArticlesById = params => {
  if (params.article_id != Number(params.article_id))
    return Promise.reject({
      status: 400,
      msg: "Error - 400 invalid input"
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
      msg: "error: 400 - invalid input"
    });
  }

  const b = connection("articles")
    .select("*")
    .modify(query => {
      if (queries.author) query.where("articles.author", "=", queries.author);
      if (queries.topic) query.where("articles.topic", "=", queries.topic);
    })
    .then(all => {
      return all.length;
    });

  const a = connection("articles")
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
    .limit(queries.limit || 10)
    .offset(queries.p * queries.limit || queries.p * 10 || 0)
    .modify(query => {
      if (queries.author) query.where("articles.author", "=", queries.author);
      if (queries.topic) query.where("articles.topic", "=", queries.topic);
    });

  return Promise.all([a, b]).then(([articles, total_count]) => {
    articles.forEach(
      article => (article.comment_count = parseInt(article.comment_count))
    );

    // pagination will cause this is no results
    if (articles.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "error: 404 - not found"
      });
    }

    return { articles, total_count };
  });
};
const postArticle = body => {
  return connection("articles")
    .insert({
      title: body.title,
      body: body.body,
      topic: body.topic,
      author: body.author
    })
    .returning("*")
    .then(([article]) => {
      return { article };
    });
};
// not returning the comment count
const patchVotes = (params, body) => {
  const votes = connection("articles")
    .where("articles.article_id", params.article_id)
    .returning("*")
    .increment("votes", body.inc_votes || 0);
  if (Object.keys(body).length === 0)
    return votes.then(([article]) => {
      return article;
    });

  //has keys and integer
  if (!Number.isInteger(body.inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: "invalid format - { inc_votes: integer }"
    });
  }

  return votes.then(([data]) => {
    return data;
  });
};

const postComment = (params, body) => {
  const article = Number(params.article_id);
  //way to check that username is a valid username

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

const getComments = ({ article_id }, queries) => {
  return connection("articles")
    .select("*")
    .where("article_id", "=", article_id)
    .then(exists => {
      if (exists.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Error 404: article not found"
        });
      }
    })
    .then(() => {
      return connection("comments")
        .select("comments.*")
        .where("articles.article_id", "=", article_id)
        .join("articles", "articles.article_id", "=", "comments.article_id")
        .orderBy(queries.sort_by || "created_at", queries.order || "DESC")
        .limit(queries.limit || 10)
        .offset(queries.p * queries.limit || queries.p * 10 || 0)
        .then(data => {
          return data;
        });
    });
};
module.exports = {
  getArticlesById,
  patchVotes,
  postComment,
  getComments,
  getArticles,
  postArticle
};
