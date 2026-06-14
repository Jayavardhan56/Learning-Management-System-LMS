import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaBook, FaCheckCircle, FaHourglassHalf, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAuthUser, getAuthToken } from "../../utils/auth";

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setCourses(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="My Courses">
      <div className="analytics-overview">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Course Repository</h2>
            <p style={{ color: 'var(--text-muted)' }}>Manage and track the approval status of your educational content.</p>
          </div>
          <button onClick={() => navigate("/instructor/create-course")} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaPlus /> Create New Course
          </button>
        </div>

        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {courses.map(course => (
            <div key={course.id} className="stat-card" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ width: '50px', height: '50px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--secondary)' }}>
                  <FaBook />
                </div>
                <span className="stat-badge" style={{ background: course.is_approved ? '#D1FAE5' : '#FEE2E2', color: course.is_approved ? '#065F46' : '#991B1B' }}>
                  {course.is_approved ? <><FaCheckCircle /> Published</> : <><FaHourglassHalf /> Pending</>}
                </span>
              </div>
              <h3 style={{ marginBottom: '10px', fontSize: '1.2rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.title}</h3>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                marginBottom: '20px',
                height: '54px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>{course.description}</p>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{new Date(course.created_at).toLocaleDateString()}</span>
                <button onClick={() => navigate(`/instructor/edit-course/${course.id}`)} style={{ border: 'none', background: 'none', fontWeight: 800, color: 'var(--secondary)', cursor: 'pointer', padding: '0' }}>Edit Details</button>
              </div>
            </div>
          ))}
          {courses.length === 0 && !loading && (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '100px', background: 'white', borderRadius: '24px' }}>
              <h3>No courses found.</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Start your journey by creating your first course.</p>
              <button className="btn-primary" onClick={() => navigate("/instructor/create-course")}>Get Started</button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorCourses;
