const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token chybí" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token chybí" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Neplatný token" });
  }
};







