import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  FaPlay, FaCheckCircle, FaStar, FaClock, FaCalendarAlt,
  FaCertificate, FaTv, FaSync,
  FaArrowRight, FaSpinner, FaLayerGroup, FaUserCircle, FaHourglassHalf
} from "react-icons/fa";
import { getAuthToken } from "../../utils/auth";
import "../../styles/CourseOverview.css";

const CourseOverview = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [progressData, setProgressData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const token = getAuthToken();
      const [res, progRes] = await Promise.all([
         fetch(`http://localhost:5000/api/courses`, { headers: { Authorization: `Bearer ${token}` } }),
         fetch(`http://localhost:5000/api/courses/${courseId}/progress`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const data = await res.json();
      const found = Array.isArray(data) ? data.find(c => c.id == courseId) : null;
      setCourse(found);
      if (progRes.ok) {
         const pData = await progRes.json();
         setProgressData(Array.isArray(pData) ? pData : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/courses/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ courseId })
      });
      if (res.ok) {
        await fetchCourseDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <DashboardLayout title="Student Portal"><div style={{ padding: '100px', textAlign: 'center' }}><FaSpinner className="animate-spin" style={{ fontSize: '3rem', color: '#3B82F6' }} /></div></DashboardLayout>;
  if (!course) return <DashboardLayout title="Student Portal"><div style={{ padding: '100px', textAlign: 'center' }}>Course not found.</div></DashboardLayout>;

  const enrollmentStatus = course.enrollment_status;

  return (
    <DashboardLayout title="Student Portal">
      <div className="co-overview-container animate-fade-in">

        <div className="co-main-content">
          <div className="co-overview-header">
             <span className="co-category-badge">{course.category || "GENERAL"}</span>
             <h1>{course.title}</h1>
             <p>{course.description || "Master the foundations and advanced concepts of this track."}</p>

             <div className="co-meta-row">
                <div className="co-meta-item">
                   <FaLayerGroup style={{ color: '#6366f1' }} /> {course.level || "All Levels"}
                </div>
                <div className="co-meta-item" style={{ color: '#f59e0b' }}>
                   <FaStar /> 4.5 <span style={{ color: '#94a3b8' }}>(120 reviews)</span>
                </div>
                <div className="co-meta-item">
                   <FaSync style={{ color: '#6366f1' }} /> Updated Recently
                </div>
             </div>
          </div>

          <div className="co-instructor-section">
             <div style={{ width: '45px', height: '45px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaUserCircle style={{ color: '#94a3b8', fontSize: '1.8rem' }} />
             </div>
             <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Created By</div>
                <div style={{ fontWeight: 700, color: '#1e293b' }}>{course.instructor_name || 'Instructor'}</div>
             </div>
          </div>

          <div className="co-learn-card">
             <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '25px', color: '#1e293b' }}>What you'll learn</h2>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  "Master the core concepts of " + course.title,
                  "Build real-world projects",
                  "Understand industry best practices",
                  "Become job-ready"
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                     <FaCheckCircle style={{ color: '#10b981', fontSize: '1rem', marginTop: '3px' }} />
                     <span style={{ color: '#475569', fontWeight: 500, fontSize: '0.95rem' }}>{item}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="co-progress-section">
             <div className="co-progress-header">
                <div>
                   <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>Your Learning Progress</h2>
                   <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '5px' }}>Track your time spent across the course modules</p>
                </div>
                <div className="co-time-box">
                   <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase' }}>Total Time Spent</div>
                   <div className="co-time-val">{Math.floor((progressData.filter(p => p.is_completed).length * 5) / 60)}h {(progressData.filter(p => p.is_completed).length * 5) % 60}m</div>
                </div>
             </div>
             <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>
                   Module breakdown will appear as you progress. Completed {progressData.filter(p => p.is_completed).length} lessons.
                </div>
             </div>
          </div>
        </div>

        <div className="co-sidebar">
           <div className="co-enroll-card">
              <div className="co-preview-box" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${course.thumbnail_url || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800'})` }}>
                 <div className="co-play-btn-wrapper">
                    <FaPlay style={{ color: '#6366f1', fontSize: '1.2rem', marginLeft: '4px' }} />
                 </div>
                 <div style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>Preview Course</div>
              </div>

              <div className="co-enroll-body">
                 <div className="co-price-tag">Open Access</div>
                 <div className="co-access-type">LIFETIME ACCESS</div>

                 {enrollmentStatus === 'active' || enrollmentStatus === 'completed' ? (
                   <button
                    onClick={() => navigate(`/student/course/${courseId}/learn`)}
                    className="btn-primary"
                    style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                   >
                     {enrollmentStatus === 'completed' ? 'Review Course' : 'Continue Learning'} <FaArrowRight />
                   </button>
                 ) : enrollmentStatus === 'pending' ? (
                   <button className="btn-secondary" style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, opacity: 0.7, cursor: 'not-allowed' }}>
                     Approval Pending
                   </button>
                 ) : (
                   <button
                     onClick={handleEnroll}
                     disabled={enrolling}
                     className="btn-primary"
                     style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                   >
                     {enrolling ? <FaSpinner className="animate-spin" /> : 'Enroll Now'}
                   </button>
                 )}

                 <div className="co-features-list">
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>This course includes:</div>
                    <div className="co-feature-item">
                       <FaClock className="co-feature-icon" /> 15 mins on-demand video
                    </div>
                    <div className="co-feature-item">
                       <FaCheckCircle className="co-feature-icon" /> Access on mobile and TV
                    </div>
                    <div className="co-feature-item">
                       <FaCertificate className="co-feature-icon" /> Certificate of completion
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseOverview;
