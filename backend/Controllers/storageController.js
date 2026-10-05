const { supabase, supabaseAdmin } = require("../supabaseClient");

// True when an error means the landlord_id column doesn't exist yet
// (migration 001 not run). Postgres reports 42703 on SELECT/filter, while
// PostgREST reports PGRST204 ("could not find column") on INSERT.
const isMissingLandlordColumn = (error) =>
  !!error &&
  (error.code === "42703" ||
    error.code === "PGRST204" ||
    /landlord_id/i.test(error.message || ""));

/**
 * Get all storage units
 * GET /api/storage
 * Query params:
 *   ?size=small|medium|large
 *   ?available=true|false
 *   ?location=string
 *   ?search=string
 *   ?minPrice=num
 *   ?maxPrice=num
 *   ?page=num (default 1)
 *   ?limit=num (default 10)
 */
const getAllUnits = async (req, res) => {
  try {
    const dbClient = supabaseAdmin || supabase;

    // Use count: 'exact' to get the total number of matching rows for pagination
    let query = dbClient.from("storage_units").select("*", { count: "exact" });

    // ---------- Optional filters ----------
    const { size, available, location, search, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    if (size) {
      query = query.eq("size", size);
    }

    if (available !== undefined && available !== "") {
      query = query.eq("is_available", available === "true");
    }

    if (location) {
      query = query.ilike("location", `%${location}%`);
    }

    if (search) {
      // Search in description, building, or location
      query = query.or(`description.ilike.%${search}%,building.ilike.%${search}%,location.ilike.%${search}%`);
    }

    if (minPrice) {
      query = query.gte("price_per_month", minPrice);
    }

    if (maxPrice) {
      query = query.lte("price_per_month", maxPrice);
    }

    // ---------- Pagination ----------
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    query = query.range(from, to);

    // ---------- Execute ----------
    const { data: units, count, error } = await query.order("unit_number", {
      ascending: true,
    });

    if (error) {
      console.error("Get all units error:", error.message);
      return res.status(500).json({ error: "Failed to fetch storage units" });
    }

    return res.status(200).json({
      units,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (err) {
    console.error("GetAllUnits error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get a single storage unit by ID
 * GET /api/storage/:id
 */
const getUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    const dbClient = supabaseAdmin || supabase;

    const { data: unit, error } = await dbClient
      .from("storage_units")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !unit) {
      return res.status(404).json({ error: "Storage unit not found" });
    }

    return res.status(200).json({ unit });
  } catch (err) {
    console.error("GetUnitById error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Create a new storage unit (landlord listing)
 * POST /api/storage
 * Headers: Authorization: Bearer <access_token>
 * Body: { unit_number?, size, location, building?, description?, price_per_month, is_available? }
 *
 * The authenticated user becomes the landlord (landlord_id). If the
 * landlord_id column has not been added yet (migration 001), the insert
 * gracefully retries without it so listings still work.
 */
const createUnit = async (req, res) => {
  try {
    const dbClient = supabaseAdmin || supabase;
    const landlordId = req.user.id;
    const {
      unit_number,
      size,
      location,
      building,
      description,
      price_per_month,
      is_available,
    } = req.body;

    // ---------- Validation ----------
    if (!size || !location || !price_per_month) {
      return res.status(400).json({
        error: "size, location, and price_per_month are required",
      });
    }
    if (!["small", "medium", "large"].includes(size)) {
      return res.status(400).json({ error: "size must be small, medium, or large" });
    }
    if (isNaN(parseFloat(price_per_month)) || parseFloat(price_per_month) <= 0) {
      return res.status(400).json({ error: "price_per_month must be a positive number" });
    }

    // Auto-generate a unit number if the landlord didn't supply one.
    const generatedNumber = `SU-${Date.now().toString().slice(-6)}`;

    const baseRow = {
      unit_number: unit_number?.trim() || generatedNumber,
      size,
      location: location.trim(),
      building: building?.trim() || null,
      description: description?.trim() || null,
      price_per_month: parseFloat(price_per_month),
      is_available: is_available === undefined ? true : !!is_available,
    };

    // Try with landlord_id; fall back if the column doesn't exist yet.
    let insertRes = await dbClient
      .from("storage_units")
      .insert({ ...baseRow, landlord_id: landlordId })
      .select("*")
      .single();

    let migrationNeeded = false;
    if (isMissingLandlordColumn(insertRes.error)) {
      migrationNeeded = true;
      insertRes = await dbClient
        .from("storage_units")
        .insert(baseRow)
        .select("*")
        .single();
    }

    if (insertRes.error) {
      console.error("Create unit error:", insertRes.error.message);
      return res.status(500).json({ error: "Failed to create storage unit" });
    }

    return res.status(201).json({
      message: "Storage unit listed successfully",
      unit: insertRes.data,
      ...(migrationNeeded && {
        warning:
          "Listing created, but ownership isn't tracked yet. Run migration 001_landlord_id.sql to enable 'My Listings'.",
      }),
    });
  } catch (err) {
    console.error("CreateUnit error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all storage units owned by the authenticated landlord
 * GET /api/storage/mine
 * Headers: Authorization: Bearer <access_token>
 */
const getMyUnits = async (req, res) => {
  try {
    const dbClient = supabaseAdmin || supabase;
    const landlordId = req.user.id;

    const { data: units, error } = await dbClient
      .from("storage_units")
      .select("*")
      .eq("landlord_id", landlordId)
      .order("unit_number", { ascending: true });

    if (error) {
      // Column not migrated yet — return empty with a hint instead of failing.
      if (isMissingLandlordColumn(error)) {
        return res.status(200).json({ units: [], migrationNeeded: true });
      }
      console.error("Get my units error:", error.message);
      return res.status(500).json({ error: "Failed to fetch your listings" });
    }

    return res.status(200).json({ units });
  } catch (err) {
    console.error("GetMyUnits error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a storage unit (must belong to the authenticated landlord)
 * DELETE /api/storage/:id
 * Headers: Authorization: Bearer <access_token>
 */
const deleteUnit = async (req, res) => {
  try {
    const dbClient = supabaseAdmin || supabase;
    const landlordId = req.user.id;
    const { id } = req.params;

    const { data: unit, error: fetchError } = await dbClient
      .from("storage_units")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !unit) {
      return res.status(404).json({ error: "Storage unit not found" });
    }

    // Ownership check (only enforceable once landlord_id exists).
    if (unit.landlord_id !== undefined && unit.landlord_id !== landlordId) {
      return res.status(403).json({ error: "You can only delete your own listings" });
    }

    const { error: deleteError } = await dbClient
      .from("storage_units")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Delete unit error:", deleteError.message);
      return res.status(500).json({ error: "Failed to delete storage unit" });
    }

    return res.status(200).json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error("DeleteUnit error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getAllUnits, getUnitById, createUnit, getMyUnits, deleteUnit };
