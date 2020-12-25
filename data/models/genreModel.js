const db = require("../dbConfig");

function find() {
  return db("genres");
}

async function findByTmdbId(id) {
  return await db("genres").where({ tmdbId: id }).first();
}

async function findById(id) {
  return await db("genres").where({ id }).first();
}

async function findByName(genre) {
  return await db("genres").where({ genre }).first();
}

async function checkIfExists(id) {
  return await db("genres").where({ tmdbId: id });
}

function add(genre, tmdbId) {
  return db("genres")
    .insert(genre)
    .then(id => findById(tmdbId));
}

async function addOne(id) {
  let total = await db("genres")
    .select("totalNumberOfUsers")
    .where({ tmdbId: id })
    .first();

  total = total.totalNumberOfUsers + 1;

  await db("genres").where({ tmdbId: id }).update({
    totalNumberOfUsers: total,
  });
  return await findByTmdbId(id);
}

function update(changes, id) {
  return db("genres").where({ id }).update(changes);
}

function remove(id) {
  return db("genres").where({ id }).del();
}

async function findUserGenre(id) {
  return await db("user_genres").where({ id });
}

async function addUserGenre(userId, genreId) {
  return db("user_genres").insert({ userId, genreId });
}

module.exports = {
  find,
  findById,
  findByTmdbId,
  findByName,
  findUserGenre,
  checkIfExists,
  add,
  addOne,
  addUserGenre,
  update,
  remove,
};
