exports.up = function(knex, Promise) {
  console.log("articles table creation happening...");
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("user_id").primary();
    articlesTable.string("title");
    articlesTable.string("body");
    articlesTable.integer("votes").defaultTo(0);
    articlesTable.string("topic").references("topics.slug");
    articlesTable.string("topic").references("users.username");
  });
};

exports.down = function(knex, Promise) {};
