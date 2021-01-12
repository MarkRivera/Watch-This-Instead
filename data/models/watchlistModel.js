const db = require("../dbConfig");

async function find() {
  return await db("user_watchlist");
}

async function findByUserId(userId) {
  return await db("user_watchlist").where({ userId });
}

module.exports = {
  find,
  findByUserId,
};
