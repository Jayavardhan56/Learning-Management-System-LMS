const pool = require("../config/db");
const enrollCourse = async (student_id, course_id) => {
  const result = await pool.query(
    "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING *",
    [student_id, course_id]
  );
  return result.rows[0];
};
const getEnrolledCourses = async (studentId) => {
  const result = await pool.query(`
    SELECT c.id, c.title, c.description, c.duration, u.name as instructor_name,
           (SELECT COUNT(*) FROM course_lessons cl JOIN course_modules cm ON cl.module_id = cm.id WHERE cm.course_id = c.id) as lesson_count,
           (
             SELECT COUNT(p.lesson_id)
             FROM student_progress p
             JOIN course_lessons cl ON p.lesson_id = cl.id
             JOIN course_modules cm ON cl.module_id = cm.id
             WHERE cm.course_id = c.id AND p.student_id = $1 AND p.is_completed = TRUE
           ) as completed_lessons_count,
           (
             SELECT ROUND(COUNT(p.lesson_id) * 100.0 / NULLIF((SELECT COUNT(*) FROM course_lessons cl JOIN course_modules cm ON cl.module_id = cm.id WHERE cm.course_id = c.id), 0))
             FROM student_progress p
             JOIN course_lessons cl ON p.lesson_id = cl.id
             JOIN course_modules cm ON cl.module_id = cm.id
             WHERE cm.course_id = c.id AND p.student_id = $1 AND p.is_completed = TRUE
           ) as progress_percentage
    FROM enrollments e
    INNER JOIN courses c ON e.course_id = c.id
    LEFT JOIN users u ON c.instructor_id = u.id
    WHERE e.student_id = $1 AND e.status = 'active'
  `, [studentId]);
  return result.rows;
};
module.exports = { enrollCourse, getEnrolledCourses };