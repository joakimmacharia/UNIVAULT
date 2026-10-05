const { supabase, supabaseAdmin } = require("../supabaseClient");

/**
 * Register a new user
 * POST /api/auth/register
 * Body: { email, password, fullName, registrationNumber }
 *
 * Flow:
 *  1. Validates all required fields
 *  2. Signs the user up via Supabase Auth (creates auth.users row)
 *  3. Inserts a profile row into the public.profiles table with
 *     full_name and registration_number
 */
const register = async (req, res) => {
  try {
    const { email, password, fullName, registrationNumber, role } = req.body;

    // ---------- Validation ----------
    if (!email || !password || !fullName || !registrationNumber) {
      return res.status(400).json({
        error: "All fields are required (email, password, fullName, registrationNumber)",
      });
    }

    // Only students and landlords can self-register (admins are set manually).
    const accountRole = role === "landlord" ? "landlord" : "student";

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    // ---------- Create auth user in Supabase ----------
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          registration_number: registrationNumber,
          role: accountRole,
        },
      },
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // ---------- Insert profile row ----------
    // Use the admin client (bypasses RLS) when available; fall back to
    // the public client otherwise.
    const dbClient = supabaseAdmin || supabase;

    const profileRow = {
      id: authData.user.id,          // references auth.users.id
      email: email,
      full_name: fullName,
      registration_number: registrationNumber,
      role: accountRole,
    };

    // Upsert (not insert): Supabase auto-creates a profile row via a trigger
    // on signup, so a plain insert would collide on the primary key. Upsert
    // reconciles our fields (full_name, registration_number, role) either way.
    let { error: profileError } = await dbClient
      .from("profiles")
      .upsert(profileRow, { onConflict: "id" });

    // If the DB's role CHECK constraint doesn't allow 'landlord' yet
    // (migration 001 not run), retry as 'student' so the account still works.
    let roleDowngraded = false;
    if (profileError && profileError.code === "23514" && accountRole !== "student") {
      roleDowngraded = true;
      ({ error: profileError } = await dbClient
        .from("profiles")
        .upsert({ ...profileRow, role: "student" }, { onConflict: "id" }));
    }

    if (profileError) {
      console.error("Profile insert error:", profileError.message);
      // The auth user was already created — we still return success but
      // warn the caller so they can handle it.
      return res.status(201).json({
        message: "User registered but profile creation failed. Contact support.",
        user: authData.user,
        session: authData.session,
        profileWarning: profileError.message,
      });
    }

    // ---------- Success ----------
    const effectiveRole = roleDowngraded ? "student" : accountRole;
    return res.status(201).json({
      message: "User registered successfully",
      user: authData.user,
      session: authData.session,
      profile: {
        id: authData.user.id,
        email: email,
        full_name: fullName,
        registration_number: registrationNumber,
        role: effectiveRole
      },
      ...(roleDowngraded && {
        warning:
          "Registered as student — the 'landlord' role requires migration 001_landlord_id.sql to be run in Supabase.",
      }),
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Login an existing user
 * POST /api/auth/login
 * Body: { email, password }
 *
 * Flow:
 *  1. Validates credentials
 *  2. Authenticates via Supabase Auth
 *  3. Returns the session (which contains access_token + refresh_token)
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ---------- Validation ----------
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // ---------- Sign in ----------
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // ---------- Fetch Profile ----------
    const dbClient = supabaseAdmin || supabase;
    const { data: profile } = await dbClient
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    // ---------- Success ----------
    return res.status(200).json({
      message: "Login successful",
      user: data.user,
      session: data.session,
      profile: profile || null,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get the currently authenticated user's profile
 * GET /api/auth/me
 * Headers: Authorization: Bearer <access_token>
 *
 * Requires the protectRoute middleware to run first.
 */
const getMe = async (req, res) => {
  try {
    // req.user is set by the protectRoute middleware
    const userId = req.user.id;

    const dbClient = supabaseAdmin || supabase;

    const { data: profile, error } = await dbClient
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.status(200).json({
      user: req.user,
      profile,
    });
  } catch (err) {
    console.error("GetMe error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Logout the current user
 * POST /api/auth/logout
 * Headers: Authorization: Bearer <access_token>
 */
const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { register, login, getMe, logout };
