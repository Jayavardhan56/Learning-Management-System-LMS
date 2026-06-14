import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { getAuthToken } from "../../utils/auth";
import { FaUserGraduate, FaBook, FaCheckCircle, FaExclamationTriangle, FaSearch, FaTimes, FaTrash } from "react-icons/fa";
import "../../styles/Management.css";

const AssignCourses = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [status, setStatus] = useState(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const token = getAuthToken();
    try {
      const [uRes, cRes] = await Promise.all([
        fetch("http://localhost:5000/api/auth/users", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/courses", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const [uData, cData] = await Promise.all([uRes.json(), cRes.json()]);

      setStudents(Array.isArray(uData) ? uData.filter(u => u.role === "student" && u.is_approved) : []);
      setCourses(Array.isArray(cData) ? cData : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      fetchEnrolledCourses();
    } else {
      setEnrolledCourses([]);
    }
  }, [selectedStudent]);

  const fetchEnrolledCourses = async () => {
    const token = getAuthToken();
    try {
      const res = await fetch(`http://localhost:5000/api/courses/user/${selectedStudent}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEnrolledCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCourse) return;

    if (enrolledCourses.some(c => c.id == selectedCourse)) {
      setStatus({ type: "error", message: "Student is already enrolled in this course." });
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/courses/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ studentId: selectedStudent, courseId: selectedCourse })
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "Course assigned successfully!" });
        setSelectedCourse("");
        fetchEnrolledCourses();
      } else {
        setStatus({ type: "error", message: data.message || "Failed to assign course." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!window.confirm("Are you sure you want to remove access to this course for the selected student?")) return;
    setActionLoading(courseId);
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/courses/unenroll", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ studentId: selectedStudent, courseId }),
      });
      if (res.ok) {
        fetchEnrolledCourses();
        setStatus({ type: "success", message: "Course access removed." });
      } else {
         setStatus({ type: "error", message: "Failed to remove course access." });
      }
    } catch (err) { console.error(err); }
    finally { setActionLoading(null); }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.college_name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <DashboardLayout title="Assign Courses">
      <div className="animate-fade-in" style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>

        <div style={{ background: "white", borderRadius: "16px", padding: "30px", border: "1px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "25px", color: "#0F172A", display: "flex", alignItems: "center", gap: "10px" }}>
            <FaBook style={{ color: "#3B82F6" }} /> Course Assignment Portal
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
            {}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#64748B", marginBottom: "8px" }}>1. SELECT STUDENT</label>
              <div style={{ position: "relative", marginBottom: "10px" }}>
                <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  type="text" placeholder="Search students..."
                  value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)}
                  style={{ width: "100%", padding: "12px 12px 12px 35px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "0.9rem" }}
                />
              </div>
              <div style={{ height: "250px", overflowY: "auto", border: "1px solid #E2E8F0", borderRadius: "8px", background: "#F8FAFC" }}>
                {filteredStudents.map(s => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStudent(s.id)}
                    style={{
                      padding: "12px 15px",
                      borderBottom: "1px solid #E2E8F0",
                      cursor: "pointer",
                      background: selectedStudent === s.id ? "#EFF6FF" : "transparent",
                      borderLeft: selectedStudent === s.id ? "3px solid #3B82F6" : "3px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: selectedStudent === s.id ? "#3B82F6" : "#CBD5E1", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                       {s.name.charAt(0)}
                    </div>
                    <div>
                       <div style={{ fontWeight: 700, color: selectedStudent === s.id ? "#1D4ED8" : "#334155", fontSize: "0.95rem" }}>{s.name}</div>
                       <div style={{ fontSize: "0.75rem", color: "#64748B" }}>{s.college_name}</div>
                    </div>
                  </div>
                ))}
                {filteredStudents.length === 0 && <div style={{ padding: "20px", textAlign: "center", color: "#94A3B8", fontSize: "0.9rem" }}>No students found</div>}
              </div>
            </div>

            {}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#64748B", marginBottom: "8px" }}>2. SELECT COURSE</label>
              <div style={{ position: "relative", marginBottom: "10px" }}>
                <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  type="text" placeholder="Search courses..."
                  value={courseSearch} onChange={(e) => setCourseSearch(e.target.value)}
                  style={{ width: "100%", padding: "12px 12px 12px 35px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "0.9rem" }}
                  disabled={!selectedStudent}
                />
              </div>
              <div style={{ height: "250px", overflowY: "auto", border: "1px solid #E2E8F0", borderRadius: "8px", background: !selectedStudent ? "#F1F5F9" : "#F8FAFC", opacity: !selectedStudent ? 0.6 : 1 }}>
                {!selectedStudent ? (
                  <div style={{ padding: "40px 20px", textAlign: "center", color: "#94A3B8", fontSize: "0.9rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                     <FaUserGraduate style={{ fontSize: "2rem", opacity: 0.5 }} />
                     Please select a student first
                  </div>
                ) : (
                  <>
                    {filteredCourses.map(c => {
                      const isEnrolled = enrolledCourses.some(ec => ec.id === c.id);
                      return (
                        <div
                          key={c.id}
                          onClick={() => !isEnrolled && setSelectedCourse(c.id)}
                          style={{
                            padding: "12px 15px",
                            borderBottom: "1px solid #E2E8F0",
                            cursor: isEnrolled ? "not-allowed" : "pointer",
                            background: isEnrolled ? "#F1F5F9" : (selectedCourse === c.id ? "#EFF6FF" : "transparent"),
                            borderLeft: selectedCourse === c.id ? "3px solid #3B82F6" : "3px solid transparent",
                            opacity: isEnrolled ? 0.6 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          <div>
                             <div style={{ fontWeight: 700, color: selectedCourse === c.id ? "#1D4ED8" : "#334155", fontSize: "0.95rem" }}>{c.title}</div>
                             <div style={{ fontSize: "0.75rem", color: "#64748B" }}>{c.category || "General"}</div>
                          </div>
                          {isEnrolled && <span style={{ background: "#E2E8F0", color: "#64748B", fontSize: "0.7rem", padding: "4px 8px", borderRadius: "20px", fontWeight: 700 }}>Enrolled</span>}
                          {selectedCourse === c.id && !isEnrolled && <FaCheckCircle style={{ color: "#3B82F6" }} />}
                        </div>
                      );
                    })}
                    {filteredCourses.length === 0 && <div style={{ padding: "20px", textAlign: "center", color: "#94A3B8", fontSize: "0.9rem" }}>No courses found</div>}
                  </>
                )}
              </div>
            </div>
          </div>

          {status && (
            <div style={{ marginTop: "20px", padding: "15px", borderRadius: "10px", background: status.type === "success" ? "#ECFDF5" : "#FEF2F2", color: status.type === "success" ? "#059669" : "#DC2626", fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "10px" }}>
              {status.type === "success" ? <FaCheckCircle /> : <FaExclamationTriangle />}
              {status.message}
            </div>
          )}

          <div style={{ marginTop: "25px", display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleAssign}
              disabled={loading || !selectedStudent || !selectedCourse}
              className="btn-primary"
              style={{ padding: "12px 30px", fontSize: "1rem", opacity: (!selectedStudent || !selectedCourse) ? 0.5 : 1, cursor: (!selectedStudent || !selectedCourse) ? "not-allowed" : "pointer" }}
            >
              {loading ? "Assigning..." : "Confirm Assignment"}
            </button>
          </div>
        </div>

        {selectedStudent && (
           <div className="mg-table-card animate-fade-in" style={{ marginTop: '30px' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0' }}>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Active Course Access</h3>
                 <p style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '5px' }}>Manage and remove assigned courses for the selected student.</p>
              </div>
              <table className="mg-user-table">
                 <thead>
                    <tr>
                       <th>Course Title</th>
                       <th>Status</th>
                       <th>Progress</th>
                       <th>Action</th>
                    </tr>
                 </thead>
                 <tbody>
                    {enrolledCourses.map(course => (
                       <tr key={course.id}>
                          <td style={{ fontWeight: 800, color: '#0F172A' }}>{course.title}</td>
                          <td>
                             <span className={`mg-role-pill mg-role-student`} style={{ background: course.enrollment_status === 'active' ? '#DCFCE7' : '#FEF3C7', color: course.enrollment_status === 'active' ? '#166534' : '#92400E' }}>
                               {(course.enrollment_status || 'pending').toUpperCase()}
                             </span>
                          </td>
                          <td style={{ fontWeight: 700, color: '#6366f1' }}>{course.progress || 0}%</td>
                          <td>
                             <button
                               onClick={() => handleUnenroll(course.id)}
                               disabled={actionLoading === course.id}
                               className="mg-action-btn"
                               style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                               title="Remove Access"
                             >
                               <FaTrash />
                             </button>
                          </td>
                       </tr>
                    ))}
                    {enrolledCourses.length === 0 && (
                       <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>No active courses found for this student.</td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AssignCourses;

