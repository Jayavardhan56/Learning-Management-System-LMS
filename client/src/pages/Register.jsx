import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaArrowLeft, FaRocket, FaBookOpen, FaCertificate, FaUsers, FaUserGraduate, FaChalkboardTeacher, FaGoogle } from "react-icons/fa";

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ background: 'var(--bg-main)', minHeight: '100vh', transition: 'var(--transition)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '40px', right: '40px', zIndex: 100 }}>
        <button
          className="btn-secondary"
          onClick={() => navigate("/")}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '100px', fontSize: '0.9rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}
        >
          <FaArrowLeft /> Back to Home
        </button>
      </div>

      <div className="split-screen" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.2fr 1fr' }}>

        <div className="split-left" style={{ padding: '120px 100px 80px', background: 'var(--bg-main)', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {}
          <div style={{ position: 'absolute', top: '40px', left: '60px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" alt="SHNOOR" style={{ height: '35px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>SHNOOR</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '2px' }}>LEARNING MANAGEMENT SYSTEM</span>
            </div>
          </div>

          <div className="animate-fade-in">
            <div className="hero-badge" style={{ marginBottom: '32px', fontSize: '0.75rem', background: 'var(--glass)', color: 'var(--secondary)', border: '1px solid var(--glass-border)', width: 'fit-content' }}>
              JOIN OUR COMMUNITY
            </div>

            <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', marginBottom: '32px', textAlign: 'left', lineHeight: 1.1, color: 'var(--primary)', fontWeight: 800 }}>
              Start your learning journey with <span className="gradient-text">Shnoor LMS.</span>
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px', lineHeight: 1.6, maxWidth: '600px' }}>
              Create your account to access personalized courses, track your progress, and join a community of learners worldwide.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
              {[
                { icon: <FaBookOpen />, text: "100+ expert-led courses" },
                { icon: <FaCertificate />, text: "Earn certificates & credentials" },
                { icon: <FaUsers />, text: "10,000+ active learners" }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 24px', borderRadius: '100px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', width: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ color: 'var(--secondary)' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{item.text}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '24px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', gap: '20px', alignItems: 'center', maxWidth: '500px', boxShadow: 'var(--shadow-premium)' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '1.2rem' }}>
                <FaCertificate />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>SECURE REGISTRATION</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5, fontStyle: 'italic' }}>
                  "Joining SHNOOR was the best decision for my career growth. The platform is intuitive and powerful!"
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="split-right" style={{ padding: '100px 60px 60px', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--border-color)' }}>
          <div className="animate-fade-in" style={{ width: '100%', maxWidth: '480px' }}>
            <div className="hero-badge" style={{ marginBottom: '16px', fontSize: '0.75rem', background: 'var(--glass)', color: 'var(--secondary)', border: '1px solid var(--glass-border)' }}>GET STARTED</div>

            {step === 1 ? (
              <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px', color: 'var(--primary)' }}>Create your account</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Choose your account type to begin your journey.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  <div
                    onClick={() => setRole("student")}
                    style={{
                      padding: '24px', borderRadius: '24px', border: role === "student" ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
                      background: role === "student" ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-main)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '20px', transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ width: '56px', height: '56px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', fontSize: '1.5rem' }}>
                      <FaUserGraduate />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>Student Account</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Access courses, exams, and track your progress.</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setRole("instructor")}
                    style={{
                      padding: '24px', borderRadius: '24px', border: role === "instructor" ? '2px solid var(--secondary)' : '1px solid var(--border-color)',
                      background: role === "instructor" ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-main)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '20px', transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ width: '56px', height: '56px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', fontSize: '1.5rem' }}>
                      <FaChalkboardTeacher />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>Instructor Account</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Create and manage courses, assessments, and students.</p>
                    </div>
                  </div>
                </div>

                <button className="btn-primary" style={{ width: '100%', padding: '18px', borderRadius: '14px', fontSize: '1rem', fontWeight: 700 }} onClick={() => setStep(2)}>
                  Continue to Registration
                </button>

                <div style={{ margin: '32px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>or</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                </div>

                <button className="btn-secondary" style={{ width: '100%', padding: '16px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontWeight: 600, background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <FaGoogle /> Continue with Google
                </button>
              </div>
            ) : (
              <div>
                <div onClick={() => setStep(1)} style={{ cursor: 'pointer', color: 'var(--secondary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaArrowLeft /> Change Account Type
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px', color: 'var(--primary)' }}>Complete your profile</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>You are joining as a {role.charAt(0).toUpperCase() + role.slice(1)}.</p>

                <form onSubmit={handleRegister}>
                  {error && <div className="error-msg" style={{ marginBottom: '20px' }}>{error}</div>}
                  {msg && <div style={{ background: '#DCFCE7', color: '#16A34A', padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center' }}>{msg}</div>}

                  <div style={{ marginBottom: '20px' }}>
                    <label className="form-label">FULL NAME</label>
                    <div className="input-wrapper" style={{ position: 'relative' }}>
                      <FaUser style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        className="input-field"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        style={{ paddingLeft: '45px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--primary)' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label className="form-label">EMAIL ADDRESS</label>
                    <div className="input-wrapper" style={{ position: 'relative' }}>
                      <FaEnvelope style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="email"
                        className="input-field"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        style={{ paddingLeft: '45px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--primary)' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <label className="form-label">PASSWORD</label>
                    <div className="input-wrapper" style={{ position: 'relative' }}>
                      <FaLock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="password"
                        className="input-field"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                        style={{ paddingLeft: '45px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--primary)' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '18px', borderRadius: '14px', fontSize: '1.1rem', fontWeight: 700 }} disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>
              </div>
            )}

            <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Already have an account? <span onClick={() => navigate("/login")} style={{ color: 'var(--secondary)', fontWeight: 700, cursor: 'pointer' }}>Sign in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;