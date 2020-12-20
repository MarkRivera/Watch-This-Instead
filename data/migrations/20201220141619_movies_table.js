exports.up = async function (knex) {
  await knex.schema.createTable("movies", table => {
    table.increments("id").unsigned();
    table.integer("tmdbId").notNullable();
    table.string("title").notNullable();
    table.integer("year").unsigned();
    table.string("description");
    table.unique(["tmdbId"]);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable("movies");
};
