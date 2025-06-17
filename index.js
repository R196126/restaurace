const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const menuRoutes = require("./routes/menu");
const reviewRoutes = require("./routes/reviews");

const app = express();
const PORT = process.env.PORT || 5000;
const REACT_URL = process.env.REACT_URL || "http://localhost";

app.use(cors({ origin: "https://bohemia-noble.netlify.app", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reviews", reviewRoutes);

// Připojení k MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connection error:", err));

// Testovací endpoint
app.get("/", (req, res) => {
  res.send("Backend běží");
});

app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});


