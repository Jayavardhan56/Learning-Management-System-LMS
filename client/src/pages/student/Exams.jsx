import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaClock, FaCheckCircle, FaExclamationCircle, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../../utils/auth';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import '../../styles/StudentDashboard.css';

const Exams = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    const token = getAuthToken();
    try {
      const res = await fetch("http://localhost:5000/api/courses/my-courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {

        const active = data.filter(c => c.enrollment_status === 'active');
        setCourses(active);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Assessments & Exams">
      <div className="sd-dashboard-layout animate-fade-in" style={{ padding: '20px' }}>
        <div style={{ marginBottom: '30px' }}>
           <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>Available Assessments</h2>
           <p style={{ color: '#64748B' }}>Complete your course lessons to unlock the final certification exams.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>Loading Assessments...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
            {courses.map(course => {
              const isReady = course.completed_lessons_count >= course.total_lessons_count && course.total_lessons_count > 0;
              return (
                <div key={course.id} style={{ background: 'white', borderRadius: '16px', padding: '25px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                     <div style={{ width: '40px', height: '40px', background: isReady ? '#eef2ff' : '#f8fafc', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isReady ? '#6366f1' : '#94a3b8' }}>
                        <FaPencilAlt />
                     </div>
                     <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '100px', background: isReady ? '#f0fdf4' : '#fffbeb', color: isReady ? '#22c55e' : '#f59e0b' }}>
                        {isReady ? 'READY' : 'LOCKED'}
                     </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>{course.title} Final Exam</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '20px' }}>Passing this exam with 70% or higher is required for certification.</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '12px', marginBottom: '20px' }}>
                     <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '5px' }}>COURSE PROGRESS</div>
                        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '10px' }}>
                           <div style={{ width: `${Math.round((course.completed_lessons_count / course.total_lessons_count) * 100) || 0}%`, height: '100%', background: '#6366f1', borderRadius: '10px' }} />
                        </div>
                     </div>
                     <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>{Math.round((course.completed_lessons_count / course.total_lessons_count) * 100) || 0}%</div>
                  </div>

                  <button
                    onClick={() => navigate(`/student/course/${course.id}/learn`)}
                    className="btn-primary"
                    style={{ width: '100%', padding: '12px', background: isReady ? '#6366f1' : '#94a3b8', border: 'none' }}
                  >
                    {isReady ? 'Start Assessment' : 'Complete Lessons to Unlock'} <FaArrowRight style={{ marginLeft: '10px' }} />
                  </button>
                </div>
              );
            })}

            {courses.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                 <FaExclamationCircle style={{ fontSize: '3rem', color: '#E2E8F0', marginBottom: '20px' }} />
                 <h2 style={{ fontSize: '1.4rem', color: '#0F172A' }}>No Active Courses</h2>
                 <p style={{ color: '#64748B' }}>Enroll in a course and get approved to see assessments here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Exams;
