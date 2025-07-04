const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, enum: ["hlavní", "předkrm", "dezert", "nápoj"], default: "hlavní" },
  available: { type: Boolean, default: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model("MenuItem", menuItemSchema, "menu");

