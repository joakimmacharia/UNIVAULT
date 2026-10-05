const { supabase } = require("../supabaseClient");

/**
 * protectRoute — Express middleware that validates JWTs issued by Supabase.
 *
 * How it works:
 *  1. Extracts the Bearer token from the Authorization header.
 *  2. Calls supabase.auth.getUser(token) which asks Supabase to validate
 *     the JWT signature and expiry, then returns the associated user.
 *  3. Attaches the verified user object to req.user so downstream
 *     handlers can use it.
 *  4. If anything fails, returns a 401 Unauthorized response.
 *
 * Usage:
 *   const { protectRoute } = require("../Middleware/authMiddleware");
 *   router.get("/protected", protectRoute, (req, res) => { ... });
 */
const protectRoute = async (req, res, next) => {
  try {
    // ---------- Extract token ----------
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized — no token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized — malformed authorization header",
      });
    }

    // ---------- Validate JWT via Supabase ----------
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        error: "Unauthorized — invalid or expired token",
      });
    }

    // ---------- Attach user to request ----------
    req.user = data.user;

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({
      error: "Unauthorized — token validation failed",
    });
  }
};

module.exports = { protectRoute };
