const pool = require("../config/db");

const addCourse = async (courseData) => {
  const { title, description, instructor_id, duration, category, level, video_url, certificate_url, thumbnail_url } = courseData;
  const result = await pool.query(
    "INSERT INTO courses (title, description, instructor_id, duration, category, level, video_url, certificate_url, thumbnail_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    [title, description, instructor_id, duration, category, level, video_url, certificate_url, thumbnail_url]
  );
  return result.rows[0];
};

const getAllCourses = async (role, userId) => {
  let query = `
    SELECT c.*, u.name as instructor_name,
           (SELECT COUNT(*) FROM course_lessons cl JOIN course_modules cm ON cl.module_id = cm.id WHERE cm.course_id = c.id) as lesson_count,
           e.status as enrollment_status
    FROM courses c
    LEFT JOIN users u ON c.instructor_id = u.id
    LEFT JOIN enrollments e ON c.id = e.course_id AND e.student_id = $1
  `;
  let params = [userId];
  if (role === 'instructor') {
    query += " WHERE c.instructor_id = $1";
  } else if (role !== 'admin') {
    query += " WHERE c.is_approved = true";
  }
  const result = await pool.query(query, params);
  return result.rows;
};

const approveCourse = async (courseId) => {
  const result = await pool.query(
    "UPDATE courses SET is_approved = true WHERE id = $1 RETURNING *",
    [courseId]
  );
  return result.rows[0];
};

const enrollStudent = async (studentId, courseId) => {
  const result = await pool.query(
    "INSERT INTO enrollments (student_id, course_id, status) VALUES ($1, $2, 'pending') ON CONFLICT (student_id, course_id) DO UPDATE SET status = 'pending' RETURNING *",
    [studentId, courseId]
  );
  return result.rows[0];
};

const unenrollStudent = async (studentId, courseId) => {
  await pool.query("DELETE FROM enrollments WHERE student_id = $1 AND course_id = $2", [studentId, courseId]);
};

const getUserEnrollments = async (userId) => {
  const result = await pool.query(`
    SELECT c.id, c.title, e.status, e.enrolled_at
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = $1
  `, [userId]);
  return result.rows;
};

const getPendingEnrollments = async (role, userId) => {
  let query = `
    SELECT e.id, u.name as student_name, u.college_name as student_college, c.title as course_title, e.enrolled_at, e.student_id
    FROM enrollments e
    JOIN users u ON e.student_id = u.id
    JOIN courses c ON e.course_id = c.id
    WHERE e.status = 'pending'
  `;
  const result = await pool.query(query);
  return result.rows;
};

const approveEnrollment = async (enrollmentId) => {
  const result = await pool.query(
    "UPDATE enrollments SET status = 'active' WHERE id = $1 RETURNING *",
    [enrollmentId]
  );
  return result.rows[0];
};

const addModule = async (courseId, title, orderIndex) => {
  const result = await pool.query(
    "INSERT INTO course_modules (course_id, title, order_index) VALUES ($1, $2, $3) RETURNING *",
    [courseId, title, orderIndex]
  );
  return result.rows[0];
};

const deleteModule = async (moduleId) => {
  await pool.query("DELETE FROM course_modules WHERE id = $1", [moduleId]);
};

const addLesson = async (lessonData) => {
  const { module_id, title, content_text, media_url, media_type, order_index } = lessonData;
  const result = await pool.query(
    "INSERT INTO course_lessons (module_id, title, content_text, content_url, content_type, order_index) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [module_id, title, content_text, media_url, media_type, order_index]
  );
  return result.rows[0];
};

const deleteLesson = async (lessonId) => {
  await pool.query("DELETE FROM course_lessons WHERE id = $1", [lessonId]);
};

const getCourseStructure = async (courseId) => {
  const result = await pool.query(`
    SELECT m.id as module_id, m.title as module_title,
           l.id as lesson_id, l.title as lesson_title, l.content_text, l.content_url as media_url, l.content_type as media_type, l.order_index
    FROM course_modules m
    LEFT JOIN course_lessons l ON m.id = l.module_id
    WHERE m.course_id = $1
    ORDER BY m.order_index, l.order_index
  `, [courseId]);
  return result.rows;
};

