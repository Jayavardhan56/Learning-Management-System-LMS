import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaTrash, FaUserShield, FaUserGraduate, FaUserTie, FaSearch, FaFilter, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { getAuthToken, getAuthUser } from "../../utils/auth";
import "../../styles/Management.css";

const ManageUsers = ({ isManagerView }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = getAuthUser();

  useEffect(() => {
    fetchUsers();
  }, [isManagerView]);

  const fetchUsers = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        const safeData = Array.isArray(data) ? data : [];
        if (isManagerView) {
          setUsers(safeData.filter(u =>
            u.role === 'student' &&
            (u.managed_by === currentUser.id || u.college_name === currentUser.college_name)
          ));
        } else {
          setUsers(safeData);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userRole) => {
    if (userRole === 'admin') {
      alert("Critical Error: System Administrator accounts cannot be deleted.");
      return;
    }
    if (userId === currentUser.id) {
      alert("Safety Check: You cannot delete your own account while logged in.");
      return;
    }

    if (!window.confirm("Are you sure you want to permanently remove this user? This action cannot be undone.")) return;

    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/auth/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleBadge = (role) => {
    const roles = {
      admin: 'mg-badge-admin',
      instructor: 'mg-badge-instructor',
      manager: 'mg-badge-manager',
      student: 'mg-badge-student'
    };
    return <span className={`mg-badge ${roles[role] || 'mg-badge-student'}`}>{(role || 'PENDING').toUpperCase()}</span>;
  };

  const filteredUsers = users.filter(u =>
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.college_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title={isManagerView ? "Organization Directory" : "Global User Directory"}>
      <div className="animate-fade-in mg-container">

        <div className="mg-header">
           <div>
              <h2 className="mg-title-h2" style={{ fontSize: '1.4rem' }}>{isManagerView ? "Organization Students" : "System Users"}</h2>
              <p className="mg-subtitle">Manage account access and profile data for all platform members.</p>
           </div>
           <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ position: 'relative' }}>
                 <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                 <input
                  type="text"
                  placeholder="Search directory..."
                  className="input-field"
                  style={{ paddingLeft: '45px', width: '300px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>
        </div>

        <div className="mg-table-card">
          <table className="mg-user-table">
            <thead>
              <tr>
                <th>Profile Name</th>
                <th>Communication</th>
                <th>Access Role</th>
                <th>Verification Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 800, color: '#0F172A' }}>{user.name}</td>
                  <td>
                     <div style={{ fontSize: '0.9rem', color: '#64748B' }}>{user.email}</div>
                     <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8' }}>{user.college_name || "Independent"}</div>
                  </td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: user.is_approved ? '#10B981' : '#EF4444', fontWeight: 700, fontSize: '0.85rem' }}>
                       {user.is_approved ? <><FaCheckCircle /> Approved</> : <><FaExclamationCircle /> Pending</>}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button className="mg-action-btn mg-btn-view" title="Edit Profile">View</button>
                      {(user.role !== 'admin' && !isManagerView) && (
                        <button
                          onClick={() => handleDelete(user.id, user.role)}
                          className="mg-action-btn"
                          style={{ color: '#EF4444', background: '#FEF2F2' }}
                          title="Permanently Delete"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '100px', color: '#94A3B8', fontWeight: 700 }}>
                    No matching user records found in the directory.
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

export default ManageUsers;
