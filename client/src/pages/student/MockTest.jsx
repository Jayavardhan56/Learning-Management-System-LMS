import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaClipboardList, FaClock, FaArrowRight, FaCheckCircle, FaStar } from "react-icons/fa";
import { getAuthToken } from "../../utils/auth";

const MockTest = () => {
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const token = getAuthToken();

      const res = await fetch("http://localhost:5000/api/courses/mock-tests", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTests(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const startTest = (test) => {
    setActiveTest(test);
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
  };

  const handleAnswer = (optionIndex) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const submitTest = async () => {
    let score = 0;
    activeTest.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) score++;
    });
    setResults({ score, total: activeTest.questions.length });

    try {
      const token = getAuthToken();
      await fetch("http://localhost:5000/api/courses/mock-tests/save-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          testId: activeTest.id,
          score,
          total: activeTest.questions.length
        })
      });
    } catch (err) { console.error(err); }
  };

  if (loading) return <DashboardLayout title="Mock Test"><div style={{ padding: '100px', textAlign: 'center' }}>Loading Tests...</div></DashboardLayout>;

  return (
    <DashboardLayout title="Mock Test Arena">
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>

        {!activeTest ? (
          <>
            <div style={{ marginBottom: "40px" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#0F172A" }}>Global Mock Tests</h1>
              <p style={{ color: "#64748B" }}>Challenge yourself with industry-standard certification mocks.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
              {tests.map(test => (
                <div key={test.id} style={{ background: "white", padding: "30px", borderRadius: "24px", border: "1px solid #E2E8F0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                  <div style={{ width: "50px", height: "50px", background: "#EEF2FF", color: "#6366F1", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "20px" }}>
                    <FaClipboardList />
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: "10px" }}>{test.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "25px", color: "#64748B", fontSize: "0.85rem", fontWeight: 600 }}>
                    <span style={{ background: "#F1F5F9", padding: "4px 10px", borderRadius: "8px" }}>{test.category}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><FaClock /> 15 Mins</span>
                  </div>
                  <button
                    onClick={() => startTest(test)}
                    style={{ width: "100%", background: "#0F172A", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                  >
                    Start Now <FaArrowRight />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : results ? (
          <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", padding: "60px", background: "white", borderRadius: "30px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
             <FaCheckCircle style={{ fontSize: "5rem", color: "#10B981", marginBottom: "20px" }} />
             <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#0F172A", marginBottom: "10px" }}>Test Completed!</h1>
             <div style={{ fontSize: "1.5rem", color: "#64748B", marginBottom: "40px" }}>
                Your Score: <span style={{ color: "#3B82F6", fontWeight: 900 }}>{results.score}</span> / {results.total}
             </div>
             <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                <button onClick={() => setActiveTest(null)} style={{ padding: "14px 30px", borderRadius: "12px", background: "#0F172A", color: "white", border: "none", fontWeight: 800, cursor: "pointer" }}>Back to Arena</button>
                <button onClick={() => startTest(activeTest)} style={{ padding: "14px 30px", borderRadius: "12px", background: "#F1F5F9", color: "#0F172A", border: "none", fontWeight: 800, cursor: "pointer" }}>Retake Test</button>
             </div>
          </div>
        ) : (
          <div style={{ maxWidth: "800px", margin: "0 auto", background: "white", borderRadius: "30px", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
             <div style={{ padding: "25px 40px", background: "#0F172A", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                   <h2 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{activeTest.title}</h2>
                   <div style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Question {currentQuestion + 1} of {activeTest.questions.length}</div>
                </div>
                <button onClick={() => setActiveTest(null)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 15px", borderRadius: "8px", cursor: "pointer" }}>Quit</button>
             </div>
             <div style={{ padding: "60px 40px" }}>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B", marginBottom: "40px" }}>{activeTest.questions[currentQuestion].q}</h3>
                <div style={{ display: "grid", gap: "15px" }}>
                   {activeTest.questions[currentQuestion].a.map((opt, i) => (
                     <button
                       key={i}
                       onClick={() => handleAnswer(i)}
                       style={{
                         textAlign: "left", padding: "20px", borderRadius: "15px", border: "2px solid",
                         borderColor: answers[currentQuestion] === i ? "#3B82F6" : "#F1F5F9",
                         background: answers[currentQuestion] === i ? "#EFF6FF" : "white",
                         color: "#475569", fontWeight: 700, cursor: "pointer", transition: "0.2s"
                       }}
                     >
                       {opt}
                     </button>
                   ))}
                </div>
                <div style={{ marginTop: "50px", display: "flex", justifyContent: "space-between" }}>
                   <button
                     disabled={currentQuestion === 0}
                     onClick={() => setCurrentQuestion(currentQuestion - 1)}
                     style={{ padding: "12px 25px", borderRadius: "10px", border: "none", background: "#F1F5F9", fontWeight: 700, cursor: "pointer", opacity: currentQuestion === 0 ? 0.5 : 1 }}
                   >
                     Previous
                   </button>
                   {currentQuestion === activeTest.questions.length - 1 ? (
                     <button onClick={submitTest} style={{ padding: "12px 40px", borderRadius: "10px", border: "none", background: "#10B981", color: "white", fontWeight: 800, cursor: "pointer" }}>Submit Test</button>
                   ) : (
                     <button onClick={() => setCurrentQuestion(currentQuestion + 1)} style={{ padding: "12px 40px", borderRadius: "10px", border: "none", background: "#3B82F6", color: "white", fontWeight: 800, cursor: "pointer" }}>Next</button>
                   )}
                </div>
             </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default MockTest;
