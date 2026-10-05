const { supabase, supabaseAdmin } = require("../supabaseClient");

/**
 * Create a new booking
 * POST /api/bookings
 * Headers: Authorization: Bearer <access_token>
 * Body: { storage_unit_id, start_date, end_date, notes }
 *
 * Flow:
 *  1. Validates required fields and date logic
 *  2. Checks that the storage unit exists and is available
 *  3. Calculates total price (months × price_per_month)
 *  4. Inserts booking with status 'confirmed'
 *  5. Sets the storage unit's is_available to false
 */
const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storage_unit_id, start_date, end_date, notes } = req.body;
    const dbClient = supabaseAdmin || supabase;

    // ---------- Validation ----------
    if (!storage_unit_id || !start_date || !end_date) {
      return res.status(400).json({
        error: "storage_unit_id, start_date, and end_date are required",
      });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        error: "end_date must be after start_date",
      });
    }

    // ---------- Check unit availability ----------
    const { data: unit, error: unitError } = await dbClient
      .from("storage_units")
      .select("*")
      .eq("id", storage_unit_id)
      .single();

    if (unitError || !unit) {
      return res.status(404).json({ error: "Storage unit not found" });
    }

    if (!unit.is_available) {
      return res.status(409).json({ error: "Storage unit is not available" });
    }

    // ---------- Calculate total price ----------
    // Difference in months (rounded up to at least 1 month)
    const msPerMonth = 1000 * 60 * 60 * 24 * 30; // ~30 days
    const months = Math.max(1, Math.ceil((endDate - startDate) / msPerMonth));
    const totalPrice = (months * parseFloat(unit.price_per_month)).toFixed(2);

    // ---------- Generate Smart Locker PIN ----------
    // Generate a random 6-digit string for physical locker access
    const accessPin = Math.floor(100000 + Math.random() * 900000).toString();

    // ---------- Insert booking ----------
    const { data: booking, error: bookingError } = await dbClient
      .from("bookings")
      .insert({
        user_id: userId,
        storage_unit_id,
        start_date,
        end_date,
        status: "confirmed",
        total_price: totalPrice,
        notes: notes || null,
        access_pin: accessPin,
      })
      .select("*")
      .single();

    if (bookingError) {
      console.error("Create booking error:", bookingError.message);
      return res.status(500).json({ error: "Failed to create booking" });
    }

    // ---------- Mark unit as unavailable ----------
    const { error: updateError } = await dbClient
      .from("storage_units")
      .update({ is_available: false })
      .eq("id", storage_unit_id);

    if (updateError) {
      console.error("Update unit availability error:", updateError.message);
      // Booking was created — warn but don't fail
    }

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    console.error("CreateBooking error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all bookings for the authenticated user
 * GET /api/bookings/me
 * Headers: Authorization: Bearer <access_token>
 */
const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const dbClient = supabaseAdmin || supabase;

    const { data: bookings, error } = await dbClient
      .from("bookings")
      .select("*, storage_units(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get my bookings error:", error.message);
      return res.status(500).json({ error: "Failed to fetch bookings" });
    }

    return res.status(200).json({ bookings });
  } catch (err) {
    console.error("GetMyBookings error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get a single booking by ID (must belong to the authenticated user)
 * GET /api/bookings/:id
 * Headers: Authorization: Bearer <access_token>
 */
const getBookingById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const dbClient = supabaseAdmin || supabase;

    const { data: booking, error } = await dbClient
      .from("bookings")
      .select("*, storage_units(*)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error || !booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.status(200).json({ booking });
  } catch (err) {
    console.error("GetBookingById error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Cancel a booking
 * PATCH /api/bookings/:id/cancel
 * Headers: Authorization: Bearer <access_token>
 *
 * Flow:
 *  1. Verifies the booking belongs to the authenticated user
 *  2. Sets booking status to 'cancelled'
 *  3. Sets the storage unit's is_available back to true
 */
const cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const dbClient = supabaseAdmin || supabase;

    // ---------- Fetch the booking ----------
    const { data: booking, error: fetchError } = await dbClient
      .from("bookings")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError || !booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ error: "Booking is already cancelled" });
    }

    // ---------- Cancel the booking ----------
    const { data: updatedBooking, error: updateError } = await dbClient
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      console.error("Cancel booking error:", updateError.message);
      return res.status(500).json({ error: "Failed to cancel booking" });
    }

    // ---------- Release the storage unit ----------
    const { error: unitError } = await dbClient
      .from("storage_units")
      .update({ is_available: true })
      .eq("id", booking.storage_unit_id);

    if (unitError) {
      console.error("Release unit error:", unitError.message);
      // Booking was cancelled — warn but don't fail
    }

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (err) {
    console.error("CancelBooking error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createBooking, getMyBookings, getBookingById, cancelBooking };
