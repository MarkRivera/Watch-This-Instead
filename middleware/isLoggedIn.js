const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      req.token = null;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        req.token = null;
      }

      req.token = decoded;
    });

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isLoggedIn;
