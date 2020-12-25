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

router.get("/", async (req, res, next) => {
  try {
    return res.json(await Users.find());
  } catch (error) {
    next(error);
  }
});

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

    const token = await signToken(req.foundUser);

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

router.get("/profile", protectedRoute, async (req, res) => {
  const user = await findById(req.token.user_id);
  console.log(user);
  return res.send("Found");
});

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
