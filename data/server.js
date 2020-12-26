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

server.use("/api/users", UsersRouter);
server.use("/api/movies", MoviesRouter);

server.use(async function (req, res) {
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
    console.error(error);
    next(error);
  }
});

server.get("/", (req, res) => {
  try {
    res.status(200).send("Api is up and running!");
  } catch (error) {
    next(error);
  }
});

server.use(function (req, res) {
  res.status(404).send("Hmm... I can't seem to find what you're looking for");
});

server.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ error: "Something went wrong", stack: error.stack });
});

module.exports = server;
