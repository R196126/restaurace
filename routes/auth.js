const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");

// Registrace
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: "Chybí jméno nebo email nebo heslo" });

  try {
    const existUser = await User.findOne({ username });
    if (existUser) return res.status(400).json({ message: "Uživatel již existuje" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, passwordHash });
    await user.save();

    res.status(201).json({ message: "Uživatel vytvořen" });
  } catch (err) {
    res.status(500).json({ message: "Chyba serveru" });
  }
});

// Přihlášení
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Chybí jméno nebo heslo" });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Neplatné jméno nebo heslo" });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ message: "Špatné heslo" });

    const token = jwt.sign(
      { userId: user._id, username: username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Chyba při přihlašování" });
  }
});

module.exports = router;
