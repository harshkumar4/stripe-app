const errorHandler = require("./errorHandler");
const jwt = require("jsonwebtoken");

const isAuthenticated = errorHandler((req, res, next) => {
  try {
    const bearerToken = req.get("Authorization");

    if (!bearerToken) {
      res.status(403).json({ message: "Authorization Missing!" });
      return;
    }
    const jwttoken = bearerToken.split(" ")[1];

    if (!jwttoken) {
      res.status(403).json({ message: "Token Missing!" });
      return;
    }

    const decodedToken = jwt.verify(jwttoken, process.env.JWT_PASSWORD_KEY);
    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(403).json({ message: "Invalid Token!" });
      return;
    }
    if (error.name === "TokenExpiredError") {
      res.status(403).json({ message: "Expired Token!" });
      return;
    }
    throw error;
  }
});

module.exports = isAuthenticated;
