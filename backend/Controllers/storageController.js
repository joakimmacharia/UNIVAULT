const { supabase, supabaseAdmin } = require("../supabaseClient");

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

module.exports = { getAllUnits, getUnitById };
