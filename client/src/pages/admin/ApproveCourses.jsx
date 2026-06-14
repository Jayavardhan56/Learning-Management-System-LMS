import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaCheck, FaSync, FaExclamationCircle, FaBookOpen, FaChalkboardTeacher, FaCheckCircle } from "react-icons/fa";
import { getAuthToken } from "../../utils/auth";
import "../../styles/Management.css";

const ApproveCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCourses(Array.isArray(data) ? data.filter(c => !c.is_approved) : []);
        setError("");
      } else {
        setError(data.message || "Failed to fetch courses");
      }
    } catch (err) {
      setError("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (courseId) => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/courses/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })
      });
      if (res.ok) fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout title="Approve Courses">
      <div className="animate-fade-in mg-container">

        <div className="mg-header">
           <div>
              <h2 className="mg-title-h2" style={{ fontSize: '1.4rem' }}>Course Pipeline</h2>
              <p className="mg-subtitle">Verify and authorize new educational content for the platform.</p>
           </div>
           <button onClick={fetchCourses} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px' }}>
              <FaSync className={loading ? 'fa-spin' : ''} /> Refresh Curriculum
           </button>
        </div>

        {error && (
          <div style={{ padding: '20px', background: '#FEE2E2', color: '#991B1B', borderRadius: '20px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px', fontWeight: 700, border: '1px solid #FECACA' }}>
            <FaExclamationCircle /> {error}
          </div>
        )}

        <div className="mg-table-card">
          <table className="mg-user-table">
            <thead>
              <tr>
                <th>Course Identity</th>
                <th>Author / Instructor</th>
                <th>Submission Date</th>
                <th>Publication Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.1rem' }}>
                    {course.title}
                    <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginTop: '4px' }}>
                       {course.instructor_name || "Unknown Instructor"}
                    </div>
                  </td>
                  <td>
                    <span className="mg-role-pill mg-role-instructor" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
                       COURSE
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B', fontWeight: 700 }}>
                       <FaExclamationCircle /> Pending
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                       <button
                         onClick={() => handleApprove(course.id)}
                         className="mg-action-btn"
                         style={{ background: '#DCFCE7', color: '#166534', padding: '8px 16px', borderRadius: '12px', border: 'none', fontWeight: 700 }}
                       >
                         Approve
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '100px' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                        <FaBookOpen style={{ fontSize: '3rem', color: '#3B82F6', opacity: 0.2 }} />
                        <p style={{ fontWeight: 700, color: '#94A3B8' }}>No pending course submissions found.</p>
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

export default ApproveCourses;
