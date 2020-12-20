exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("movie_genre")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("movie_genre").insert([
        // The Wild, Wild West
        { movieId: 8487, genreId: 37 },
        { movieId: 8487, genreId: 28 },
        { movieId: 8487, genreId: 878 },

        // West World 1973
        { movieId: 2362, genreId: 37 },
        { movieId: 2362, genreId: 28 },
        { movieId: 2362, genreId: 878 },

        // Rango
        { movieId: 44896, genreId: 37 },
      ]);
    });
};
