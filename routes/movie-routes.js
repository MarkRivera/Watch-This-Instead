const express = require("express");
const router = express.Router();

// 3rd Party
const { Random, MersenneTwister19937 } = require("random-js");
const axios = require("axios");

// Models
const genreModel = require("../data/models/genreModel");
const movieModel = require("../data/models/movieModel");
const Users = require("../data/models/userModel");

// Middleware
const isLoggedIn = require("../middleware/isLoggedIn");
const { max } = require("../data/dbConfig");
const dashBoardLogin = require("../middleware/dashboardLogIn");

// GET (for dashboard)
router.get("/", dashBoardLogin, async (req, res) => {
  // If the user isn't logged in, get three random movies based on random genres:
  if (!req.token) {
    let randomPages = [0, 0, 0];
    let randomGenreIDs = [0, 0, 0];

    // Generate three random numbers we will use to grab genres from the database
    randomGenreIDs = randomGenreIDs.map(() => generateRandomNumber(19));

    // Convert my Database IDs to TMDB IDs
    randomGenreIDs = randomGenreIDs.map(async id => {
      const genre = await genreModel.findById(id);
      return genre.tmdbId;
    });

    // Resolve the Promises
    let genreIdResults = (async () => {
      const results = await Promise.all(randomGenreIDs);
      return results;
    })();

    // Create queries for each ID to get a max num of pages:
    let queries = await genreIdResults;
    queries = queries.map(id => {
      const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${id}`;

      return axios.get(genreUrl);
    });

    let queryResults = (async () => {
      const results = await Promise.all(queries);
      return results;
    })();

    let results = await queryResults;

    // Generate three random numbers for the page numbers we will query in the API
    let maxNumOfPages = results.map(result => result.data.total_pages);

    randomPages = randomPages.map((num, index) =>
      generateRandomNumber(maxNumOfPages[index])
    );

    // Create query for each genre:
    let urlGenerator = results.map(async (genre, index) => {
      const genreIDs = await genreIdResults;
      const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${randomPages[index]}&with_genres=${genreIDs[index]}`;

      return genreUrl;
    });

    // Resolve Each URL promise
    let urlResolved = (async () => {
      const results = await Promise.all(urlGenerator);
      return results;
    })();

    const requestURLs = await urlResolved;

    // Get Movie Data from API
    const requestMovieData = requestURLs.map(url => axios.get(url));

    let movieDataResolved = (async () => {
      const results = await Promise.all(requestMovieData);
      return results;
    })();

    let movieData = await movieDataResolved;

    // Select only 3 movies
    let reducedMovieData = movieData.map(res => {
      let length = res.data.results.length;
      const randomNumber = generateRandomNumber(length);
      let movies = res.data.results;

      // Random number is normally indexed at 1, movies array is 0 indexed. Minus 1 from the random number so results don't become undefined if equal to 20
      return movies[randomNumber - 1];
    });

    // Check if these three movies exist in the database:
    const databaseMoviePromises = reducedMovieData.map(async movie => {
      const isInDatabase = await movieModel.findByTmdbId(movie.id);
      console.log(movie);
      // If they don't add them and set them in a list:
      if (!isInDatabase) {
        const schema = {
          tmdbId: movie.id,
          title: movie.title,
          year: parseInt(movie.release_date.slice(0, 4)),
          description: movie.overview,
        };

        const addedMovie = await movieModel.add(schema);
        return addedMovie;
      } else {
        // If they do set them in a list
        return isInDatabase;
      }
    });

    let threeMovies = (async () => {
      const results = await Promise.all(databaseMoviePromises);
      return results;
    })();

    // Send three movies to the client:
    res.status(200).json(await threeMovies);
  } else {
    let randomPages = [0, 0, 0];

    // Grab User genres:
    const genres = await Users.readUserGenre(req.token.user_id);
    const genreIds = genres.map(item => item.genreId);

    // Create queries for each ID to get a max num of pages:
    let queries = await genreIds;
    queries = queries.map(id => {
      const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${id}`;

      return axios.get(genreUrl);
    });

    let queryResults = (async () => {
      const results = await Promise.all(queries);
      return results;
    })();

    let results = await queryResults;
    // Generate three random numbers for the page numbers we will query in the API
    let maxNumOfPages = await results.map(result => result.data.total_pages);

    randomPages = randomPages.map((num, index) =>
      generateRandomNumber(maxNumOfPages[index])
    );

    // Create query for each genre:
    let urlGenerator = results.map(async (genre, index) => {
      const genreUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${randomPages[index]}&with_genres=${genreIds[index]}`;

      return genreUrl;
    });

    // Resolve Each URL promise
    let urlResolved = (async () => {
      const results = await Promise.all(urlGenerator);
      return results;
    })();

    const requestURLs = await urlResolved;

    // Get Movie Data from API
    const requestMovieData = requestURLs.map(url => axios.get(url));

    let movieDataResolved = (async () => {
      const results = await Promise.all(requestMovieData);
      return results;
    })();

    let movieData = await movieDataResolved;

    // Select only 3 movies
    let reducedMovieData = movieData.map(res => {
      let length = res.data.results.length;
      const randomNumber = generateRandomNumber(length);
      let movies = res.data.results;

      return movies[randomNumber];
    });

    // Check if these three movies exist in the database:
    const databaseMoviePromises = reducedMovieData.map(async movie => {
      const isInDatabase = await movieModel.findByTmdbId(movie.id);
      // If they don't add them and set them in a list:
      if (!isInDatabase) {
        const schema = {
          tmdbId: movie.id,
          title: movie.title,
          year: parseInt(movie.release_date.slice(0, 4)),
          description: movie.overview,
        };

        const addedMovie = await movieModel.add(schema);
        return addedMovie;
      } else {
        // If they do set them in a list
        return isInDatabase;
      }
    });

    let threeMovies = (async () => {
      const results = await Promise.all(databaseMoviePromises);
      return results;
    })();

    // Send three movies to the client:
    res.status(200).json(await threeMovies);
  }
});

const generateRandomNumber = num => {
  if (typeof num == "number") {
    const random = new Random(MersenneTwister19937.autoSeed());
    const value = random.integer(1, num); // Num is the max number of the range, inclusive.
    return value;
  }
};

module.exports = router;
