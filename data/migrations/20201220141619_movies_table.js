exports.up = async function (knex) {
  await knex.schema.createTable("movies", table => {
    table.increments("id").unsigned();
    table.integer("tmdbId").notNullable();
    table.string("title", 1000).notNullable();
    table.integer("year").unsigned();
    table.string("description", 1000);
    table.unique(["tmdbId"]);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable("movies");
};
