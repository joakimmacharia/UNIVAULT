const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- Routes ---------------
const authRoutes = require("./Routes/authRoutes");
const storageRoutes = require("./Routes/storageRoutes");
const bookingRoutes = require("./Routes/bookingRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const assistantRoutes = require("./Routes/assistantRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/assistant", assistantRoutes);

// Health-check
app.get("/", (req, res) => {
  res.send("Unit Vault Backend Running");
});

// --------------- Start Server ---------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});