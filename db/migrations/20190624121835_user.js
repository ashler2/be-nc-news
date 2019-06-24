exports.up = function(knex, Promise) {
  console.log("users table creation happening...");
  return knex.schema.createTable("users", usersTable => {
    usersTable
      .string("username")
      .unique("username")
      .primary()
      .notNullable();
    usersTable.string("avatar_url");
    usersTable.string("name").notNullable();
  });
};

exports.down = function(knex, Promise) {
  console.log("users table destoryed");
  return knex.schema.dropTable("users");
};
