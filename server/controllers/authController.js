const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const {
  createUser,
  findUserByEmail,
  getAllUsers,
  assignRoleAndApprove,
  getSystemStats,
  managerCreateUser,
  adminCreateUser: modelAdminCreateUser,
  getLeaderboard: modelGetLeaderboard
} = require("../models/userModel");
const { sendWelcomeEmail } = require("../utils/emailService");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashedPassword);
    res.status(201).json({ message: "Registration successful. Please wait for admin approval.", user });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.is_approved && user.role !== 'admin') {
      return res.status(403).json({ message: "Account pending approval. Please contact admin." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, role: user.role, college_name: user.college_name, managed_by: user.managed_by },
      process.env.JWT_SECRET || "default_secret", { expiresIn: "24h" }
    );
    res.json({ message: "Login successful", token, user: { id: user.id, name: user.name, role: user.role, college_name: user.college_name, managed_by: user.managed_by, xp: user.xp } });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const approveUser = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const updatedUser = await assignRoleAndApprove(userId, role);
    res.json({ message: "User approved", user: updatedUser });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getStats = async (req, res) => {
  try {
    const stats = await getSystemStats();
    res.json(stats);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await modelGetLeaderboard();
    res.json(leaderboard);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const adminCreateUser = async (req, res) => {
  try {
    const { name, email, password, role, college_name, phone, bio } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password || "password123", 10);

    let user;
    if (req.user.role === 'admin') {
      user = await modelAdminCreateUser({ name, email, password: hashedPassword, role, college_name, phone, bio, managed_by: null });
    } else if (req.user.role === 'manager') {
      user = await managerCreateUser({ name, email, password: hashedPassword, college_name: req.user.college_name, managed_by: req.user.id });
    }

    if (user) {
      try {
        await sendWelcomeEmail(email, name, password || "password123");
      } catch (emailErr) {
        console.error("Email failed but user created:", emailErr.message);
      }
    }

    res.status(201).json({ message: "User created successfully.", user });
  } catch (err) {
    console.error("ADMIN_CREATE_USER_ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

const bulkCreateUsers = async (req, res) => {
  try {
    const { users } = req.body;
    const results = [];
    for (const u of users) {
      const hashedPassword = await bcrypt.hash(u.password || "password123", 10);
      let created;
      if (req.user.role === 'admin') {
        created = await modelAdminCreateUser({ ...u, password: hashedPassword });
      } else {
        created = await managerCreateUser({ ...u, password: hashedPassword, college_name: req.user.college_name, managed_by: req.user.id });
      }
      if (created) {
        await sendWelcomeEmail(u.email, u.name, u.password || "password123");
      }
      results.push(created);
    }
    res.json({ message: "Bulk creation successful. Welcome emails sent.", count: results.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const handleSetupPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    if (decoded.type !== 'setup') return res.status(400).json({ message: "Invalid token type" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET password = $1, is_approved = true WHERE id = $2", [hashedPassword, decoded.id]);

    res.json({ message: "Password set successfully. You can now login." });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

const fetchContacts = async (req, res) => {
  try {
    const { role, id, college_name } = req.user;
    let query = "SELECT id, name, role, college_name FROM users WHERE id != $1 AND is_approved = true";
    let params = [id];

    if (role === 'student') {

      query += " AND role = 'student'";
    } else if (role === 'manager') {

      query += " AND (college_name = $2 OR role = 'admin')";
      params.push(college_name);
    } else if (role === 'instructor') {

      query += " AND (role = 'student' OR role = 'manager' OR role = 'admin')";
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const fetchMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user.id;
    const result = await pool.query(`
      SELECT * FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
    `, [userId, otherUserId]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;
    const result = await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *",
      [senderId, receiverId, content]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const handleUpdateRequest = async (req, res) => {
  try {
    const { field_name, new_value } = req.body;
    const user_id = req.user.id;
    const result = await pool.query(
      "INSERT INTO update_requests (user_id, field_name, new_value) VALUES ($1, $2, $3) RETURNING *",
      [user_id, field_name, new_value]
    );
    res.json({ message: "Update request submitted for admin approval.", request: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const fetchPendingUpdates = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ur.*, u.name as current_name, u.email
      FROM update_requests ur
      JOIN users u ON ur.user_id = u.id
      WHERE ur.status = 'pending'
      ORDER BY ur.created_at ASC
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const handleApproveUpdate = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    if (status === 'approved') {
      const request = await pool.query("SELECT * FROM update_requests WHERE id = $1", [requestId]);
      if (request.rows.length > 0) {
        const { user_id, field_name, new_value } = request.rows[0];
        if (field_name === 'password') {
          const hashed = await bcrypt.hash(new_value, 10);
          await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashed, user_id]);
        } else {
          await pool.query(`UPDATE users SET ${field_name} = $1 WHERE id = $2`, [new_value, user_id]);
        }
      }
    }
    await pool.query("UPDATE update_requests SET status = $1 WHERE id = $2", [status, requestId]);
    res.json({ message: `Request ${status}` });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const handleDeleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    await require("../models/userModel").deleteUser(userId);
    res.json({ message: "User deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = {
  register,
  login,
  getUsers,
  approveUser,
  getStats,
  adminCreateUser,
  bulkCreateUsers,
  handleSetupPassword,
  handleDeleteUser,
  getLeaderboard,
  fetchContacts,
  fetchMessages,
  sendMessage,
  handleUpdateRequest,
  fetchPendingUpdates,
  handleApproveUpdate
};