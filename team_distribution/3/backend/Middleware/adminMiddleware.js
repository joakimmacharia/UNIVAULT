const { supabase, supabaseAdmin } = require("../supabaseClient");

/**
 * adminOnly — Express middleware that checks if the authenticated user
 * has the 'admin' role in the profiles table.
 *
 * Must be used AFTER protectRoute (which sets req.user).
 *
 * Usage:
 *   const { protectRoute } = require("../Middleware/authMiddleware");
 *   const { adminOnly } = require("../Middleware/adminMiddleware");
 *   router.get("/admin-route", protectRoute, adminOnly, handler);
 */
const adminOnly = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const dbClient = supabaseAdmin || supabase;

    const { data: profile, error } = await dbClient
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      return res.status(403).json({
        error: "Forbidden — unable to verify role",
      });
    }

    if (profile.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden — admin access required",
      });
    }

    // Attach role to request for downstream use
    req.userRole = "admin";
    next();
  } catch (err) {
    console.error("Admin middleware error:", err);
    return res.status(403).json({
      error: "Forbidden — role check failed",
    });
  }
};

module.exports = { adminOnly };
