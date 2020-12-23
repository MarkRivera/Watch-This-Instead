const jwt = require("jsonwebtoken");

const protectedRoute = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ msg: "Token is invalid or missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: "Token is invalid or missing" });
      }

      req.token = decoded;
    });

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protectedRoute;
