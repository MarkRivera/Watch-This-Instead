exports.up = async function (knex) {
  await knex.schema.createTable("movie_genre", table => {
    table
      .integer("movieId")
      .unsigned()
      .notNullable()
      .references("tmdbId")
      .inTable("movies")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    table
      .integer("genreId")
      .unsigned()
      .notNullable()
      .references("tmdbId")
      .inTable("genres")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    table.primary(["movieId", "genreId"]);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable("movie_genre");
};
