const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  console.log("\n========== AUTH MIDDLEWARE ==========");

  const authHeader = req.headers.authorization;

  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    console.log("❌ NO AUTHORIZATION HEADER");

    return res.status(401).json({
      message: "Not authorized - no token",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    console.log("❌ WRONG AUTHORIZATION FORMAT");

    return res.status(401).json({
      message: "Not authorized - invalid format",
    });
  }

  try {
    const token = authHeader.split(" ")[1];

    console.log(
      "Token received:",
      token ? "YES" : "NO"
    );

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("✅ TOKEN VERIFIED");
    console.log("Decoded JWT:", decoded);

    req.user = decoded;

    console.log("req.user:", req.user);
    console.log("====================================\n");

    next();
  } catch (error) {
    console.log("❌ JWT ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid token",
      error: error.message,
    });
  }
};

module.exports = protect;