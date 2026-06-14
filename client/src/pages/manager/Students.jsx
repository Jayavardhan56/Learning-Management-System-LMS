import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaUsers, FaSync, FaUserGraduate, FaInfoCircle, FaEnvelope, FaChartLine, FaCertificate } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../utils/auth";
import "../../styles/Management.css";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/courses/manager/students", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setStudents(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Student Directory">
      <div className="animate-fade-in mg-container">

        <div className="mg-header">
           <div>
              <h2 className="mg-title-h2" style={{ fontSize: '1.4rem' }}>Managed Students</h2>
              <p className="mg-subtitle">Detailed overview of student enrollment and academic performance.</p>
           </div>
           <button onClick={fetchStudents} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px' }}>
              <FaSync className={loading ? 'fa-spin' : ''} /> Refresh Directory
           </button>
        </div>

        <div className="mg-table-card">
          <table className="mg-user-table">
            <thead>
              <tr>
                <th>Student Graduate</th>
                <th>Institutional Info</th>
                <th>Academic Stats</th>
                <th>Credentials</th>
                <th>Detailed Insights</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td style={{ fontWeight: 800, color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ width: '40px', height: '40px', background: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', fontWeight: 900 }}>
                          {student.name.charAt(0)}
                       </div>
                       <div>
                          <div>{student.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>ID: {student.id.slice(0, 8)}</div>
                       </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: 700 }}>{student.college_name || "N/A"}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}><FaEnvelope style={{ marginRight: '5px' }} /> {student.email}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <FaChartLine style={{ color: '#3B82F6' }} />
                       <span style={{ fontWeight: 800, color: '#0F172A' }}>{student.active_enrollments}</span>
                       <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Active Courses</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <FaCertificate style={{ color: '#F59E0B' }} />
                       <span style={{ fontWeight: 800, color: '#0F172A' }}>{student.certificates_earned}</span>
                       <span style={{ color: '#64748B', fontSize: '0.75rem' }}>Issued</span>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/manager/assign-courses`, { state: { studentId: student.id } })}
                      className="mg-action-btn mg-btn-view"
                      style={{ fontSize: '0.75rem', padding: '8px 16px' }}
                    >
                      Manage Enrollment
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '100px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                       <FaUsers style={{ fontSize: '3rem', color: '#CBD5E1', opacity: 0.2 }} />
                       <p style={{ fontWeight: 700, color: '#94A3B8' }}>No students found in your organization.</p>
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

export default Students;
