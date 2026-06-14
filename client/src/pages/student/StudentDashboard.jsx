import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  FaSearch, FaBookOpen, FaStar, FaArrowRight, FaFilter,
  FaCalendarAlt, FaUserCircle, FaChevronDown
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../utils/auth";
import "../../styles/Courses.css";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("My Learning");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/courses/my-courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCourses(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Student Portal">
      <div className="animate-fade-in" style={{ padding: "30px", background: "#f8fafc", minHeight: "100vh" }}>

        {}
        <div style={{ background: "#0f172a", borderRadius: "20px", padding: "40px", marginBottom: "30px", position: "relative", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ maxWidth: "40%" }}>
             <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "10px" }}>Course Library</h1>
             <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: "1.5" }}>
               Discover and manage your learning journey. Choose from a curated selection of expert-led courses.
             </p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "14px", padding: "6px", display: "flex", alignItems: "center" }}>
             {["My Learning", "Explore", "Free", "Paid", "For You", "Upcoming"].map((tab) => (
               <button
                 key={tab}
                 onClick={() => {
                   setActiveTab(tab);
                   if (tab === "Explore") navigate('/student/courses');
                 }}
                 style={{
                   background: activeTab === tab ? "#4f46e5" : "transparent",
                   color: activeTab === tab ? "white" : "#94a3b8",
                   border: "none", padding: "10px 20px", borderRadius: "10px",
                   fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
                   display: "flex", alignItems: "center", gap: "8px",
                   transition: "0.3s"
                 }}
               >
                 {tab === "My Learning" && <FaBookOpen />}
                 {tab === "Explore" && <FaBookOpen />}
                 {tab === "Free" && <FaStar />}
                 {tab === "Paid" && <FaArrowRight />}
                 {tab === "For You" && <FaFilter />}
                 {tab === "Upcoming" && <FaCalendarAlt />}
                 {tab}
               </button>
             ))}
          </div>
        </div>

        {}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "15px", marginBottom: "30px" }}>
           <div style={{ position: "relative" }}>
              <FaSearch style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input type="text" placeholder="Search by title, instructor or category..." style={{ width: "100%", padding: "16px 16px 16px 45px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "0.95rem", outline: "none", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} />
           </div>
           <div style={{ background: "white", padding: "16px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, color: "#475569", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
              <input type="checkbox" style={{ width: "18px", height: "18px", cursor: "pointer" }} /> Free Only
           </div>
           <div style={{ background: "white", padding: "16px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "20px", fontWeight: 700, color: "#475569", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
              <FaFilter style={{ color: "#94a3b8" }} /> All Categories
           </div>
           <div style={{ background: "white", padding: "16px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "20px", fontWeight: 700, color: "#475569", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
              All Levels <FaChevronDown style={{ color: "#94a3b8" }} />
           </div>
        </div>

        {}
        {loading ? (
          <div style={{ textAlign: "center", padding: "100px", color: "#64748b", fontWeight: 600 }}>Loading your courses...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
            {courses.map(course => (
              <div key={course.id} style={{ background: "white", borderRadius: "24px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>

                {}
                <div style={{ height: "200px", background: "#f8fafc", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <div style={{ position: "absolute", top: "15px", left: "15px", display: "flex", gap: "10px" }}>
                      <span style={{ background: "white", padding: "6px 12px", borderRadius: "8px", fontSize: "0.7rem", fontWeight: 900, color: "#0f172a", textTransform: "uppercase", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>{course.category || "General"}</span>
                      <span style={{ background: "#0f172a", padding: "6px 12px", borderRadius: "8px", fontSize: "0.7rem", fontWeight: 900, color: "white", textTransform: "uppercase", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>{course.level || "BEGINNER"}</span>
                   </div>

                   <FaBookOpen style={{ fontSize: "5rem", color: "#e2e8f0" }} />

                   <div style={{ position: "absolute", bottom: "15px", right: "15px" }}>
                      <span style={{ background: "#10b981", color: "white", padding: "6px 16px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 900, textTransform: "uppercase", boxShadow: "0 2px 4px rgba(16,185,129,0.3)" }}>FREE</span>
                   </div>
                </div>

                {}
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
                   <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", marginBottom: "15px" }}>{course.title}</h3>
                   <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "0.85rem", fontWeight: 700, marginBottom: "25px" }}>
                      <FaUserCircle style={{ fontSize: "1.1rem" }} /> Provided by <span style={{ color: "#3b82f6" }}>{course.instructor_name || "Instructor"}</span>
                   </div>

                   <button
                     onClick={() => navigate(`/student/course/${course.id}/learn`)}
                     style={{ width: "100%", background: "#0f172a", color: "white", border: "none", padding: "16px", borderRadius: "14px", fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "pointer", transition: "0.3s", marginBottom: "20px" }}
                   >
                     Resume Learning <FaArrowRight />
                   </button>

                   <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "20px", display: "flex", justifyContent: "center", color: "#f59e0b", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", gap: "8px" }}>
                      <FaStar /> Rate Course
                   </div>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "100px", color: "#94a3b8", fontWeight: 600 }}>
                You haven't enrolled in any courses yet.
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;