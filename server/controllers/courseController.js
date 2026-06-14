const {
  addCourse,
  getAllCourses,
  approveCourse,
  enrollStudent,
  unenrollStudent,
  getStudentCourses,
  addModule,
  addLesson,
  getCourseStructure,
  updateProgress,
  getStudentProgress,
  assignCourse,
  createAssessment,
  getAssessments,
  saveScore,
  requestCertificate,
  getCertificateRequests,
  approveCertificate,
  getCourseById,
  updateCourse,
  getPendingEnrollments,
  approveEnrollment,
  updateAssessment,
  deleteModule,
  deleteLesson,
  getManagerStudents
} = require("../models/courseModel");
const pool = require("../config/db");

const handleAddCourse = async (req, res) => {
  try {
    const { title, description, category, level, duration } = req.body;
    const instructor_id = req.user.id;
    const video_url = req.files?.video ? `/uploads/${req.files.video[0].filename}` : null;
    const certificate_url = req.files?.certificate ? `/uploads/${req.files.certificate[0].filename}` : null;
    const thumbnail_url = req.files?.thumbnail ? `/uploads/${req.files.thumbnail[0].filename}` : null;

    const course = await addCourse({
      title, description, instructor_id, duration, category, level,
      video_url, certificate_url, thumbnail_url
    });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchCourses = async (req, res) => {
  try {
    const courses = await getAllCourses(req.user.role, req.user.id);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleApproveCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await approveCourse(courseId);
    res.json({ message: "Course approved", course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleEnroll = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;
    const targetStudentId = studentId || req.user.id;
    const enrollment = await enrollStudent(targetStudentId, courseId);
    res.json({ message: "Enrolled successfully", enrollment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleUnenroll = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const targetStudentId = (req.user.role === 'admin' || req.user.role === 'manager') ? studentId : req.user.id;
    await unenrollStudent(targetStudentId, courseId);
    res.json({ message: "Unenrolled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchMyCourses = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courses = await getStudentCourses(studentId);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchUserCourses = async (req, res) => {
  try {
    const { userId } = req.params;
    const courses = await getStudentCourses(userId);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleAddModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, order_index } = req.body;
    const module = await addModule(courseId, title, order_index);
    res.json(module);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleAddLesson = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, content_text, order_index, media_type } = req.body;
    const media_url = req.file ? `/uploads/${req.file.filename}` : null;
    const lesson = await addLesson({
      module_id: moduleId,
      title,
      content_text,
      media_url,
      media_type,
      order_index
    });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchCourseStructure = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (req.user.role === 'student') {
      const enrollments = await getStudentCourses(req.user.id);
      const activeEnrollment = enrollments.find(e => e.id == courseId && e.enrollment_status === 'active');
      if (!activeEnrollment) {
        return res.status(403).json({ message: "Course access denied. Enrollment is not active." });
      }
    }

    const structure = await getCourseStructure(courseId);
    res.json(structure);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleUpdateProgress = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { is_completed } = req.body;
    const studentId = req.user.id;
    const progress = await updateProgress(studentId, lessonId, is_completed);
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchStudentProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    const progress = await getStudentProgress(studentId, courseId);
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleManagerAssign = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const adminId = req.user.id;
    const enrollment = await assignCourse(studentId, courseId, adminId);
    res.json({ message: "Course assigned successfully", enrollment });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const handleCreateAssessment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, questions } = req.body;
    const assessment = await createAssessment(courseId, title, questions);
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleUpdateAssessment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, questions } = req.body;
    const assessment = await updateAssessment(courseId, title, questions);
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchAssessments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assessments = await getAssessments(courseId);
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleSaveScore = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { score, total } = req.body;
    const studentId = req.user.id;
    const savedScore = await saveScore(studentId, assessmentId, score, total);
    res.json(savedScore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleRequestCertificate = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;
    const request = await requestCertificate(studentId, courseId);
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchCertificateRequests = async (req, res) => {
  try {
    const requests = await getCertificateRequests(req.user.role, req.user.id);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleApproveCertificate = async (req, res) => {
  try {
    const { requestId } = req.body;
    const approval = await approveCertificate(requestId, req.user.role);
    res.json(approval);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchCourseById = async (req, res) => {
  try {
    const course = await getCourseById(req.params.courseId);
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleUpdateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await updateCourse(courseId, req.body);
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleDeleteModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    await deleteModule(moduleId);
    res.json({ message: "Module deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleDeleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    await deleteLesson(lessonId);
    res.json({ message: "Lesson deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchContests = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contests ORDER BY start_time ASC");
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const handleContestXP = async (req, res) => {
  try {
    const { xp } = req.body;
    const userId = req.user.id;
    await pool.query("UPDATE users SET xp = xp + $1 WHERE id = $2", [xp, userId]);
    res.json({ message: `Awarded ${xp} XP` });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const fetchPendingEnrollments = async (req, res) => {
  try {
    const requests = await getPendingEnrollments(req.user.role, req.user.id);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleApproveEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.body;

    if (req.user.role === 'manager') {
       const checkRes = await pool.query(`
         SELECT u.college_name FROM enrollments e
         JOIN users u ON e.student_id = u.id
         WHERE e.id = $1
       `, [enrollmentId]);

       if (checkRes.rows.length === 0) return res.status(404).json({ message: "Enrollment not found" });

       const managerRes = await pool.query("SELECT college_name FROM users WHERE id = $1", [req.user.id]);
       if (checkRes.rows[0].college_name !== managerRes.rows[0].college_name) {
          return res.status(403).json({ message: "You can only approve enrollments for your organization." });
       }
    }

    const result = await approveEnrollment(enrollmentId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchScores = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;
    const result = await pool.query(`
      SELECT s.* FROM student_scores s
      JOIN assessments a ON s.assessment_id = a.id
      WHERE s.student_id = $1 AND a.course_id = $2
    `, [studentId, courseId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchManagerStudents = async (req, res) => {
  try {
    const manager = await pool.query("SELECT college_name FROM users WHERE id = $1", [req.user.id]);
    const collegeName = manager.rows[0]?.college_name || "";
    const students = await getManagerStudents(req.user.id, collegeName);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const fetchMockTests = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, title, category, questions FROM mock_tests ORDER BY created_at ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const handleSaveMockScore = async (req, res) => {
  try {
    const { testId, score, total } = req.body;
    const studentId = req.user.id;
    const result = await pool.query(
      "INSERT INTO mock_test_results (student_id, test_id, score, total) VALUES ($1, $2, $3, $4) RETURNING *",
      [studentId, testId, score, total]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addCourse: handleAddCourse,
  fetchCourses,
  handleApproveCourse,
  handleEnroll,
  handleUnenroll,
  fetchMyCourses,
  fetchUserCourses,
  handleAddModule,
  handleAddLesson,
  fetchCourseStructure,
  handleUpdateProgress,
  fetchStudentProgress,
  handleManagerAssign,
  handleCreateAssessment,
  handleUpdateAssessment,
  fetchAssessments,
  handleSaveScore,
  handleRequestCertificate,
  fetchCertificateRequests,
  handleApproveCertificate,
  fetchCourseById,
  handleUpdateCourse,
  handleDeleteModule,
  handleDeleteLesson,
  fetchPendingEnrollments,
  handleApproveEnrollment,
  fetchScores,
  fetchManagerStudents,
  fetchMockTests,
  handleSaveMockScore,
  fetchContests,
  handleContestXP
};
