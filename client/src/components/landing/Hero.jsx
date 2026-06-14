import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaRocket } from "react-icons/fa";
import "../../styles/landing.css";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero container">
      <div className="hero-content">
        <div style={{ background: '#eff6ff', color: '#2563eb', padding: '8px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <FaRocket /> INNOVATING GLOBAL EDUCATION
        </div>
        <h1>
          Empowering Minds <br />
          <span style={{ color: '#2563eb' }}>Through Learning</span>
        </h1>
        <p>
          SHNOOR LEARNING MANAGEMENT SYSTEM provides a comprehensive, scalable, and intuitive platform designed to bridge the gap between teaching and transformation.
        </p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
          <button onClick={() => navigate("/register")} className="btn-primary">
            Get Started Now <FaArrowRight />
          </button>
          <button onClick={() => navigate("/login")} className="btn-secondary">
            Sign In to Portal
          </button>
        </div>
      </div>

      <div className="hero-image">
        <div className="hero-graphic" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <img src="/logo.png" alt="SHNOOR" style={{ width: '60%', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(37, 99, 235, 0.1))' }} />
        </div>
      </div>
    </section>
  );
};

export default Hero;