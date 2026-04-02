const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};