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

async function checkIfExists(id) {
  return await db("genres").where({ tmdbId: id });
}

function add(genre, tmdbId) {
  return db("genres")
    .insert(genre)
    .then(id => findById(tmdbId));
}

function update(changes, id) {
  return db("genres").where({ id }).update(changes);
}

function remove(id) {
  return db("genres").where({ id }).del();
}

module.exports = {
  find,
  findById,
  findByTmdbId,
  checkIfExists,
  add,
  update,
  remove,
};
