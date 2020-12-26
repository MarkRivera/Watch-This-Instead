const server = require("./data/server");

const PORT = process.env.PORT || 80;

server.listen(PORT, () => {
  console.log(`\n*** Server running at http://localhost:${PORT}... ***\n`);
});
