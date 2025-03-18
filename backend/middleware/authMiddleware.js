const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password"); // Attach user data (excluding password)
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized: Invalid Token" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized: No Token Provided" });
  }
};

module.exports = { protect };
