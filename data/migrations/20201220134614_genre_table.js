exports.up = async function (knex) {
  await knex.schema.createTable("genres", table => {
    table.increments("id").unsigned();
    table.integer("tmdbId").unique().notNullable();
    table.string("genre").notNullable();
    table.integer("totalNumberOfUsers");
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable("genres");
};
