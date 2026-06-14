import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaCheck, FaSync, FaUserGraduate, FaBook, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { getAuthToken } from "../../utils/auth";
import "../../styles/Management.css";

const ApproveEnrollments = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/courses/pending-enrollments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (enrollmentId) => {
    if (!window.confirm("Authorize this student to access the course?")) return;
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/courses/approve-enrollment", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ enrollmentId })
      });
      if (res.ok) {
        fetchRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout title="Enrollment Approvals">
      <div className="animate-fade-in mg-container">

        <div className="mg-header">
           <div>
              <h2 className="mg-title-h2" style={{ fontSize: '1.4rem' }}>Academic Access Requests</h2>
              <p className="mg-subtitle">Authorize student enrollments for approved institutional courses.</p>
           </div>
           <button onClick={fetchRequests} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px' }}>
              <FaSync className={loading ? 'fa-spin' : ''} /> Refresh Queue
           </button>
        </div>

        <div className="mg-table-card">
          <table className="mg-user-table">
            <thead>
              <tr>
                <th>Student Graduate</th>
                <th>Institutional Course</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Administrative Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td style={{ fontWeight: 800, color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ width: '35px', height: '35px', background: '#F0F9FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9' }}>
                          <FaUserGraduate />
                       </div>
                       {req.student_name}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#1E293B' }}>{req.course_title}</td>
                  <td style={{ color: '#64748B', fontSize: '0.85rem' }}>
                    {new Date(req.enrolled_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <span className="mg-badge mg-badge-pending">PENDING</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="mg-action-btn mg-btn-approve"
                    >
                      <FaCheck /> Authorize Access
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '100px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                       <FaCheckCircle style={{ fontSize: '3rem', color: '#10B981', opacity: 0.2 }} />
                       <p style={{ fontWeight: 700, color: '#94A3B8' }}>No pending enrollment requests.</p>
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

export default ApproveEnrollments;
