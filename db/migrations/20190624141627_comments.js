exports.up = function(knex, Promise) {
  // console.log("comments table creation happening...");
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable
      .string("author")
      .references("users.username")
      .notNullable();
    commentsTable
      .integer("article_id")
      .references("articles.article_id")
      .notNullable();
    commentsTable.integer("votes").defaultTo(0);
    commentsTable
      .timestamp("created_at")
      .defaultTo(knex.fn.now())
      .notNullable();
    commentsTable.string("body", 1000).notNullable();
  });
};

exports.down = function(knex, Promise) {
  // console.log("comments table destoryed");
  return knex.schema.dropTable("comments");
};
