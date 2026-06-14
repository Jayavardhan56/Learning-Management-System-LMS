import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaBook, FaAlignLeft, FaCheckCircle, FaArrowLeft, FaVideo, FaFileAlt, FaCertificate, FaPlus, FaTrash, FaLayerGroup, FaChevronDown, FaChevronUp, FaImage, FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../utils/auth";

const CreateCourse = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [courseInfo, setCourseInfo] = useState({ title: "", description: "", price: "0" });
  const [thumbnail, setThumbnail] = useState(null);

  const [modules, setModules] = useState([
    { id: Date.now(), title: "Module 1: Introduction", description: "", lessons: [
      { id: Date.now() + 1, title: "Lesson 1", type: "video", content: "", file: null }
    ]}
  ]);

  const [quizzes, setQuizzes] = useState([
    { id: Date.now(), question: "", options: ["", "", "", ""], correct: 0 }
  ]);

  const addModule = () => {
    setModules([...modules, { id: Date.now(), title: `Module ${modules.length + 1}`, description: "", lessons: [] }]);
  };

  const addLesson = (moduleId) => {
    setModules(modules.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, { id: Date.now(), title: `Lesson ${m.lessons.length + 1}`, type: "video", content: "", file: null }] } : m));
  };

  const updateLesson = (moduleId, lessonId, field, value) => {
    setModules(modules.map(m => m.id === moduleId ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l) } : m));
  };

  const deleteLesson = (moduleId, lessonId) => {
    setModules(modules.map(m => m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m));
  };

  const addQuiz = () => {
    setQuizzes([...quizzes, { id: Date.now(), question: "", options: ["", "", "", ""], correct: 0 }]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = getAuthToken();

    try {

      const courseData = new FormData();
      courseData.append("title", courseInfo.title);
      courseData.append("description", courseInfo.description);
      courseData.append("price", courseInfo.price);
      if (thumbnail) courseData.append("thumbnail", thumbnail);

      const courseRes = await fetch("http://localhost:5000/api/courses/add", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: courseData,
      });
      const course = await courseRes.json();

      if (!courseRes.ok) throw new Error(course.error);

      for (let i = 0; i < modules.length; i++) {
        const mod = modules[i];
        const modRes = await fetch(`http://localhost:5000/api/courses/${course.id}/modules`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ title: mod.title, description: mod.description, order_index: i }),
        });
        const savedMod = await modRes.json();

        for (let j = 0; j < mod.lessons.length; j++) {
          const lesson = mod.lessons[j];
          const lessonData = new FormData();
          lessonData.append("title", lesson.title);
          lessonData.append("media_type", lesson.type);
          lessonData.append("content_text", lesson.content);
          lessonData.append("order_index", j);
          if (lesson.file) lessonData.append("media", lesson.file);

          await fetch(`http://localhost:5000/api/courses/modules/${savedMod.id}/lessons`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: lessonData,
          });
        }
      }

      const validQuizzes = quizzes.filter(q => q.question.trim());
      if (validQuizzes.length > 0) {
        await fetch(`http://localhost:5000/api/courses/${course.id}/assessments`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: "Final Assessment",
            questions: validQuizzes
          }),
        });
      }

      setSuccess(true);
      setTimeout(() => navigate("/instructor"), 2000);
    } catch (err) {
      alert("Error creating course: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout title="Create Course">
        <div style={{ textAlign: 'center', padding: '100px', background: 'var(--bg-card)', borderRadius: '30px' }}>
          <div style={{ fontSize: '5rem', color: 'var(--accent)', marginBottom: '24px' }}><FaCheckCircle /></div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>Course Published!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Your course is now live and ready for students. Redirecting...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Course Builder">
      <div className="analytics-overview animate-fade-in" style={{ paddingBottom: '100px' }}>

        {}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            {[
              { n: 1, t: "Basic Info" },
              { n: 2, t: "Curriculum" },
              { n: 3, t: "Assessments" },
              { n: 4, t: "Publish" }
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step >= s.n ? 'var(--secondary)' : 'var(--bg-card)',
                  color: step >= s.n ? 'white' : 'var(--text-muted)',
                  fontWeight: 700, border: '2px solid', borderColor: step >= s.n ? 'var(--secondary)' : 'var(--border-color)',
                  transition: 'var(--transition)'
                }}>
                  {step > s.n ? <FaCheckCircle /> : s.n}
                </div>
                <span style={{ fontWeight: 700, color: step >= s.n ? 'var(--primary)' : 'var(--text-muted)' }}>{s.t}</span>
                {s.n < 4 && <div style={{ width: '40px', height: '2px', background: step > s.n ? 'var(--secondary)' : 'var(--border-color)' }}></div>}
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="builder-content">
          {step === 1 && (
            <div className="stat-card animate-fade-in" style={{ padding: '50px', maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '40px' }}>Basic Course Details</h2>
              <div style={{ marginBottom: '32px' }}>
                <label className="form-label">COURSE TITLE</label>
                <input
                  type="text" className="input-field" placeholder="e.g. Master React in 30 Days"
                  value={courseInfo.title} onChange={e => setCourseInfo({...courseInfo, title: e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label className="form-label">DESCRIPTION</label>
                <textarea
                  className="input-field" style={{ height: '150px' }} placeholder="What will students learn?"
                  value={courseInfo.description} onChange={e => setCourseInfo({...courseInfo, description: e.target.value})}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                  <label className="form-label">THUMBNAIL IMAGE</label>
                  <div style={{ position: 'relative' }}>
                    <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
                  </div>
                </div>
                <div>
                  <label className="form-label">COURSE PRICE (USD)</label>
                  <input
                    type="number" className="input-field" placeholder="0 for Free"
                    value={courseInfo.price} onChange={e => setCourseInfo({...courseInfo, price: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="stat-card animate-fade-in" style={{ padding: '50px', maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Course Curriculum</h2>
                <button onClick={addModule} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px' }}><FaPlus /> Add Module</button>
              </div>

              {modules.map((mod, mIdx) => (
                <div key={mod.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '25px', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">MODULE TITLE</label>
                      <input className="input-field" value={mod.title} onChange={e => setModules(modules.map(m => m.id === mod.id ? {...m, title: e.target.value} : m))} />
                    </div>
                  </div>

                  <div style={{ paddingLeft: '20px', borderLeft: '2px solid #e2e8f0', marginTop: '20px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '15px', fontWeight: 800 }}>LESSONS</h4>
                    {mod.lessons.map((lesson, lIdx) => (
                      <div key={lesson.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '15px' }}>
                          <input className="input-field" placeholder="Lesson Title" value={lesson.title} onChange={e => updateLesson(mod.id, lesson.id, 'title', e.target.value)} style={{ flex: 1 }} />
                          <select className="input-field" value={lesson.type} onChange={e => updateLesson(mod.id, lesson.id, 'type', e.target.value)} style={{ width: '150px' }}>
                            <option value="video">Video</option>
                            <option value="document">Document</option>
                          </select>
                          <button onClick={() => deleteLesson(mod.id, lesson.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', width: '45px', borderRadius: '10px', cursor: 'pointer' }}><FaTrash /></button>
                        </div>
                        {lesson.type === 'video' ? (
                          <input type="file" accept="video/*" onChange={e => updateLesson(mod.id, lesson.id, 'file', e.target.files[0])} />
                        ) : (
                          <textarea className="input-field" placeholder="Enter lesson text content..." value={lesson.content} onChange={e => updateLesson(mod.id, lesson.id, 'content', e.target.value)} style={{ height: '100px' }} />
                        )}
                      </div>
                    ))}
                    <button onClick={() => addLesson(mod.id)} className="btn-secondary" style={{ marginTop: '10px', padding: '10px 20px', fontSize: '0.85rem' }}><FaPlus /> Add Lesson</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="stat-card animate-fade-in" style={{ padding: '50px', maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Final Assessment</h2>
                <button onClick={addQuiz} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px' }}><FaPlus /> Add Question</button>
              </div>

              {quizzes.map((quiz, qIdx) => (
                <div key={quiz.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '25px', marginBottom: '20px' }}>
                  <label className="form-label">QUESTION {qIdx + 1}</label>
                  <input className="input-field" placeholder="Enter your question" value={quiz.question} onChange={e => setQuizzes(quizzes.map(q => q.id === quiz.id ? {...q, question: e.target.value} : q))} style={{ marginBottom: '20px' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {[0,1,2,3].map(optIdx => (
                      <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="radio" name={`correct-${quiz.id}`} checked={quiz.correct === optIdx} onChange={() => setQuizzes(quizzes.map(q => q.id === quiz.id ? {...q, correct: optIdx} : q))} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                        <input className="input-field" placeholder={`Option ${optIdx + 1}`} value={quiz.options[optIdx]} onChange={e => {
                          const newOpts = [...quiz.options];
                          newOpts[optIdx] = e.target.value;
                          setQuizzes(quizzes.map(q => q.id === quiz.id ? {...q, options: newOpts} : q));
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="stat-card animate-fade-in" style={{ padding: '50px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
              <FaLayerGroup style={{ fontSize: '4rem', color: '#6366f1', marginBottom: '20px' }} />
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '15px' }}>Ready to Publish</h2>
              <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 40px' }}>
                You have configured {modules.length} modules and {quizzes.length} assessment questions. Click below to finalize and push this course to the database.
              </p>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '30px', textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: 700 }}>
                  <span style={{ color: '#64748b' }}>Course Title:</span>
                  <span style={{ color: '#0f172a' }}>{courseInfo.title || "Untitled"}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: 700 }}>
                  <span style={{ color: '#64748b' }}>Modules:</span>
                  <span style={{ color: '#0f172a' }}>{modules.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span style={{ color: '#64748b' }}>Questions:</span>
                  <span style={{ color: '#0f172a' }}>{quizzes.filter(q => q.question).length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{
          position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
          width: 'calc(100% - 350px)', maxWidth: '1000px',
          background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)',
          padding: '20px 40px', borderRadius: '100px', border: '1px solid var(--border-color)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)', zIndex: 1000
        }}>
          <button
            className="btn-secondary"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '100px' }}
          >
            <FaArrowLeft /> Previous Step
          </button>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Step {step} of 4
          </div>

          <button
            className="btn-primary"
            onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
            disabled={loading}
            style={{ padding: '12px 32px', borderRadius: '100px' }}
          >
            {step === 4 ? (loading ? "Publishing..." : "Finalize & Publish") : "Continue to Next Step"}
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CreateCourse;