const updateProgress = async (studentId, lessonId, isCompleted) => {
  const result = await pool.query(
    "INSERT INTO student_progress (student_id, lesson_id, is_completed) VALUES ($1, $2, $3) ON CONFLICT (student_id, lesson_id) DO UPDATE SET is_completed = $3, updated_at = CURRENT_TIMESTAMP RETURNING *",
    [studentId, lessonId, isCompleted]
  );
  return result.rows[0];
};

const getStudentProgress = async (studentId, courseId) => {
  const result = await pool.query(`
    SELECT l.id as lesson_id, p.is_completed
    FROM course_lessons l
    JOIN course_modules m ON l.module_id = m.id
    LEFT JOIN student_progress p ON l.id = p.lesson_id AND p.student_id = $1
    WHERE m.course_id = $2
  `, [studentId, courseId]);
  return result.rows;
};

const assignCourse = async (studentId, courseId, adminId) => {
  const existing = await pool.query("SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2 AND status = 'active'", [studentId, courseId]);
  if (existing.rows.length > 0) {
    throw new Error("Student is already actively enrolled in this course.");
  }

  const result = await pool.query(
    "INSERT INTO enrollments (student_id, course_id, assigned_by, status) VALUES ($1, $2, $3, 'active') ON CONFLICT (student_id, course_id) DO UPDATE SET status = 'active', assigned_by = $3 RETURNING *",
    [studentId, courseId, adminId]
  );
  return result.rows[0];
};

const createAssessment = async (courseId, title, questions) => {
  const result = await pool.query(
    "INSERT INTO assessments (course_id, title, questions) VALUES ($1, $2, $3) RETURNING *",
    [courseId, title, JSON.stringify(questions)]
  );
  return result.rows[0];
};

const updateAssessment = async (courseId, title, questions) => {
  const result = await pool.query(
    "UPDATE assessments SET title = $1, questions = $2 WHERE course_id = $3 RETURNING *",
    [title, JSON.stringify(questions), courseId]
  );
  return result.rows[0];
};

const getAssessments = async (courseId) => {
  const result = await pool.query("SELECT * FROM assessments WHERE course_id = $1", [courseId]);
  return result.rows;
};

const saveScore = async (studentId, assessmentId, score, total) => {
  const result = await pool.query(
    "INSERT INTO student_scores (student_id, assessment_id, score, total_questions) VALUES ($1, $2, $3, $4) ON CONFLICT (student_id, assessment_id) DO UPDATE SET score = $3, total_questions = $4, completed_at = CURRENT_TIMESTAMP RETURNING *",
    [studentId, assessmentId, score, total]
  );
  return result.rows[0];
};

const getScores = async (studentId, courseId) => {
  const result = await pool.query(`
    SELECT s.*, a.title as assessment_title
    FROM student_scores s
    JOIN assessments a ON s.assessment_id = a.id
    WHERE s.student_id = $1 AND a.course_id = $2
  `, [studentId, courseId]);
  return result.rows;
};

const requestCertificate = async (studentId, courseId) => {
  const result = await pool.query(
    "INSERT INTO certificate_requests (student_id, course_id) VALUES ($1, $2) ON CONFLICT (student_id, course_id) DO UPDATE SET status = 'pending' RETURNING *",
    [studentId, courseId]
  );
  return result.rows[0];
};

const getCertificateRequests = async (role, userId) => {
  let query = `
    SELECT r.*, u.name as student_name, u.college_name as student_college, c.title as course_title, c.certificate_url
    FROM certificate_requests r
    LEFT JOIN users u ON r.student_id = u.id
    LEFT JOIN courses c ON r.course_id = c.id
  `;
  let params = [];
  if (role === 'student') {
    query += ` WHERE r.student_id = $1`;
    params.push(userId);
  }
  const result = await pool.query(query, params);
  return result.rows;
};

