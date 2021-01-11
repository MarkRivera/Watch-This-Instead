const express = require("express");
const router = express.Router();

// 3rd Party
const axios = require("axios");

// Models
const genreModel = require("../data/models/genreModel");
const movieModel = require("../data/models/movieModel");
const Users = require("../data/models/userModel");

// Middleware
const isLoggedIn = require("../middleware/isLoggedIn");
const { max } = require("../data/dbConfig");
const dashBoardLogin = require("../middleware/dashboardLogIn");
const getMovies = require("../middleware/getMovies");

// GET (for dashboard)
router.get("/", dashBoardLogin, getMovies, async (req, res) => {
  let movies = req.movies;

  // Get Poster URLs
  let posters = movies.map(async movie => {
    try {
      const query = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.tmdbId}/images?api_key=${process.env.API_KEY}`
      );

      if (query.data.posters[0]) return query.data.posters[0].file_path;
      return null;
    } catch (error) {
      console.error(error);
    }
  });

  posters = (async () => {
    const results = await Promise.all(posters);
    return results;
  })();

  const resolvedPosters = await posters;
  // Create real url that will return poster images:
  const posterURLs = resolvedPosters.map(url => {
    if (url) return `https://image.tmdb.org/t/p/w300_and_h450_bestv2${url}`;
  });

  posterURLs.forEach((url, index) => (req.movies[index].posterUrl = url));

  res.status(200).json(req.movies);
});

module.exports = router;
