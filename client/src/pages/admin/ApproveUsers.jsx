import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaCheck, FaSync, FaExclamationCircle, FaBookOpen, FaChalkboardTeacher, FaCheckCircle, FaUserTie } from "react-icons/fa";
import { getAuthToken } from "../../utils/auth";
import "../../styles/Management.css";

const ApproveUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/auth/users", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) {
        setUsers(Array.isArray(data) ? data.filter(u => !u.is_approved) : []);
        setError("");
      } else {
        setError(data.message || "Error");
      }
    } catch (err) { setError("Connection failed"); }
    finally { setLoading(false); }
  };

  const handleApprove = async (userId, targetRole) => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/auth/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, role: targetRole || "student" })
      });
      if (res.ok) fetchUsers();
    } catch (err) { console.error(err); }
  };

  return (
    <DashboardLayout title="Approve Users">
      <div className="animate-fade-in mg-container">

        <div className="mg-header">
          <div>
            <h2 className="mg-title-h2" style={{ fontSize: '1.4rem' }}>Account Approvals</h2>
            <p className="mg-subtitle">Review and authorize system access for new members.</p>
          </div>
          <button onClick={fetchUsers} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px' }}>
            <FaSync className={loading ? 'fa-spin' : ''} /> Refresh List
          </button>
        </div>

        <div className="mg-table-card">
          <table className="mg-user-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Credentials</th>
                <th>Organization</th>
                <th>Role Category</th>
                <th>Administrative Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 800, color: '#0F172A' }}>{user.name}</td>
                  <td style={{ color: '#64748B', fontSize: '0.85rem' }}>{user.email}</td>
                  <td style={{ fontWeight: 700, color: '#1E293B' }}>{user.college_name || "Self-Enrolled"}</td>
                  <td>
                    <span className={`mg-badge mg-badge-${user.role === 'pending' ? 'student' : (user.role || 'pending')}`}>
                      {(user.role || 'PENDING').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => handleApprove(user.id, user.role === 'pending' ? 'student' : (user.role || 'student'))}
                        className="mg-action-btn mg-btn-approve"
                      >
                        <FaCheck /> Approve as {(user.role === 'pending' || !user.role) ? 'Student' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </button>
                      {(user.role === 'pending' || !user.role) && (
                        <button
                          onClick={() => handleApprove(user.id, 'instructor')}
                          className="mg-action-btn mg-btn-view"
                        >
                          <FaUserTie /> Authorize as Instructor
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '100px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                       <FaCheckCircle style={{ fontSize: '3rem', color: '#10B981', opacity: 0.2 }} />
                       <p style={{ fontWeight: 700, color: '#94A3B8' }}>No pending approvals found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApproveUsers;
