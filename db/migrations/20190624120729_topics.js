exports.up = function(knex, Promise) {
  console.log("topics table creation happening...");
  return knex.schema.createTable("topics", topicTable => {
    topicTable
      .string("slug")
      .primary()
      .notNullable();
    topicTable.string("description").notNullable();
  });
};

exports.down = function(knex, Promise) {
  console.log("topics table destoryed");
  return knex.schema.dropTable("topics");
};
