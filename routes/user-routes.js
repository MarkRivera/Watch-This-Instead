const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const Users = require("../data/models/userModel");
const {
  generateUserGenreRelationship,
} = require("../middleware/generateUserGenre");
const { validateUserCreation } = require("../middleware/schemaValidation");
const { userAlreadyExists, foundUser } = require("../middleware/users");
const { createNewUser } = require("../middleware/createNewUser");

const protectedRoute = require("../middleware/protected");
const {
  find,
  findById,
  add,
  update,
  remove,
} = require("../data/models/userModel");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", async (req, res, next) => {
  try {
    return res.json(await Users.find());
  } catch (error) {
    next(error);
  }
});

// CREATE
// POST - 201 CREATED
// CREATE A NEW USER

router.post(
  "/register",
  validateUserCreation,
  userAlreadyExists,
  createNewUser,
  generateUserGenreRelationship
);

router.post("/login", foundUser, async (req, res, next) => {
  try {
    const validPassword = await bcrypt.compare(
      req.body.password,
      req.foundUser.password
    );

    if (!validPassword)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(req.foundUser);

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

// UPDATE
// PUT
//  UPDATE A USER'S GENRES

// DELETE
// DELETE
// DELETE A USER

router.delete("/", isLoggedIn, async (req, res) => {
  try {
    const id = req.body.id;
    if (req.token.user_id !== id) {
      return res.status(400).json({ msg: "Invalid Request" });
    } else {
      const removed = await Users.remove(id);
      return res.status(200).json({ msg: "User Deleted Successfully" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Something went wrong on our side, sorry!" });
  }
});

router.get("/profile", protectedRoute, async (req, res) => {
  const user = await findById(req.token.user_id);
  console.log(user);
  return res.send("Found");
});

// Create User - Favorite Movie Relationship in Database
router.post("/favorite", isLoggedIn, async (req, res) => {
  try {
    // User will send { movieId: Number }
    const createUserMovie = await Users.createUserMovie({
      userId: req.token.user_id,
      movieId: req.body.movieId,
    });

    return res.status(201).json({ msg: "Movie successfully created" });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong while creating your favorite movie, sorry!",
    });
  }
});

// Read User - Favorite Movie Relationship in Database
router.get("/favorite", isLoggedIn, async (req, res) => {
  try {
    const userFavorites = await Users.readUserMovies(req.token.user_id);

    return res.status(200).json(userFavorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong, sorry!" });
  }
});

// Delete User - Favorite Movie Relationship in Database
router.delete("/favorite", isLoggedIn, async (req, res) => {
  try {
    const movieId = req.body.movieId;
    const removed = await Users.removeUserMovie(req.token.user_id, movieId);

    return res.status(200).json({
      msg: "Movie Deleted Successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Something went wrong on our side, sorry!" });
  }
});

// <-- -->

// Create User - Watched Movie Relationship in Database
router.post("/watched", isLoggedIn, async (req, res) => {
  try {
    // User will send { movieId: Number }
    const createUserWatched = await Users.createUserWatched({
      userId: req.token.user_id,
      movieId: req.body.movieId,
    });

    return res.status(201).json({ msg: "Watch link successfully created" });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong while linking your watched movie, sorry!",
    });
  }
});

// Read User - Watched Movie Relationship in Database
router.get("/watched", isLoggedIn, async (req, res) => {
  try {
    const userFavorites = await Users.readUserWatched(req.token.user_id);

    return res.status(200).json(userFavorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong, sorry!" });
  }
});

// Delete User - Watched Movie Relationship in Database
router.delete("/watched", isLoggedIn, async (req, res) => {
  try {
    const movieId = req.body.movieId;
    const removed = await Users.removeUserWatched(req.token.user_id, movieId);

    return res.status(200).json({
      msg: "Watch link deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Something went wrong on our side, sorry!" });
  }
});

// <-- -->

// Create User - Watch List Movie Relationship in Database
router.post("/watchlist", isLoggedIn, async (req, res) => {
  try {
    // User will send { movieId: Number }
    const createUserWatchItem = await Users.createUserWillWatch({
      userId: req.token.user_id,
      movieId: req.body.movieId,
    });

    return res
      .status(201)
      .json({ msg: "Will watch item successfully created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Something went wrong while linking your watch list, sorry!",
    });
  }
});

// Read User - Watch List Movie Relationship in Database
router.get("/watchlist", isLoggedIn, async (req, res) => {
  try {
    const userWatchList = await Users.readUserWillWatch(req.token.user_id);

    return res.status(200).json(userWatchList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong, sorry!" });
  }
});

// Delete User - Watch List Movie Relationship in Database
router.delete("/watchlist", isLoggedIn, async (req, res) => {
  try {
    const movieId = req.body.movieId;
    const removed = await Users.removeUserWillWatch(req.token.user_id, movieId);

    return res.status(200).json({
      msg: "Watch list item deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Something went wrong on our side, sorry!" });
  }
});

// <-- -->

// Create User - Genre Relationship in Database
router.post("/genre", isLoggedIn, async (req, res) => {
  try {
    // User will send { genreId: Number }
    const userGenre = await Users.createUserGenre({
      userId: req.token.user_id,
      genreId: req.body.genreId,
    });

    return res.status(201).json({ msg: "User Genre successfully created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Something went wrong while linking your watch list, sorry!",
    });
  }
});

// Read User - Genre Relationship in Database
router.get("/genre", isLoggedIn, async (req, res) => {
  try {
    const userGenres = await Users.readUserGenre(req.token.user_id);

    return res.status(200).json(userGenres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong, sorry!" });
  }
});

// Update User - Genre Relationship in Database:
router.put("/genre", isLoggedIn, async (req, res) => {
  try {
    const data = {
      userId: req.token.user_id,
      genreId: req.body.newGenreId,
    };

    await Users.updateUserGenre(req.token.user_id, req.body.oldId, data);

    return res.status(200).json({ msg: "User Genre Updated" });
  } catch (error) {
    res.status(500).json({ msg: "Error occurred during update, sorry!" });
  }
});

// Delete User - Genre Relationship in Database
router.delete("/genre", isLoggedIn, async (req, res) => {
  try {
    const genreId = req.body.genreId;
    const removed = await Users.removeUserGenre(req.token.user_id, genreId);

    return res.status(200).json({
      msg: "User Genre deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Something went wrong on our side, sorry!" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({ msg: "Invalid Token", token: null });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res
          .status(400)
          .json({ msg: "Bad request, invalid token", token: null });
      }

      res.status(200).json({ msg: "User verified", token: decoded });
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// UTIL Functions

function signToken(user) {
  const payload = {
    user_id: user.id,
    email: user.email,
  };

  const secret = process.env.JWT_SECRET;

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
