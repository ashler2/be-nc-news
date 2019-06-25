exports.up = function(knex, Promise) {
  console.log("articles table creation happening...");
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable.string("body", 10000);
    articlesTable.integer("votes").defaultTo(0);
    articlesTable
      .string("topic")
      .references("slug")
      .inTable("topics")
      .notNullable();
    articlesTable
      .string("author")
      .references("users.username")
      .notNullable();
    articlesTable.timestamp("created_at");
  });
};

exports.down = function(knex, Promise) {
  console.log("articles table destoryed");
  return knex.schema.dropTable("articles");
};
