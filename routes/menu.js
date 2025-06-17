const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const requireRole = require("../middleware/roleMiddleware");
const menuCtrl = require("../controllers/menuController");

router.get("/", menuCtrl.getMenu);
router.post("/", auth, requireRole("worker", "admin"), menuCtrl.addMenuItem);
router.get("/:menuId", menuCtrl.getItem)
router.put("/:menuId", auth, requireRole("worker", "admin"), menuCtrl.updateMenuItem);
router.delete("/:menuId", auth, requireRole("worker", "admin"), menuCtrl.deleteMenuItem);

module.exports = router;
