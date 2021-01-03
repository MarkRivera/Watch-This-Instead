const db = require("../dbConfig");

function find() {
  return db("users");
}

function findById(id) {
  return db("users").select("id", "email").where({ id }).first();
}

async function add(user) {
  const newUser = await db("users").insert(user);
  return await db("users").where({ email: user.email }).first();
}

function update(changes, id) {
  return db("users").where({ id }).update(changes);
}

function remove(id) {
  return db("users").where({ id }).del();
}

// User Favorite Relationships

// Create
async function createUserMovie(data) {
  const userMovie = await db("user_favorites").insert(data);
  return userMovie;
}

// Read
async function readUserMovies(userId) {
  const userMovies = await db("user_favorites").where({ userId });
  return userMovies;
}

// Delete
async function removeUserMovie(userId, movieId) {
  const userMovie = await db("user_favorites").where({ userId, movieId }).del();
  return userMovie;
}

// User Watched List

// Create
async function createUserWatched(data) {
  const userMovie = await db("user_watched_movies").insert(data);
  return userMovie;
}

// Read
async function readUserWatched(userId) {
  const userMovies = await db("user_watched_movies").where({ userId });
  return userMovies;
}

// Delete
async function removeUserWatched(userId, movieId) {
  const userMovie = await db("user_watched_movies")
    .where({ userId, movieId })
    .del();
  return userMovie;
}

// User Will Watch List

// Create
async function createUserWillWatch(data) {
  const userMovie = await db("user_watchlist").insert(data);
  return userMovie;
}

// Read
async function readUserWillWatch(userId) {
  const userMovies = await db("user_watchlist").where({ userId });
  return userMovies;
}

// Delete
async function removeUserWillWatch(userId, movieId) {
  const userMovie = await db("user_watchlist").where({ userId, movieId }).del();
  return userMovie;
}

// User - Genre Relationship

// Create
async function createUserGenre(data) {
  const userMovie = await db("user_genres").insert(data);
  return userMovie;
}

// Read
async function readUserGenre(userId) {
  const userMovies = await db("user_genres").where({ userId });
  return userMovies;
}

// Update
async function updateUserGenre(userId, genreId, data) {
  const userMovie = await db("user_genres")
    .where({ userId, genreId })
    .update(data);
  return userMovie;
}

// Delete
async function removeUserGenre(userId, genreId) {
  const userMovie = await db("user_genres").where({ userId, genreId }).del();
  return userMovie;
}

module.exports = {
  find,
  findById,
  add,
  update,
  remove,
  createUserMovie,
  readUserMovies,
  removeUserMovie,
  createUserWatched,
  readUserWatched,
  removeUserWatched,
  createUserWillWatch,
  readUserWillWatch,
  removeUserWillWatch,
  createUserGenre,
  readUserGenre,
  removeUserGenre,
};
