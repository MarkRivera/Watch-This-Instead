const express = require("express");
const axios = require("axios");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Router
const UsersRouter = require("../routes/user-routes");
const MoviesRouter = require("../routes/movie-routes");

// Models
const {
  findById,
  add,
  update,
  remove,
  checkIfExists,
} = require("../data/models/genreModel");

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan("dev"));

try {
  const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}&language=en-US`;

  (async () => {
    // Get Genres Here:
    const { data } = await axios.get(genreUrl);
    const { genres } = data;

    // Check each genre and see if it exists in my database:
    genres.forEach(async genre => {
      const isInDatabase = await checkIfExists(genre.id);

      if (isInDatabase.length === 0) {
        // Create genre instance:
        const currentGenre = genre.name;

        const genreObject = {
          tmdbId: genre.id,
          genre: currentGenre,
          totalNumberOfUsers: 0,
        };

        add(genreObject, genre.id);
      }
    });
  })();
} catch (error) {
  next(error);
}

server.use("/api/users", UsersRouter);
server.use("/api/movies", MoviesRouter);

server.use("/status-check", (req, res) => {
  res.json({ message: "API up and running..." });
});

server.use("/", (error, req, res) => {
  if (process.env.DB_ENV !== "testing") console.log(error);
  res.status(500).json({ error: "Something went wrong", stack: error.stack });
});

module.exports = server;
