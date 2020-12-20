exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("genres")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("genres").insert([
        { tmdbId: 37, genre: "Western", totalNumberOfUsers: 0 },
        { tmdbId: 28, genre: "Action", totalNumberOfUsers: 0 },
        { tmdbId: 878, genre: "Science Fiction", totalNumberOfUsers: 1 },
      ]);
    });
};
