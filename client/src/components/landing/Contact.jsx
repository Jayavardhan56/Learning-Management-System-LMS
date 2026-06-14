import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "../../styles/landing.css";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <section id="contact" className="section gray">
      <div className="container">
        <div style={{ textAlign: 'center', background: '#111827', padding: '100px 40px', borderRadius: '40px', color: 'white', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '24px', color: 'white' }}>
            Ready to <span style={{ color: '#3B82F6' }}>Elevate</span> Your <br/>Learning Experience?
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#9ca3af', maxWidth: '750px', margin: '0 auto 60px' }}>
            Join hundreds of institutions using SHNOOR LEARNING MANAGEMENT SYSTEM to deliver world-class training and certification.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button
              className="btn-primary"
              onClick={() => navigate("/register")}
              style={{ padding: '18px 48px', fontSize: '1.1rem' }}
            >
              Get Started Now <FaArrowRight />
            </button>
            <button
              className="btn-secondary"
              style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '18px 48px', fontSize: '1.1rem' }}
              onClick={() => navigate("/contact")}
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;