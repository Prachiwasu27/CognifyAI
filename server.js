const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// =====================
// MIDDLEWARES
// =====================
app.use(cors());
app.use(express.json());

// =====================
// SERVE FRONTEND STATIC FILES
// =====================
app.use(express.static(path.join(__dirname, "public")));

// =====================
// API ROUTES
// =====================
const aiRoutes = require('./aiRoutes');
app.use("/api/ai", aiRoutes);

// =====================
// DEFAULT ROUTE (FOR SPA SUPPORT)
// =====================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =====================
// SERVER START
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});