const approveCertificate = async (requestId, role) => {
  let field = role === 'admin' ? 'admin_approved' : 'manager_approved';
  await pool.query(
    `UPDATE certificate_requests SET ${field} = TRUE WHERE id = $1`,
    [requestId]
  );

  const check = await pool.query("SELECT * FROM certificate_requests WHERE id = $1", [requestId]);
  if (role === 'admin' || (check.rows[0].admin_approved && check.rows[0].manager_approved)) {
    await pool.query("UPDATE certificate_requests SET status = 'approved' WHERE id = $1", [requestId]);

    await pool.query("UPDATE users SET xp = xp + 500 WHERE id = $1", [check.rows[0].student_id]);
  }

  return check.rows[0];
};

const getStudentCourses = async (studentId) => {
  const result = await pool.query(`
    SELECT DISTINCT ON (c.id)
           c.*, e.status as enrollment_status, u.name as instructor_name,
           (SELECT COUNT(*) FROM student_progress sp
            JOIN course_lessons cl ON sp.lesson_id = cl.id
            JOIN course_modules cm ON cl.module_id = cm.id
            WHERE sp.student_id = $1 AND cm.course_id = c.id AND sp.is_completed = true) as completed_lessons_count,
           (SELECT COUNT(*) FROM course_lessons cl
            JOIN course_modules cm ON cl.module_id = cm.id
            WHERE cm.course_id = c.id) as total_lessons_count
    FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    LEFT JOIN users u ON c.instructor_id = u.id
    WHERE e.student_id = $1
    ORDER BY c.id, CASE WHEN e.status = 'active' THEN 1 ELSE 2 END
  `, [studentId]);
  return result.rows;
};

const getCourseById = async (courseId) => {
  const result = await pool.query(`
    SELECT c.*, u.name as instructor_name,
           (SELECT COUNT(*) FROM course_lessons cl JOIN course_modules cm ON cl.module_id = cm.id WHERE cm.course_id = c.id) as lesson_count,
           ((SELECT COUNT(*) FROM course_lessons cl JOIN course_modules cm ON cl.module_id = cm.id WHERE cm.course_id = c.id) * 5) as duration_mins
    FROM courses c
    LEFT JOIN users u ON c.instructor_id = u.id
    WHERE c.id = $1
  `, [courseId]);
  return result.rows[0];
};

const getManagerStudents = async (managerId, collegeName) => {
  const result = await pool.query(`
    SELECT u.id, u.name, u.email, u.college_name, u.phone,
           (SELECT COUNT(*) FROM enrollments e WHERE e.student_id = u.id AND e.status = 'active') as active_enrollments,
           (SELECT COUNT(*) FROM certificate_requests cr WHERE cr.student_id = u.id AND cr.status = 'approved') as certificates_earned
    FROM users u
    WHERE u.role = 'student'
    ORDER BY u.name ASC
  `);
  return result.rows;
};

const updateCourse = async (courseId, data) => {
  const { title, description, category, level, duration } = data;
  const result = await pool.query(
    "UPDATE courses SET title = $1, description = $2, category = $3, level = $4, duration = $5 WHERE id = $6 RETURNING *",
    [title, description, category, level, duration, courseId]
  );
  return result.rows[0];
};

module.exports = {
  addCourse,
  getAllCourses,
  approveCourse,
  enrollStudent,
  unenrollStudent,
  getStudentCourses,
  getUserEnrollments,
  getPendingEnrollments,
  approveEnrollment,
  addModule,
  deleteModule,
  addLesson,
  deleteLesson,
  getCourseStructure,
  updateProgress,
  getStudentProgress,
  assignCourse,
  createAssessment,
  updateAssessment,
  getAssessments,
  saveScore,
  getScores,
  requestCertificate,
  getCertificateRequests,
  approveCertificate,
  getCourseById,
  updateCourse,
  getManagerStudents
};