import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaTrophy, FaCalendarAlt, FaStar, FaUserCircle, FaClock, FaCheckCircle, FaRocket } from "react-icons/fa";
import { getAuthToken } from "../../utils/auth";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const WeeklyContests = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContest, setSelectedContest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = getAuthToken();
      const [lbRes, ctRes] = await Promise.all([
        fetch("http://localhost:5000/api/auth/leaderboard", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/courses/contests", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const lbData = await lbRes.json();
      const ctData = await ctRes.json();
      if (lbRes.ok) setLeaderboard(lbData);
      if (ctRes.ok) setContests(ctData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleFinishContest = async () => {
    let correctCount = 0;
    selectedContest.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correctCount++;
    });

    const xpEarned = correctCount * 100;

    try {
      const token = getAuthToken();
      await fetch("http://localhost:5000/api/courses/contests/xp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ xp: xpEarned })
      });
      setScore(xpEarned);
      setShowModal(false);
      fetchData();
    } catch (err) { console.error(err); }
  };

  return (
    <DashboardLayout title="Weekly Contests & Leaderboard">
      <div style={{ padding: "30px", background: "#f8fafc", minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 350px", gap: "30px" }}>

        {}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>

           {}
           <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", borderRadius: "24px", padding: "40px", color: "white", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "relative", zIndex: 1 }}>
                 <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "15px" }}>Weekly Coding Challenge</h1>
                 <p style={{ color: "#94A3B8", maxWidth: "500px", marginBottom: "25px" }}>Compete with the best minds and win exclusive SHNOOR rewards and XP points.</p>
                 <div style={{ display: "flex", gap: "15px" }}>
                    {contests.filter(c => new Date(c.start_time) <= new Date() && new Date(c.end_time) >= new Date()).map(c => (
                       <button
                         key={c.id}
                         onClick={() => { setSelectedContest(c); setShowModal(true); }}
                         style={{ padding: "12px 30px", borderRadius: "10px", background: "#3B82F6", color: "white", border: "none", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
                       >
                         <FaRocket /> Join: {c.title}
                       </button>
                    ))}
                 </div>
              </div>
              <FaTrophy style={{ position: "absolute", right: "40px", bottom: "-20px", fontSize: "12rem", color: "rgba(255,255,255,0.05)" }} />
           </div>

           {}
           <div style={{ background: "white", borderRadius: "24px", padding: "30px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "25px", color: "#0F172A" }}>Global Rankings</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                 {leaderboard.map((student, i) => (
                   <div key={student.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 20px", background: i < 3 ? "#F8FAFC" : "transparent", borderRadius: "16px", border: "1px solid #F1F5F9" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                         <span style={{ fontWeight: 900, color: i === 0 ? "#F59E0B" : i === 1 ? "#94A3B8" : i === 2 ? "#B45309" : "#CBD5E1", width: "25px" }}>#{i+1}</span>
                         <FaUserCircle style={{ fontSize: "2.5rem", color: "#E2E8F0" }} />
                         <div>
                            <div style={{ fontWeight: 800, color: "#1E293B" }}>{student.name}</div>
                            <div style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: 600 }}>{student.college_name}</div>
                         </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                         <div style={{ fontWeight: 900, color: "#3B82F6", fontSize: "1.1rem" }}>{student.xp} XP</div>
                         <div style={{ fontSize: "0.65rem", color: "#10B981", fontWeight: 800 }}>RANKED {i+1}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
           <div style={{ background: "white", borderRadius: "24px", padding: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                 <FaCalendarAlt color="#3B82F6" /> Contest Schedule
              </h3>
              <Calendar className="custom-calendar" />
           </div>

           <div style={{ background: "white", borderRadius: "24px", padding: "25px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "20px" }}>Upcoming Events</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                 {contests.filter(c => new Date(c.start_time) > new Date()).map(c => (
                   <div key={c.id} style={{ display: "flex", gap: "12px" }}>
                      <div style={{ background: "#EFF6FF", color: "#3B82F6", padding: "10px", borderRadius: "10px", textAlign: "center", minWidth: "55px" }}>
                         <div style={{ fontSize: "0.6rem", fontWeight: 800 }}>{new Date(c.start_time).toLocaleString('en-US', { month: 'short' }).toUpperCase()}</div>
                         <div style={{ fontSize: "1.1rem", fontWeight: 900 }}>{new Date(c.start_time).getDate()}</div>
                      </div>
                      <div>
                         <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#1E293B" }}>{c.title}</div>
                         <div style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600 }}>{c.category} • {new Date(c.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {}
        {showModal && selectedContest && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
             <div style={{ background: "white", width: "100%", maxWidth: "600px", borderRadius: "30px", padding: "40px", maxHeight: "90vh", overflow: "auto" }}>
                <h2 style={{ marginBottom: "10px", fontWeight: 900 }}>{selectedContest.title}</h2>
                <p style={{ color: "#64748B", marginBottom: "30px", fontWeight: 600 }}>Category: {selectedContest.category}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                   {selectedContest.questions.map((q, idx) => (
                     <div key={idx}>
                        <div style={{ fontWeight: 700, marginBottom: "12px", color: "#1E293B" }}>{idx+1}. {q.q}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                           {q.a.map((opt, i) => (
                             <button
                               key={i}
                               onClick={() => setAnswers({...answers, [idx]: i})}
                               style={{
                                 padding: "15px", borderRadius: "12px", border: "1px solid #E2E8F0",
                                 background: answers[idx] === i ? "#EFF6FF" : "white",
                                 borderColor: answers[idx] === i ? "#3B82F6" : "#E2E8F0",
                                 cursor: "pointer", textAlign: "left", fontSize: "0.85rem", fontWeight: 600,
                                 transition: "0.2s"
                               }}
                             >
                               {opt}
                             </button>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
                <div style={{ marginTop: "40px", display: "flex", justifyContent: "flex-end", gap: "15px" }}>
                   <button onClick={() => setShowModal(false)} style={{ padding: "12px 25px", borderRadius: "10px", border: "none", background: "#F1F5F9", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                   <button onClick={handleFinishContest} style={{ padding: "12px 25px", borderRadius: "10px", border: "none", background: "#3B82F6", color: "white", fontWeight: 800, cursor: "pointer" }}>Submit Answers</button>
                </div>
             </div>
          </div>
        )}

        {score !== null && (
          <div style={{ position: "fixed", bottom: "30px", right: "30px", background: "white", padding: "20px 30px", borderRadius: "16px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "15px", zIndex: 1001 }} className="animate-fade-in">
             <FaCheckCircle color="#10B981" fontSize="1.5rem" />
             <div>
                <div style={{ fontWeight: 800 }}>Contest Complete!</div>
                <div style={{ fontSize: "0.85rem", color: "#64748B" }}>You earned {score} XP points. Rankings updated!</div>
             </div>
             <button onClick={() => setScore(null)} style={{ border: "none", background: "none", padding: "5px", cursor: "pointer" }}>×</button>
          </div>
        )}

      </div>

      <style>{`
        .react-calendar { width: 100% !important; border: none !important; font-family: 'Inter', sans-serif !important; }
        .react-calendar__tile--active { background: #3B82F6 !important; border-radius: 8px !important; }
        .react-calendar__navigation button { font-weight: 800 !important; font-size: 1rem !important; }
      `}</style>
    </DashboardLayout>
  );
};

export default WeeklyContests;
