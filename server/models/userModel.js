const pool = require("../config/db");

const createUser = async (name, email, password) => {
  const result = await pool.query(
    "INSERT INTO users (name, email, password, role, is_approved) VALUES ($1, $2, $3, 'pending', false) RETURNING *",
    [name, email, password]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

const adminCreateUser = async (userData) => {
  const { name, email, password, role, college_name, phone, bio, managed_by } = userData;
  const result = await pool.query(
    "INSERT INTO users (name, email, password, role, is_approved, college_name, phone, bio, managed_by) VALUES ($1, $2, $3, $4, true, $5, $6, $7, $8) RETURNING *",
    [name, email, password, role, college_name, phone, bio, managed_by]
  );
  return result.rows[0];
};

const managerCreateUser = async (userData) => {
  const { name, email, password, college_name, managed_by } = userData;
  const result = await pool.query(
    "INSERT INTO users (name, email, password, role, is_approved, college_name, managed_by) VALUES ($1, $2, $3, 'student', false, $4, $5) RETURNING *",
    [name, email, password, college_name, managed_by]
  );
  return result.rows[0];
};

const getAllUsers = async () => {
  const result = await pool.query("SELECT id, name, email, role, is_approved, college_name, phone, bio, managed_by, created_at, xp FROM users ORDER BY created_at DESC");
  return result.rows;
};

const getLeaderboard = async () => {
  const result = await pool.query(`
    SELECT id, name, college_name, xp, role
    FROM users
    WHERE role = 'student' AND is_approved = true
    ORDER BY xp DESC, name ASC
    LIMIT 20
  `);
  return result.rows;
};

const assignRoleAndApprove = async (userId, role) => {
  const result = await pool.query(
    "UPDATE users SET role = $1, is_approved = true WHERE id = $2 RETURNING *",
    [role, userId]
  );
  return result.rows[0];
};

const deleteUser = async (userId) => {
  await pool.query("DELETE FROM users WHERE id = $1", [userId]);
};

const getSystemStats = async () => {
  const userStats = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE role = 'student') as students,
      COUNT(*) FILTER (WHERE role = 'instructor') as instructors,
      COUNT(*) FILTER (WHERE role = 'manager') as managers,
      COUNT(*) FILTER (WHERE is_approved = false) as pending_users
    FROM users
  `);

  const courseStats = await pool.query(`
    SELECT
      COUNT(*) as total_courses,
      COUNT(*) FILTER (WHERE is_approved = false) as pending_courses
    FROM courses
  `);

  const enrollmentStats = await pool.query(`
    SELECT COUNT(*) as total_enrollments FROM enrollments
  `);

  return {
    ...userStats.rows[0],
    ...courseStats.rows[0],
    ...enrollmentStats.rows[0]
  };
};

module.exports = {
  createUser,
  adminCreateUser,
  managerCreateUser,
  findUserByEmail,
  getAllUsers,
  assignRoleAndApprove,
  deleteUser,
  getSystemStats,
  getLeaderboard
};