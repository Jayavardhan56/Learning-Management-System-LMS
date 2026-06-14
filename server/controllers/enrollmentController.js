const { enrollCourse, getEnrolledCourses } = require("../models/enrollmentModel");
const enroll = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { course_id } = req.body;
    const enrollment = await enrollCourse(user_id, course_id);
    res.json({ message: "Enrolled successfully", enrollment });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "Already enrolled" });
    }
    res.status(500).json({ error: err.message });
  }
};
const getMyCourses = async (req, res) => {
  try {
    const user_id = req.user.id;
    const courses = await getEnrolledCourses(user_id);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { enroll, getMyCourses };