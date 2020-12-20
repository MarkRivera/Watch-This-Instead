exports.up = async function (knex) {
  await knex.schema.createTable("movie_genre", table => {
    table
      .integer("movieId")
      .unsigned()
      .notNullable()
      .references("tmdbId")
      .inTable("movies");

    table
      .integer("genreId")
      .unsigned()
      .notNullable()
      .references("tmdbId")
      .inTable("genres");

    table.primary(["movieId", "genreId"]);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable("movie_genre");
};
