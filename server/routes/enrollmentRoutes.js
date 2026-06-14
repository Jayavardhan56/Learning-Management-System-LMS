const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { enroll, getMyCourses } = require("../controllers/enrollmentController");
router.post("/", verifyToken, enroll);
router.get("/my", verifyToken, getMyCourses);
module.exports = router;