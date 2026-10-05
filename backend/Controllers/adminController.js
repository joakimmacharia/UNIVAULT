const { supabase, supabaseAdmin } = require("../supabaseClient");

/**
 * Admin Controller — provides admin-only endpoints for managing
 * UNIVAULT's storage units, bookings, users, and revenue.
 *
 * All handlers assume the request has already passed through
 * protectRoute + adminOnly middleware.
 */

// ---------- Dashboard Stats ----------
/**
 * GET /api/admin/stats
 * Returns aggregated dashboard statistics for the admin panel.
 */
const getDashboardStats = async (req, res) => {
  try {
    const dbClient = supabaseAdmin || supabase;

    // Fetch all bookings
    const { data: bookings, error: bookingsErr } = await dbClient
      .from("bookings")
      .select("id, status, total_price, created_at");

    if (bookingsErr) {
      console.error("Admin stats - bookings error:", bookingsErr.message);
      return res.status(500).json({ error: "Failed to fetch booking stats" });
    }

    // Fetch all storage units
    const { data: units, error: unitsErr } = await dbClient
      .from("storage_units")
      .select("id, is_available");

    if (unitsErr) {
      console.error("Admin stats - units error:", unitsErr.message);
      return res.status(500).json({ error: "Failed to fetch unit stats" });
    }

    // Fetch all profiles (user count)
    const { data: users, error: usersErr } = await dbClient
      .from("profiles")
      .select("id");

    if (usersErr) {
      console.error("Admin stats - users error:", usersErr.message);
      return res.status(500).json({ error: "Failed to fetch user stats" });
    }

    // Calculate stats
    const totalRevenue = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

    const activeBookings = bookings.filter(
      (b) => b.status === "confirmed" || b.status === "active"
    ).length;

    const cancelledBookings = bookings.filter(
      (b) => b.status === "cancelled"
    ).length;

    const completedBookings = bookings.filter(
      (b) => b.status === "completed"
    ).length;

    const availableUnits = units.filter((u) => u.is_available).length;
    const occupiedUnits = units.filter((u) => !u.is_available).length;

    return res.status(200).json({
      stats: {
        totalRevenue: totalRevenue.toFixed(2),
        totalBookings: bookings.length,
        activeBookings,
        cancelledBookings,
        completedBookings,
        totalUnits: units.length,
        availableUnits,
        occupiedUnits,
        totalUsers: users.length,
        occupancyRate:
          units.length > 0
            ? ((occupiedUnits / units.length) * 100).toFixed(1)
            : "0.0",
      },
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ---------- All Bookings ----------
/**
 * GET /api/admin/bookings
 * Returns all bookings in the system with user and unit details.
 */
const getAllBookings = async (req, res) => {
  try {
    const dbClient = supabaseAdmin || supabase;

    const { data: bookings, error } = await dbClient
      .from("bookings")
      .select("*, storage_units(*), profiles(full_name, email)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin getAllBookings error:", error.message);
      return res.status(500).json({ error: "Failed to fetch bookings" });
    }

    return res.status(200).json({ bookings });
  } catch (err) {
    console.error("getAllBookings error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ---------- All Users ----------
/**
 * GET /api/admin/users
 * Returns all registered users/profiles.
 */
const getAllUsers = async (req, res) => {
  try {
    const dbClient = supabaseAdmin || supabase;

    const { data: users, error } = await dbClient
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin getAllUsers error:", error.message);
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    return res.status(200).json({ users });
  } catch (err) {
    console.error("getAllUsers error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ---------- All Storage Units ----------
/**
 * GET /api/admin/units
 * Returns all storage units with their availability status.
 */
const getAllUnitsAdmin = async (req, res) => {
  try {
    const dbClient = supabaseAdmin || supabase;

    const { data: units, error } = await dbClient
      .from("storage_units")
      .select("*")
      .order("unit_number", { ascending: true });

    if (error) {
      console.error("Admin getAllUnits error:", error.message);
      return res.status(500).json({ error: "Failed to fetch units" });
    }

    return res.status(200).json({ units });
  } catch (err) {
    console.error("getAllUnitsAdmin error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ---------- Override Booking Status ----------
/**
 * PATCH /api/admin/bookings/:id/status
 * Body: { status }
 * Allows admin to override any booking's status.
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const dbClient = supabaseAdmin || supabase;

    const validStatuses = ["pending", "confirmed", "active", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Fetch existing booking
    const { data: booking, error: fetchErr } = await dbClient
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update the booking status
    const { data: updated, error: updateErr } = await dbClient
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select("*")
      .single();

    if (updateErr) {
      console.error("Admin updateBookingStatus error:", updateErr.message);
      return res.status(500).json({ error: "Failed to update booking" });
    }

    // If cancelled, release the unit; if confirmed/active, mark occupied
    if (status === "cancelled" || status === "completed") {
      await dbClient
        .from("storage_units")
        .update({ is_available: true })
        .eq("id", booking.storage_unit_id);
    } else if (status === "confirmed" || status === "active") {
      await dbClient
        .from("storage_units")
        .update({ is_available: false })
        .eq("id", booking.storage_unit_id);
    }

    return res.status(200).json({
      message: `Booking status updated to '${status}'`,
      booking: updated,
    });
  } catch (err) {
    console.error("updateBookingStatus error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getDashboardStats,
  getAllBookings,
  getAllUsers,
  getAllUnitsAdmin,
  updateBookingStatus,
};
