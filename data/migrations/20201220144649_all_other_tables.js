exports.up = async function (knex) {
  await knex.schema
    .createTable("user_genres", table => {
      table
        .integer("userId")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
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

      table.primary(["userId", "genreId"]);
    })
    .createTable("user_watched_movies", table => {
      table
        .integer("userId")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table
        .integer("movieId")
        .unsigned()
        .notNullable()
        .references("tmdbId")
        .inTable("movies")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table.primary(["userId", "movieId"]);
    })

    .createTable("user_favorites", table => {
      table
        .integer("userId")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table
        .integer("movieId")
        .unsigned()
        .notNullable()
        .references("tmdbId")
        .inTable("movies")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table.primary(["userId", "movieId"]);
    })

    .createTable("user_watchlist", table => {
      table
        .integer("userId")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table
        .integer("movieId")
        .unsigned()
        .notNullable()
        .references("tmdbId")
        .inTable("movies")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      table.primary(["userId", "movieId"]);
    });
};

exports.down = async function (knex) {
  await knex.schema
    .dropTable("user_watchlist")
    .dropTable("user_favorites")
    .dropTable("user_watched_movies")
    .dropTable("user_genres");
};
