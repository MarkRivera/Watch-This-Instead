const jwt = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      req.token = null;
      return res.status(401).json({ msg: "Please Sign In" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        req.token = null;
        return res.status(400).json({ msg: "Bad Request, invalid token" });
      }
      req.token = decoded;
    });

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isLoggedIn;
