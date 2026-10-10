const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header && header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication is required." });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Your session has expired. Please log in again." });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only administrators can perform this action." });
  }
  return next();
}

module.exports = { requireAuth, requireAdmin };
