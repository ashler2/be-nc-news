const connection = require("../connection");

const getArticlesById = params => {
  return (
    connection("articles")
      .select("articles.*")
      .join("comments", "articles.article_id", "=", "comments.article_id")
      .count("comments.article_id as comment_count ")
      // count needs to deault to 0
      .groupBy("articles.article_id", "comments.article_id")
      .where("articles.article_id", params.article_id)
      .then(([article]) => {
        console.log(article);
        if (article.comment_count === undefined) article.comment_count === 0;
        article.comment_count = Number(article.comment_count);
        return article;
      })
  );
};

module.exports = { getArticlesById };
