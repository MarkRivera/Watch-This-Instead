const db = require("../dbConfig");

function find() {
  return db("users");
}

function findById(id) {
  return db("users").select("id", "email").where({ id }).first();
}

function add(user) {
  return db("users")
    .insert(user)
    .then(ids => findById(ids[0]));
}

function update(changes, id) {
  return db("users").where({ id }).update(changes);
}

function remove(id) {
  return db("users").where({ id }).del();
}

module.exports = { find, findById, add, update, remove };
