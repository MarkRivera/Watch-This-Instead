exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user_watchlist")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("user_watchlist").insert([
        // Test User 1
        { userId: 1, movieId: 44896 },

        // Test User 2

        // Test User 3
        { userId: 3, movieId: 2362 },
        { userId: 3, movieId: 44896 },
      ]);
    });
};
