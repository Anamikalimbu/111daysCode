const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getUserById,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All user management routes require authentication + admin role
router.use(protect);
router.use(authorize("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

module.exports = router;