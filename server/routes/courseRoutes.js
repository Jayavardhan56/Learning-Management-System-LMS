const express = require("express");
const router = express.Router();
const {
  addCourse,
  fetchCourses,
  handleApproveCourse,
  handleEnroll,
  handleUnenroll,
  fetchMyCourses,
  fetchUserCourses,
  fetchCourseById,
  handleUpdateCourse,
  fetchPendingEnrollments,
  handleApproveEnrollment,
  handleAddModule,
  handleDeleteModule,
  handleAddLesson,
  handleDeleteLesson,
  fetchCourseStructure,
  handleUpdateProgress,
  fetchStudentProgress,
  fetchScores,
  handleCreateAssessment,
  handleUpdateAssessment,
  fetchAssessments,
  handleSaveScore,
  handleRequestCertificate,
  fetchCertificateRequests,
  handleApproveCertificate,
  handleManagerAssign,
  fetchManagerStudents,
  fetchMockTests,
  handleSaveMockScore,
  fetchContests,
  handleContestXP
} = require("../controllers/courseController");
const multer = require("multer");
const path = require("path");
const { verifyToken, isAdmin, isManagerOrAdmin } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post("/add", verifyToken, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'certificate', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
  ]), addCourse);

router.get("/", verifyToken, fetchCourses);
router.get("/my-courses", verifyToken, fetchMyCourses);
router.get("/user/:userId", verifyToken, isManagerOrAdmin, fetchUserCourses);
router.get("/pending-enrollments", verifyToken, isManagerOrAdmin, fetchPendingEnrollments);
router.post("/approve-enrollment", verifyToken, isManagerOrAdmin, handleApproveEnrollment);
router.post("/approve", verifyToken, isAdmin, handleApproveCourse);
router.post("/enroll", verifyToken, handleEnroll);
router.post("/unenroll", verifyToken, handleUnenroll);

router.post("/:courseId/modules", verifyToken, handleAddModule);
router.delete("/modules/:moduleId", verifyToken, handleDeleteModule);
router.post("/modules/:moduleId/lessons", verifyToken, upload.single('media'), handleAddLesson);
router.delete("/lessons/:lessonId", verifyToken, handleDeleteLesson);
router.get("/:courseId/structure", verifyToken, fetchCourseStructure);

router.post("/lessons/:lessonId/progress", verifyToken, handleUpdateProgress);
router.get("/:courseId/progress", verifyToken, fetchStudentProgress);
router.get("/:courseId/scores", verifyToken, fetchScores);

router.post("/:courseId/assessments", verifyToken, handleCreateAssessment);
router.put("/:courseId/assessments", verifyToken, handleUpdateAssessment);
router.get("/:courseId/assessments", verifyToken, fetchAssessments);
router.post("/assessments/:assessmentId/score", verifyToken, handleSaveScore);

router.post("/request-certificate", verifyToken, handleRequestCertificate);
router.get("/certificate-requests", verifyToken, fetchCertificateRequests);
router.post("/approve-certificate", verifyToken, isManagerOrAdmin, handleApproveCertificate);

router.post("/assign", verifyToken, isAdmin, handleManagerAssign);
router.get("/manager/students", verifyToken, isManagerOrAdmin, fetchManagerStudents);

router.get("/mock-tests", verifyToken, fetchMockTests);
router.post("/mock-tests/save-score", verifyToken, handleSaveMockScore);
router.get("/contests", verifyToken, fetchContests);
router.post("/contests/xp", verifyToken, handleContestXP);

router.get("/:courseId", verifyToken, fetchCourseById);
router.put("/:courseId", verifyToken, handleUpdateCourse);

module.exports = router;