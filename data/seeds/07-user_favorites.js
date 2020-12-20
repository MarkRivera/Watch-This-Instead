exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_favorites")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("user_favorites").insert([
        // Test User 1
        { userId: 1, movieId: 8487 },
        { userId: 1, movieId: 2362 },

        // Test User 2
        { userId: 2, movieId: 8487 },
        { userId: 2, movieId: 2362 },
        { userId: 2, movieId: 44896 },

        // Test User 3
        { userId: 3, movieId: 8487 },
      ]);
    });
};
