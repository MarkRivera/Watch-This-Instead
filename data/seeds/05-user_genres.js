exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_genres")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("user_genres").insert([
        // Test User 1
        { userId: 1, genreId: 37 },
        { userId: 1, genreId: 28 },
        { userId: 1, genreId: 878 },

        // Test User 2
        { userId: 2, genreId: 37 },
        { userId: 2, genreId: 28 },
        { userId: 2, genreId: 878 },

        // Test User 3
        { userId: 3, genreId: 37 },
        { userId: 3, genreId: 28 },
        { userId: 3, genreId: 878 },
      ]);
    });
};
