import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  FaBook, FaUsers, FaPlus, FaCheckCircle, FaExclamationCircle,
  FaChartBar, FaGraduationCap, FaChalkboardTeacher, FaRocket, FaArrowRight
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAuthToken, getAuthUser } from "../../utils/auth";
import "../../styles/InstructorDashboard.css";

const InstructorDashboard = () => {
  const user = getAuthUser();
  const [data, setData] = useState({ courses: [], studentCount: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = getAuthToken();
      const [courseRes, statsRes] = await Promise.all([
        fetch("http://localhost:5000/api/courses", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/auth/stats", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const courses = await courseRes.json();
      const stats = await statsRes.json();
      if (courseRes.ok && Array.isArray(courses)) {
        setData({ courses, studentCount: stats.total_enrollments || 0 });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <DashboardLayout title="Instructor Hub">
      <div className="animate-fade-in id-analytics-overview">

        {}
        <div className="id-welcome-banner">
           <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', display: 'inline-block', padding: '10px 24px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 800, marginBottom: '25px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', letterSpacing: '2px' }}>INSTRUCTOR PORTAL</div>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '15px', letterSpacing: '-1.5px' }}>Welcome back, {user.name}</h1>
              <p style={{ fontSize: '1.2rem', color: '#94A3B8', maxWidth: '650px', lineHeight: 1.6 }}>Build high-impact curriculum, engage with your students, and monitor your academic reach across the platform.</p>
           </div>
           <FaChalkboardTeacher style={{ position: 'absolute', right: '-40px', bottom: '-40px', fontSize: '25rem', opacity: 0.03, transform: 'rotate(-15deg)' }} />
        </div>

        {}
        <div className="id-stats-grid">
           <div className="id-stat-card-premium">
              <div className="id-stat-icon-box" style={{ background: '#EFF6FF', color: '#3B82F6' }}><FaBook /></div>
              <div>
                 <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Curriculum Units</div>
                 <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A' }}>{data.courses.length}</div>
              </div>
           </div>
           <div className="id-stat-card-premium">
              <div className="id-stat-icon-box" style={{ background: '#F0FDF4', color: '#10B981' }}><FaUsers /></div>
              <div>
                 <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Active Learners</div>
                 <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A' }}>{data.studentCount}</div>
              </div>
           </div>
           <div className="id-stat-card-premium">
              <div className="id-stat-icon-box" style={{ background: '#FFF7ED', color: '#F59E0B' }}><FaRocket /></div>
              <div>
                 <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Platform Reach</div>
                 <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A' }}>Expert</div>
              </div>
           </div>
        </div>

        {}
        <div className="id-content-grid">
           <div className="id-launch-card" onClick={() => navigate("/instructor/create-course")}>
              <div style={{ width: '100px', height: '100px', background: '#F8FAFC', color: '#3B82F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', marginBottom: '30px', border: '1px solid #E2E8F0' }}><FaPlus /></div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', marginBottom: '10px' }}>Launch New Course</h2>
              <p style={{ color: '#64748B', fontWeight: 600 }}>Create immersive learning experiences and share your expertise.</p>
           </div>

           <div className="id-pipeline-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '15px' }}><FaGraduationCap /> Curriculum Pipeline</h3>
                 <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 16px' }} onClick={() => navigate("/instructor/courses")}>View All</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                 {data.courses.slice(0, 3).map(course => (
                    <div key={course.id} className="id-pipeline-item">
                       <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A', marginBottom: '6px' }}>{course.title}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                             {course.is_approved ?
                                <span style={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '100px' }}><FaCheckCircle /> PUBLISHED</span> :
                                <span style={{ color: '#F59E0B', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '100px' }}><FaExclamationCircle /> IN REVIEW</span>
                             }
                          </div>
                       </div>
                       <button
                         onClick={() => navigate(`/instructor/edit-course/${course.id}`)}
                         className="btn-secondary"
                         style={{ padding: '12px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem' }}
                       >
                         Manage <FaArrowRight style={{ marginLeft: '8px' }} />
                       </button>
                    </div>
                 ))}
                 {data.courses.length === 0 && !loading && (
                   <div style={{ textAlign: 'center', padding: '80px', color: '#94A3B8', fontWeight: 700 }}>
                      No active curriculum found. Start by creating a course!
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorDashboard;