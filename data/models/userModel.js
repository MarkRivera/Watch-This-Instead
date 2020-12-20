const db = require("../dbConfig");

async function find() {
  return await db("users");
}

async function findById(id) {
  return await db("users").where({ id }).first();
}

async function add(user) {
  return await db("users")
    .insert(user)
    .then(ids => findById(ids[0]));
}

async function update(changes, id) {
  return await db("users").where({ id }).update(changes);
}

async function remove(id) {
  return await db("users").where({ id }).del();
}

module.exports = { find, findById, add, update, remove };
