const db = require("../dbConfig");

async function find() {
  return await db("movies");
}

async function findById(id) {
  return await db("movies").where({ id }).first();
}

async function findByTmdbId(id) {
  return await db("movies").where({ tmdbId: id }).first();
}

async function add(movie) {
  return await db("movies")
    .insert(movie)
    .then(ids => findById(ids[0]))
    .catch(error => console.error(error));
}

async function update(changes, id) {
  return await db("movies").where({ id }).update(changes);
}

async function remove(id) {
  return await db("movies").where({ id }).del();
}

async function findMovieGenre(id, genres) {
  return await db("movie_genre")
    .where({ movieId: id })
    .then(result => console.log(result));
}

async function addMovieGenre(id, genres) {
  return await genres.forEach(genre =>
    db("movie_genre").insert({ movieId: id, genreId: genre.id })
  );
}

async function updateMovieGenre(id, genre) {
  return await db("movie_genre")
    .where({ movieId: id })
    .update({ genreId: genre.id });
}

async function removeMovieGenre(id, genre) {
  return await db("movie_genre")
    .where({ movieId: id, genreId: genre.id })
    .del();
}

module.exports = { find, findById, findByTmdbId, add, update, remove };
