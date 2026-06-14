import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaBook, FaArrowLeft, FaCheckCircle, FaPlus, FaTrash, FaLayerGroup, FaVideo, FaFileAlt, FaImage, FaQuestionCircle, FaSave } from "react-icons/fa";
import { getAuthToken } from "../../utils/auth";

const EditCourse = () => {
  const { courseId } = useParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const [courseInfo, setCourseInfo] = useState({ title: "", description: "", price: "0" });
  const [thumbnail, setThumbnail] = useState(null);
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const token = getAuthToken();
      const [courseRes, structureRes, assessmentRes] = await Promise.all([
        fetch(`http://localhost:5000/api/courses/course/${courseId}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:5000/api/courses/structure/${courseId}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:5000/api/courses/assessments/${courseId}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const courseData = await courseRes.json();
      const structureData = await structureRes.json();
      const assessmentData = await assessmentRes.json();

      if (courseRes.ok) setCourseInfo({ title: courseData.title, description: courseData.description, price: courseData.price });

      if (structureRes.ok) {
        const grouped = structureData.reduce((acc, curr) => {
          if (!curr.module_id) return acc;
          let mod = acc.find(m => m.id === curr.module_id);
          if (!mod) {
            mod = { id: curr.module_id, title: curr.module_title, description: curr.module_desc, lessons: [] };
            acc.push(mod);
          }
          if (curr.lesson_id) {
            mod.lessons.push({ id: curr.lesson_id, title: curr.lesson_title, type: curr.content_type, content: curr.content_text, url: curr.content_url, file: null });
          }
          return acc;
        }, []);
        setModules(grouped);
      }

      if (assessmentRes.ok && assessmentData.length > 0) {
        setQuizzes(assessmentData[0].questions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addModule = () => setModules([...modules, { id: Date.now(), title: `New Module`, description: "", lessons: [], isNew: true }]);

  const addLesson = (modId) => {
    setModules(modules.map(m => m.id === modId ? { ...m, lessons: [...m.lessons, { id: Date.now(), title: "New Lesson", type: "text", content: "", file: null, isNew: true }] } : m));
  };

  const updateLesson = (modId, lessonId, field, value) => {
    setModules(modules.map(m => m.id === modId ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l) } : m));
  };

  const deleteLesson = async (modId, lessonId, isNew) => {
    if (!isNew && !confirm("Delete lesson permanently?")) return;
    if (!isNew) {
      const token = getAuthToken();
      await fetch(`http://localhost:5000/api/courses/lesson/${lessonId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    }
    setModules(modules.map(m => m.id === modId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m));
  };

  const deleteModule = async (modId, isNew) => {
    if (!isNew && !confirm("Delete module and all its lessons?")) return;
    if (!isNew) {
      const token = getAuthToken();
      await fetch(`http://localhost:5000/api/courses/module/${modId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    }
    setModules(modules.filter(m => m.id !== modId));
  };

  const handleUpdate = async () => {
    setSaving(true);
    const token = getAuthToken();
    try {
      await fetch(`http://localhost:5000/api/courses/update/${courseId}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(courseInfo)
      });

      for (let mod of modules) {
        let currentModId = mod.id;
        if (mod.isNew) {
          const res = await fetch(`http://localhost:5000/api/courses/module/${courseId}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ title: mod.title, description: "", order_index: 0 })
          });
          const savedMod = await res.json();
          currentModId = savedMod.id;
        }

        for (let lesson of mod.lessons) {
          if (lesson.isNew) {
            const lessonData = new FormData();
            lessonData.append("title", lesson.title);
            lessonData.append("content_type", lesson.type);
            lessonData.append("content_text", lesson.content);
            lessonData.append("order_index", 0);
            if (lesson.file) lessonData.append("media", lesson.file);

            await fetch(`http://localhost:5000/api/courses/lesson/${currentModId}`, {
              method: "POST",
              headers: { "Authorization": `Bearer ${token}` },
              body: lessonData
            });
          }
        }
      }

      await fetch(`http://localhost:5000/api/courses/assessment/${courseId}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ questions: quizzes })
      });

      alert("Course updated successfully!");
      navigate("/instructor");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLayout title="Edit Course"><div>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout title="Edit Course">
      <div className="analytics-overview animate-fade-in" style={{ paddingBottom: '100px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            {[{ n: 1, t: "Basic Info" }, { n: 2, t: "Curriculum" }, { n: 3, t: "Assessments" }, { n: 4, t: "Save Changes" }].map(s => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step >= s.n ? 'var(--secondary)' : 'var(--bg-card)', color: step >= s.n ? 'white' : 'var(--text-muted)',
                  fontWeight: 700, border: '2px solid', borderColor: step >= s.n ? 'var(--secondary)' : 'var(--border-color)',
                }}>{s.n}</div>
                <span style={{ fontWeight: 700, color: step >= s.n ? 'var(--primary)' : 'var(--text-muted)' }}>{s.t}</span>
                {s.n < 4 && <div style={{ width: '40px', height: '2px', background: step > s.n ? 'var(--secondary)' : 'var(--border-color)' }}></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="builder-content">
          {step === 1 && (
            <div className="stat-card" style={{ padding: '50px', maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '40px' }}>Course Details</h2>
              <div style={{ marginBottom: '32px' }}>
                <label className="form-label">TITLE</label>
                <input type="text" className="input-field" value={courseInfo.title} onChange={e => setCourseInfo({...courseInfo, title: e.target.value})} />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label className="form-label">DESCRIPTION</label>
                <textarea className="input-field" style={{ height: '150px' }} value={courseInfo.description} onChange={e => setCourseInfo({...courseInfo, description: e.target.value})} />
              </div>
              <div>
                <label className="form-label">PRICE (USD)</label>
                <input type="number" className="input-field" value={courseInfo.price} onChange={e => setCourseInfo({...courseInfo, price: e.target.value})} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h2>Curriculum</h2>
                <button className="btn-primary" onClick={addModule}>+ Add Module</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {modules.map((mod) => (
                  <div key={mod.id} className="stat-card" style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <input className="input-field" style={{ fontWeight: 800, border: 'none', background: 'transparent', fontSize: '1.2rem' }} value={mod.title} onChange={e => setModules(modules.map(m => m.id === mod.id ? {...m, title: e.target.value} : m))} />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-secondary" onClick={() => addLesson(mod.id)}>+ Lesson</button>
                        <button style={{ color: '#EF4444', background: 'transparent', border: 'none' }} onClick={() => deleteModule(mod.id, mod.isNew)}><FaTrash /></button>
                      </div>
                    </div>
                    {mod.lessons.map(lesson => (
                      <div key={lesson.id} style={{ background: 'var(--bg-main)', padding: '20px', borderRadius: '16px', marginBottom: '10px' }}>
                         <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ flex: 1 }}>
                               <input className="input-field" style={{ marginBottom: '10px' }} value={lesson.title} onChange={e => updateLesson(mod.id, lesson.id, "title", e.target.value)} />
                               {lesson.isNew && (
                                 <div style={{ display: 'flex', gap: '10px' }}>
                                    <select className="input-field" style={{ width: '150px' }} value={lesson.type} onChange={e => updateLesson(mod.id, lesson.id, "type", e.target.value)}>
                                       <option value="video">Video</option>
                                       <option value="text">Text</option>
                                    </select>
                                    {lesson.type === 'video' ? <input type="file" onChange={e => updateLesson(mod.id, lesson.id, "file", e.target.files[0])} /> : <textarea className="input-field" value={lesson.content} onChange={e => updateLesson(mod.id, lesson.id, "content", e.target.value)} />}
                                 </div>
                               )}
                            </div>
                            <button style={{ color: '#EF4444', background: 'transparent', border: 'none' }} onClick={() => deleteLesson(mod.id, lesson.id, lesson.isNew)}><FaTrash /></button>
                         </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h2>Assessments</h2>
                <button className="btn-primary" onClick={() => setQuizzes([...quizzes, { id: Date.now(), question: "", options: ["", "", "", ""], correct: 0 }])}>+ Add Question</button>
              </div>
              {quizzes.map((q, i) => (
                <div key={i} className="stat-card" style={{ padding: '30px', marginBottom: '20px' }}>
                   <input className="input-field" style={{ marginBottom: '20px' }} value={q.question} onChange={e => setQuizzes(quizzes.map((item, idx) => idx === i ? {...item, question: e.target.value} : item))} />
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                           <input type="radio" checked={q.correct === oIdx} onChange={() => setQuizzes(quizzes.map((item, idx) => idx === i ? {...item, correct: oIdx} : item))} />
                           <input className="input-field" value={opt} onChange={e => {
                             const newOpts = [...q.options];
                             newOpts[oIdx] = e.target.value;
                             setQuizzes(quizzes.map((item, idx) => idx === i ? {...item, options: newOpts} : item));
                           }} />
                        </div>
                      ))}
                   </div>
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="stat-card" style={{ padding: '60px', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
              <h2>Save All Changes?</h2>
              <p style={{ marginBottom: '40px', color: 'var(--text-muted)' }}>Review your curriculum and assessments. Once saved, the course will be updated for all enrolled students.</p>
              <button className="btn-primary" style={{ width: '100%', padding: '20px', fontSize: '1.2rem' }} onClick={handleUpdate} disabled={saving}>
                {saving ? "Saving Changes..." : <><FaSave /> Save & Finalize</>}
              </button>
            </div>
          )}
        </div>

        <div style={{
          position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
          width: 'calc(100% - 350px)', maxWidth: '1000px', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)',
          padding: '20px 40px', borderRadius: '100px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', zIndex: 1000
        }}>
          <button className="btn-secondary" disabled={step === 1} onClick={() => setStep(step - 1)}><FaArrowLeft /> Previous</button>
          <div style={{ fontWeight: 700 }}>Step {step} of 4</div>
          <button className="btn-primary" onClick={() => step < 4 ? setStep(step + 1) : handleUpdate()}>{step === 4 ? "Save" : "Next"}</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditCourse;
