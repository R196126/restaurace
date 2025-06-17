const MenuItem = require("../models/MenuItem");

exports.getMenu = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Chyba serveru při načítání menu." });
  }
};

exports.getItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.menuId);
    if (!item) return res.status(404).json({ message: "ID položky nenalezeno" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Chyba serveru při hledání položky" });
  }
}


exports.addMenuItem = async (req, res) => {
  const { name, description, price, category, available } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Jméno a cena jsou povinné" });
  }

  try {
    const item = new MenuItem({ name, description, price: Number(price), category, available });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("Mongoose chyba:", err);
    res.status(500).json({ message: "Chyba při ukládání položky", error: err.message });
  }
  
};

exports.updateMenuItem = async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.menuId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Položka nenalezena" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Chyba při aktualizaci položky" });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.menuId);
    if (!deleted) return res.status(404).json({ message: "Položka nenalezena" });
    res.json({ message: "Položka smazána" });
  } catch (err) {
    res.status(500).json({ message: "Chyba při mazání položky" });
  }
};
