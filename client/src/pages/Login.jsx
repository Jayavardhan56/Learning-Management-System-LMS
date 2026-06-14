import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaArrowLeft, FaGoogle, FaBookOpen, FaCertificate, FaUsers, FaShieldAlt } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(`token_${data.user.role}`, data.token);
        localStorage.setItem(`user_${data.user.role}`, JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "admin") navigate("/admin");
        else if (data.user.role === "instructor") navigate("/instructor");
        else if (data.user.role === "manager") navigate("/manager");
        else navigate("/student");
      } else {
        setError(data.message || "Login failed");
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
          <div style={{ position: 'absolute', top: '40px', left: '60px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" alt="SHNOOR" style={{ height: '35px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>SHNOOR</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '2px' }}>LEARNING MANAGEMENT SYSTEM</span>
            </div>
          </div>

          <div className="animate-fade-in">
            <div className="hero-badge" style={{ marginBottom: '32px', fontSize: '0.75rem', background: 'var(--glass)', color: 'var(--secondary)', border: '1px solid var(--glass-border)', width: 'fit-content' }}>
              ACCESS YOUR ACCOUNT
            </div>

            <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', marginBottom: '32px', textAlign: 'left', lineHeight: 1.1, color: 'var(--primary)', fontWeight: 800 }}>
              Welcome back to <span className="gradient-text">Shnoor LMS.</span>
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px', lineHeight: 1.6, maxWidth: '600px' }}>
              Resume your professional journey, track your latest certifications, and manage your curriculum with our high-performance dashboard.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
              {[
                { icon: <FaBookOpen />, text: "Personalized learning paths" },
                { icon: <FaCertificate />, text: "Real-time certification status" },
                { icon: <FaShieldAlt />, text: "Secure enterprise-grade access" }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 24px', borderRadius: '100px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', width: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
                  <span style={{ color: 'var(--secondary)' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{item.text}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '24px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', gap: '20px', alignItems: 'center', maxWidth: '500px', boxShadow: 'var(--shadow-premium)' }}>
              <div style={{ width: '48px', height: '48px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '1.2rem' }}>
                <FaUsers />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>ACTIVE LEARNERS</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700 }}>10,000+ Students Worldwide</p>
              </div>
            </div>
          </div>
        </div>

        <div className="split-right" style={{ padding: '100px 60px 60px', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--border-color)' }}>
          <div className="animate-fade-in" style={{ width: '100%', maxWidth: '440px' }}>
            <div className="hero-badge" style={{ marginBottom: '16px', fontSize: '0.75rem', background: 'var(--glass)', color: 'var(--secondary)', border: '1px solid var(--glass-border)' }}>SIGN IN</div>

            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px', color: 'var(--primary)' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Enter your credentials to access your professional workspace.</p>

            <form onSubmit={handleLogin}>
              {error && <div className="error-msg" style={{ marginBottom: '20px', padding: '12px', background: '#FEF2F2', color: '#EF4444', borderRadius: '10px', textAlign: 'center', fontWeight: 600 }}>{error}</div>}

              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">EMAIL ADDRESS</label>
                <div className="input-wrapper" style={{ position: 'relative' }}>
                  <FaEnvelope style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    className="input-field"
                    placeholder="name@shnoor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ paddingLeft: '45px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--primary)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">PASSWORD</label>
                <div className="input-wrapper" style={{ position: 'relative' }}>
                  <FaLock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingLeft: '45px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--primary)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', fontSize: '0.85rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 600 }}>
                  <input type="checkbox" style={{ accentColor: 'var(--secondary)', width: '16px', height: '16px' }} /> Remember me
                </label>
                <span style={{ color: 'var(--secondary)', fontWeight: 700, cursor: 'pointer' }}>Forgot password?</span>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '18px', borderRadius: '14px', fontSize: '1.1rem', fontWeight: 700 }} disabled={loading}>
                {loading ? "Authenticating..." : "Sign In"}
              </button>

              <div style={{ margin: '32px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
              </div>

              <button type="button" className="btn-secondary" style={{ width: '100%', padding: '16px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontWeight: 600, background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <FaGoogle /> Continue with Google
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              No account yet? <span onClick={() => navigate("/register")} style={{ color: 'var(--secondary)', fontWeight: 700, cursor: 'pointer' }}>Sign up for free</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;