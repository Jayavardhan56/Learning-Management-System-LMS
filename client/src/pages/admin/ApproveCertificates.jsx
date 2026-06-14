import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaCheckCircle, FaTimesCircle, FaFileAlt, FaUserGraduate, FaCertificate, FaShieldAlt, FaSync } from "react-icons/fa";
import { getAuthToken, getAuthUser } from "../../utils/auth";
import "../../styles/Management.css";

const ApproveCertificates = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getAuthUser();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/courses/certificate-requests", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log("Certificate Requests Data:", data);
      if (res.ok) {
        setRequests(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    if (!window.confirm("Are you sure you want to authorize this certificate?")) return;
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/courses/approve-certificate", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ requestId })
      });
      if (res.ok) {
        alert("Certificate authorized successfully!");
        fetchRequests();
      } else {
        const err = await res.json();
        alert("Failed to authorize: " + (err.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Certificate Approvals">
      <div className="animate-fade-in mg-container">

        <div className="mg-header">
           <div>
              <h2 className="mg-title-h2" style={{ fontSize: '1.4rem' }}>Credential Requests</h2>
              <p className="mg-subtitle">Verify course completion and authorize official certifications.</p>
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
                <th>Academic Course</th>
                <th>Admin Review</th>
                <th>Manager Review</th>
                <th>Current Status</th>
                <th>Official Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td style={{ fontWeight: 800, color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ width: '40px', height: '40px', background: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', border: '1px solid #E2E8F0' }}>
                          <FaUserGraduate />
                       </div>
                       {req.student_name}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#1E293B' }}>{req.course_title}</td>
                  <td>
                    {req.admin_approved ?
                      <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.85rem' }}><FaCheckCircle /> VERIFIED</span> :
                      <span style={{ color: '#94A3B8', fontWeight: 800, fontSize: '0.85rem' }}>PENDING</span>
                    }
                  </td>
                  <td>
                    {req.manager_approved ?
                      <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.85rem' }}><FaCheckCircle /> VERIFIED</span> :
                      <span style={{ color: '#94A3B8', fontWeight: 800, fontSize: '0.85rem' }}>PENDING</span>
                    }
                  </td>
                  <td>
                    <span className={`mg-badge mg-badge-${req.status === 'approved' ? 'manager' : 'instructor'}`} style={{ minWidth: '80px', textAlign: 'center' }}>
                      {(req.status || 'PENDING').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {((user.role === 'admin' && !req.admin_approved) || (user.role === 'manager' && !req.manager_approved)) ? (
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="mg-action-btn mg-btn-approve"
                      >
                        <FaCertificate /> Authorize
                      </button>
                    ) : (
                      <div style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                         <FaCheckCircle style={{ color: '#10B981' }} /> Finalized
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" style={{ padding: '100px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                       <FaCertificate style={{ fontSize: '3rem', color: '#F59E0B', opacity: 0.2 }} />
                       <p style={{ fontWeight: 700, color: '#94A3B8' }}>No certificate requests in the current queue.</p>
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

export default ApproveCertificates;
