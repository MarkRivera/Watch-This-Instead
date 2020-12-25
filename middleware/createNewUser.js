const bcrypt = require("bcryptjs");
const Users = require("../data/models/userModel");

const createNewUser = async (req, res, next) => {
  try {
    const newUser = await Users.add({
      email: req.validUser.email,
      password: bcrypt.hashSync(req.validUser.password, 12),
    });

    // Return user and saved genres
    res.newUser = await newUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { createNewUser };
