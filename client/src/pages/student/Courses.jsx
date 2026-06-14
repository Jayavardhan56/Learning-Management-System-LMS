import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { FaBookOpen, FaCheckCircle, FaUserTie, FaArrowRight, FaClock, FaBook, FaTimes, FaHourglassHalf, FaStar } from "react-icons/fa";
import { getAuthToken, getAuthUser } from "../../utils/auth";
import "../../styles/Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();
  const user = getAuthUser();
  const token = getAuthToken();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, enrolledRes] = await Promise.all([
        fetch("http://localhost:5000/api/courses", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/courses/my-courses", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const coursesData = await coursesRes.json();
      const enrolledData = await enrolledRes.json();
      if (coursesRes.ok) setCourses(Array.isArray(coursesData) ? coursesData.filter(c => c.is_approved) : []);
      if (enrolledRes.ok) setEnrolledCourses(Array.isArray(enrolledData) ? enrolledData : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleEnroll = async (courseId) => {
    if (user.role !== "student") return;
    setActionLoading(courseId);
    try {
      const res = await fetch("http://localhost:5000/api/courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId }),
      });
      if (res.ok) {
        const newEnrollment = await res.json();
        setEnrolledCourses(prev => [...prev, { ...newEnrollment, id: courseId, enrollment_status: 'pending' }]);
      }
    } catch (err) { console.error(err); }
    finally { setActionLoading(null); }
  };

  const handleUnenroll = async (courseId) => {
    if (!window.confirm("Are you sure you want to unenroll from this course?")) return;
    setActionLoading(courseId);
    try {
      const res = await fetch("http://localhost:5000/api/courses/unenroll", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId }),
      });
      if (res.ok) setEnrolledCourses(prev => prev.filter(e => e.id !== courseId));
    } catch (err) { console.error(err); }
    finally { setActionLoading(null); }
  };

  if (loading) return <DashboardLayout title="Catalog"><div style={{ padding: '100px', textAlign: 'center' }}>Loading Course Catalog...</div></DashboardLayout>;

  return (
    <DashboardLayout title="Global Library">
      <div className="cl-catalog-container animate-fade-in">
        <div className="cl-header">
           <h2>Global Course Catalog</h2>
           <p>Explore our verified professional training programs designed for global excellence.</p>
        </div>

        <div className="cl-grid">
           {courses.map((course) => {
              const enrollment = enrolledCourses.find(e => e.id == course.id);
              const isEnrolled = !!enrollment;
              const isActive = enrollment?.enrollment_status === 'active';

              return (
                <div key={course.id} className="cl-card">
                   <div
                    className="cl-card-banner"
                    style={{ backgroundImage: `url(${course.thumbnail_url || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800'})` }}
                   >
                      {isEnrolled && (
                        <div className="cl-status-badge" style={{ background: isActive ? '#10b981' : '#f59e0b' }}>
                           {isActive ? 'Active' : 'Pending'}
                        </div>
                      )}
                   </div>

                   <div className="cl-card-body">
                      <div className="cl-category">{course.category || "Professional Track"}</div>
                      <h3 className="cl-title">{course.title}</h3>
                      <p className="cl-desc">{course.description || "Master industry-standard skills with our comprehensive professional training modules."}</p>

                      <div className="cl-meta">
                         <div className="cl-meta-item">
                            <FaUserTie style={{ color: '#6366f1' }} />
                            <span>{course.instructor_name || 'Admin'}</span>
                         </div>
                         <div className="cl-meta-item">
                            <FaClock style={{ color: '#6366f1' }} />
                            <span>{course.duration || '15'}h</span>
                         </div>
                         <div className="cl-meta-item" style={{ color: '#f59e0b' }}>
                            <FaStar /> 4.8
                         </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                         {isEnrolled ? (
                           <>
                             <button
                               onClick={() => isActive ? navigate(`/student/course/${course.id}/learn`) : navigate(`/student/course/${course.id}`)}
                               className="cl-enroll-btn primary"
                               style={{ flex: 1 }}
                             >
                                {isActive ? 'Continue Learning' : 'View Status'} <FaArrowRight />
                             </button>
                             <button
                               onClick={() => handleUnenroll(course.id)}
                               disabled={actionLoading === course.id}
                               className="cl-unenroll-btn"
                             >
                                <FaTimes />
                             </button>
                           </>
                         ) : (
                           <button
                             onClick={() => handleEnroll(course.id)}
                             disabled={actionLoading === course.id}
                             className="cl-enroll-btn secondary"
                           >
                              {actionLoading === course.id ? 'Processing...' : 'Enroll Now'}
                           </button>
                         )}
                      </div>
                   </div>
                </div>
              );
           })}
        </div>

        {courses.length === 0 && (
           <div style={{ textAlign: 'center', padding: '100px', background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <FaBookOpen style={{ fontSize: '4rem', color: '#e2e8f0', marginBottom: '20px' }} />
              <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 600 }}>The catalog is currently being updated. Please check back later.</p>
           </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Courses;

