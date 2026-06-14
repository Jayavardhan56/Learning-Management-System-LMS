const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUsers,
  approveUser,
  getStats,
  adminCreateUser,
  bulkCreateUsers,
  handleDeleteUser,
  handleSetupPassword,
  getLeaderboard,
  fetchContacts,
  fetchMessages,
  sendMessage,
  handleUpdateRequest,
  fetchPendingUpdates,
  handleApproveUpdate
} = require("../controllers/authController");
const { verifyToken, isAdmin, isManagerOrAdmin } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/setup-password", handleSetupPassword);
router.get("/users", verifyToken, isManagerOrAdmin, getUsers);
router.post("/approve", verifyToken, isAdmin, approveUser);
router.get("/stats", verifyToken, isManagerOrAdmin, getStats);
router.post("/create-user", verifyToken, isAdmin, adminCreateUser);
router.post("/bulk-create", verifyToken, isAdmin, bulkCreateUsers);
router.post("/delete", verifyToken, isAdmin, handleDeleteUser);
router.get("/leaderboard", verifyToken, getLeaderboard);
router.get("/contacts", verifyToken, fetchContacts);
router.get("/messages/:otherUserId", verifyToken, fetchMessages);
router.post("/messages", verifyToken, sendMessage);

router.post("/update-request", verifyToken, handleUpdateRequest);
router.get("/pending-updates", verifyToken, isAdmin, fetchPendingUpdates);
router.post("/approve-update", verifyToken, isAdmin, handleApproveUpdate);

module.exports = router;