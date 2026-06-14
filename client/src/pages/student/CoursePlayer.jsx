import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  FaPlay, FaFileAlt, FaCheckCircle, FaAward, FaTimesCircle,
  FaSpinner, FaLock, FaCertificate, FaArrowRight, FaQuestionCircle,
  FaChevronRight, FaChevronDown, FaClock, FaStar, FaTv
} from "react-icons/fa";
import { getAuthToken, getAuthUser } from "../../utils/auth";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/CoursePlayer.css";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const [user] = useState(getAuthUser());
  const [structure, setStructure] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [certRequested, setCertRequested] = useState(false);
  const [certApproved, setCertApproved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const token = getAuthToken();
      const [structRes, progRes, quizRes, certRes, scoreRes] = await Promise.all([
        fetch(`http://localhost:5000/api/courses/${courseId}/structure`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:5000/api/courses/${courseId}/progress`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:5000/api/courses/${courseId}/assessments`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:5000/api/courses/certificate-requests`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:5000/api/courses/${courseId}/scores`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const structData = await structRes.json();
      const progData = await progRes.json();
      const quizData = await quizRes.json();
      const certData = await certRes.json();
      const scoreData = await scoreRes.json();

      if (structRes.ok && Array.isArray(structData)) {
        setStructure(structData);
        if (structData.length > 0) setCurrentLesson(structData[0]);
      }
      if (progRes.ok) setProgress(Array.isArray(progData) ? progData : []);
      if (quizRes.ok && Array.isArray(quizData)) {
        setQuizzes(quizData.map(q => ({ ...q, questions: typeof q.questions === 'string' ? JSON.parse(q.questions) : q.questions })));
      }
      if (scoreRes.ok && Array.isArray(scoreData) && scoreData.length > 0) {
        setQuizScore(scoreData[0].score);
      }
      if (certRes.ok && Array.isArray(certData)) {
        const myReq = certData.find(r => r.course_id == courseId);
        if (myReq) {
          setCertRequested(true);
          if (myReq.status == 'approved') setCertApproved(true);
        }
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleComplete = async (lessonId) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`http://localhost:5000/api/courses/lessons/${lessonId}/progress`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: true })
      });
      if (res.ok) {
        const progRes = await fetch(`http://localhost:5000/api/courses/${courseId}/progress`, { headers: { Authorization: `Bearer ${token}` } });
        const newProg = await progRes.json();
        const safeProg = Array.isArray(newProg) ? newProg : [];
        setProgress(safeProg);

        const compCount = uniqueLessons.filter(l => safeProg.some(p => p.lesson_id == l.lesson_id && p.is_completed)).length;
        if (compCount === totalLessons) {
          alert("Congratulations! You have completed all lessons in this course.");
        }
        if (compCount === totalLessons && (quizzes.length === 0 || quizScore >= 70) && !certRequested) {
           await fetch("http://localhost:5000/api/courses/request-certificate", {
             method: "POST",
             headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
             body: JSON.stringify({ courseId })
           });
           setCertRequested(true);
        }
      }
    } catch (err) { console.error(err); }
  };

  const isCompleted = (lessonId) => progress.some(p => p.lesson_id == lessonId && p.is_completed);
  const uniqueLessons = structure.filter(l => l.lesson_id !== null);
  const totalLessons = uniqueLessons.length;
  const completedCount = uniqueLessons.filter(l => isCompleted(l.lesson_id)).length;
  const completionPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const allCompleted = totalLessons > 0 && completedCount === totalLessons;

  const modules = structure.reduce((acc, curr) => {
    const mod = acc.find(m => m.id == curr.module_id);
    if (mod) mod.lessons.push(curr);
    else acc.push({ id: curr.module_id, title: curr.module_title, lessons: curr.lesson_id ? [curr] : [] });
    return acc;
  }, []);

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleQuizSubmit = async () => {
    let correctCount = 0;
    let totalQuestions = 0;
    quizzes.forEach(quiz => {
      quiz.questions.forEach((q, idx) => {
        totalQuestions++;
        if (Number(selectedAnswers[`${quiz.id}_${idx}`]) === Number(q.correct)) correctCount++;
      });
    });

    try {
      const token = getAuthToken();
      const score = Math.round((correctCount / totalQuestions) * 100);
      if (quizzes.length === 0) return;
      const res = await fetch(`http://localhost:5000/api/courses/assessments/${quizzes[0].id}/score`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ score, total: totalQuestions })
      });
      if (res.ok) {
        setQuizScore(score);
        setShowQuiz(false);

        if (score >= 70 && allCompleted) {
           await fetch("http://localhost:5000/api/courses/request-certificate", {
             method: "POST",
             headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
             body: JSON.stringify({ courseId })
           });
           setCertRequested(true);
        }
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <DashboardLayout title="Student Portal"><div style={{ padding: '100px', textAlign: 'center' }}><FaSpinner className="animate-spin" style={{ fontSize: '3rem', color: '#3B82F6' }} /></div></DashboardLayout>;

  return (
    <DashboardLayout title="Student Portal">
      <div className="cp-player-layout">

        <div className="cp-main-player">
           <div className="cp-content-area">
              {currentLesson ? (
                <div style={{ padding: '60px', overflowY: 'auto', height: '100%' }}>
                   <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px' }}>{currentLesson.lesson_title}</h2>

                      {currentLesson.media_url && (
                        <div style={{ marginBottom: '30px', width: '100%', height: '600px', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           {currentLesson.media_type === 'video' || String(currentLesson.media_url).match(/\.(mp4|webm|ogg)$/i) ? (
                             <video
                               src={currentLesson.media_url.startsWith('http') ? currentLesson.media_url : `http://localhost:5000${currentLesson.media_url}`}
                               controls
                               style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                               onError={(e) => { e.target.outerHTML = '<div style="padding:40px; text-align:center; color:#ef4444; font-weight:600;">Media failed to load. Please contact support.</div>' }}
                             />
                           ) : (
                             <iframe
                               src={currentLesson.media_url.startsWith('http') ? currentLesson.media_url : `http://localhost:5000${currentLesson.media_url}`}
                               style={{ width: '100%', height: '100%', border: 'none' }}
                               title="Document Viewer"
                               onError={(e) => { e.target.outerHTML = '<div style="padding:40px; text-align:center; color:#ef4444; font-weight:600;">Document failed to load. Please check the source.</div>' }}
                             />
                           )}
                        </div>
                      )}

                      <div style={{ color: '#475569', lineHeight: '1.8', fontSize: '1.1rem' }}>
                         {currentLesson.content_text || "Lesson content goes here. This track covers the essential tools and techniques required to master the subject. Please review the material thoroughly."}
                      </div>
                    </div>
                 </div>
               ) : (
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                    Select a lesson to begin.
                 </div>
               )}
            </div>

           <div className="cp-bottom-bar">
              <div className="cp-lesson-info">
                 <h4>{currentLesson?.lesson_title || 'No Lesson Selected'}</h4>
                 <p>Reading Material</p>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                 {currentLesson && !isCompleted(currentLesson.lesson_id) ? (
                   <button onClick={() => handleComplete(currentLesson.lesson_id)} className="cp-mark-btn">Mark as Complete</button>
                 ) : (
                   <button className="cp-mark-btn completed"><FaCheckCircle /> Completed</button>
                 )}
              </div>
           </div>
        </div>

        <div className="cp-sidebar">
           <div className="cp-sidebar-header">Course Content</div>
           <div className="cp-content-list">
              {modules.map((mod, mIdx) => (
                <div key={mod.id}>
                   {mod.lessons.map((lesson, lIdx) => (
                     <div
                      key={lesson.lesson_id}
                      className={`cp-sidebar-item ${currentLesson?.lesson_id === lesson.lesson_id ? 'active' : ''}`}
                      onClick={() => setCurrentLesson(lesson)}
                     >
                        <div className={`cp-item-status ${isCompleted(lesson.lesson_id) ? 'done' : ''}`}>
                           {isCompleted(lesson.lesson_id) && <FaCheckCircle style={{ fontSize: '0.6rem', color: 'white' }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                           <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{lesson.lesson_title}</div>
                           <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>Reading • 5m</div>
                        </div>
                     </div>
                   ))}
                </div>
              ))}
           </div>

           <div className="cp-sidebar-footer">
              <div className="cp-progress-tracker">
                 <div className="cp-tracker-title">Course Progress Tracking</div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '8px' }}>
                    <span>Progress</span>
                    <span>{completionPercentage}%</span>
                 </div>
                 <div style={{ height: '6px', background: '#334155', borderRadius: '10px' }}>
                    <div style={{ width: `${completionPercentage}%`, height: '100%', background: '#6366f1', borderRadius: '10px' }} />
                 </div>
                 <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '10px' }}>Status: {allCompleted ? 'Ready for Exam' : 'Learning'}</div>
              </div>

              {certApproved ? (
                <button onClick={() => navigate(`/student/certificate/${courseId}`)} className="cp-exam-btn" style={{ background: '#10b981', color: 'white' }}>
                   <FaCertificate /> View Certificate
                </button>
              ) : certRequested ? (
                <button disabled className="cp-exam-btn" style={{ background: '#f59e0b', color: 'white', cursor: 'not-allowed' }}>
                   <FaClock /> Pending Admin Approval
                </button>
              ) : (
                <button onClick={() => setShowQuiz(true)} disabled={!allCompleted} className="cp-exam-btn">
                   {allCompleted ? 'Take Final Exam' : 'Complete all lessons first'}
                </button>
              )}
           </div>
        </div>

      </div>

      {showQuiz && (
        <div className="cp-quiz-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ background: 'white', width: '600px', borderRadius: '16px', padding: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                 <h3>Final Assessment</h3>
                 <FaTimesCircle onClick={() => setShowQuiz(false)} style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#94a3b8' }} />
              </div>

              {quizzes.length > 0 ? (
                <div>
                   {quizzes[0].questions.map((q, idx) => (
                     <div key={idx} style={{ marginBottom: '25px' }}>
                        <p style={{ fontWeight: 600, marginBottom: '12px' }}>{idx+1}. {q.question}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                           {q.options.map((opt, oIdx) => (
                             <button
                              key={oIdx}
                              onClick={() => setSelectedAnswers({...selectedAnswers, [`${quizzes[0].id}_${idx}`]: oIdx})}
                              style={{
                                padding: '12px', textAlign: 'left', borderRadius: '8px', border: '1px solid',
                                borderColor: selectedAnswers[`${quizzes[0].id}_${idx}`] === oIdx ? '#6366f1' : '#e2e8f0',
                                background: selectedAnswers[`${quizzes[0].id}_${idx}`] === oIdx ? '#eef2ff' : 'white'
                              }}
                             >
                                {opt}
                             </button>
                           ))}
                        </div>
                     </div>
                   ))}
                   <button onClick={handleQuizSubmit} className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '20px' }}>Submit Exam</button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                   No assessment available for this course. You can request your certificate directly.
                   <button
                    className="btn-primary"
                    style={{ width: '100%', marginTop: '20px' }}
                    onClick={async () => {
                        const token = getAuthToken();
                        await fetch("http://localhost:5000/api/courses/request-certificate", {
                            method: "POST",
                            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                            body: JSON.stringify({ courseId })
                        });
                        setCertRequested(true);
                        setShowQuiz(false);
                    }}
                   >
                     Apply for Certificate
                   </button>
                </div>
              )}
           </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CoursePlayer;

