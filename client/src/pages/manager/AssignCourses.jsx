import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaBook, FaArrowLeft, FaCheckCircle, FaUserGraduate, FaSpinner, FaExclamationCircle, FaSearch } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuthToken, getAuthUser } from "../../utils/auth";

const AssignCourses = () => {
  const { state } = useLocation();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(state?.studentId || "");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEnrollments, setFetchingEnrollments] = useState(false);
  const [success, setSuccess] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const navigate = useNavigate();
  const user = getAuthUser();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedCourse("");
    if (selectedStudent) fetchEnrolledCourses();
    else setEnrolledIds([]);
  }, [selectedStudent]);

  const fetchData = async () => {
    try {
      const token = getAuthToken();
      const [userRes, courseRes] = await Promise.all([
        fetch("http://localhost:5000/api/auth/users", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/courses", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const userData = await userRes.json();
      const courseData = await courseRes.json();
      if (userRes.ok && Array.isArray(userData)) {
        const managedStudents = userData.filter(u =>
          u.role === 'student' && u.is_approved &&
          (u.managed_by === user.id || u.college_name === user.college_name)
        );
        setStudents(managedStudents);
      }
      if (courseRes.ok && Array.isArray(courseData)) {
        setCourses(courseData.filter(c => c.is_approved));
      }
    } catch (err) { console.error(err); }
  };

  const fetchEnrolledCourses = async () => {
    setFetchingEnrollments(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`http://localhost:5000/api/courses/user/${selectedStudent}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setEnrolledIds(data.map(c => c.id));
      }
    } catch (err) { console.error(err); }
    finally { setFetchingEnrollments(false); }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCourse) return;
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/courses/assign", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent, courseId: selectedCourse })
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/manager"), 2000);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const availableCourses = courses.filter(c => !enrolledIds.includes(c.id));
  const filteredCourses = availableCourses.filter(c =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <DashboardLayout title="Enrollment Tool">
      <div className="analytics-overview animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '10px', borderRadius: '12px' }}><FaArrowLeft /></button>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Student Course Assignment</h2>
            <p style={{ color: 'var(--text-muted)' }}>Manage curriculum access for your organizational team.</p>
          </div>
        </div>

        <div className="stat-card" style={{ padding: '40px', borderRadius: '40px' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <FaCheckCircle style={{ fontSize: '5rem', color: 'var(--accent)', marginBottom: '25px' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Enrolled Successfully!</h2>
              <p style={{ color: 'var(--text-muted)' }}>Redirecting you back to the directory...</p>
            </div>
          ) : (
            <form onSubmit={handleAssign}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                <div>
                   <label className="form-label"><FaUserGraduate /> SELECT STUDENT</label>
                   <div style={{ position: 'relative', marginBottom: '10px' }}>
                      <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                      <input
                        type="text" placeholder="Search name/email..."
                        value={studentSearch} onChange={e => setStudentSearch(e.target.value)}
                        style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                      />
                   </div>
                   <select className="input-field" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} size="6" required>
                     <option value="">Choose a student...</option>
                     {filteredStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
                   </select>
                </div>

                <div>
                   <label className="form-label"><FaBook /> TARGET COURSE</label>
                   <div style={{ position: 'relative', marginBottom: '10px' }}>
                      <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                      <input
                        type="text" placeholder="Search course title..."
                        value={courseSearch} onChange={e => setCourseSearch(e.target.value)}
                        style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '12px', border: '1px solid #E2E8F0' }}
                        disabled={!selectedStudent}
                      />
                   </div>
                   <select className="input-field" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} size="6" required disabled={fetchingEnrollments || !selectedStudent}>
                     <option value="">{fetchingEnrollments ? "Fetching availability..." : "Select a course..."}</option>
                     {filteredCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                   </select>
                </div>
              </div>

              {selectedStudent && availableCourses.length === 0 && !fetchingEnrollments && (
                 <div style={{ marginBottom: '25px', color: '#ef4444', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                   <FaExclamationCircle /> This student is already enrolled in all active courses.
                 </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '20px', borderRadius: '100px', fontSize: '1.2rem', boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)' }} disabled={loading || fetchingEnrollments || filteredCourses.length === 0}>
                {loading ? "Processing Enrollment..." : "Confirm Assignment"}
              </button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssignCourses;

