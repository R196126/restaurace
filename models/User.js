const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["customer", "worker", "admin"], default: "customer" },
});

// Metoda na ověření hesla
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};


module.exports = mongoose.model("User", userSchema);
