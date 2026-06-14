import { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaArrowLeft, FaCheckCircle, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/landing/Navbar";

const ContactPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', transition: 'var(--transition)' }}>
      <Navbar />

      <div className="container" style={{ paddingTop: '160px', paddingBottom: '100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '100px', alignItems: 'center', marginBottom: '100px' }}>
          <div>
            <div className="hero-badge" style={{ background: 'var(--glass)', color: 'var(--secondary)', border: '1px solid var(--glass-border)', marginBottom: '32px', width: 'fit-content' }}>CONTACT SHNOOR</div>
            <h1 className="hero-title" style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', marginBottom: '32px', lineHeight: 1.1, color: 'var(--primary)', fontWeight: 800 }}>
              Let's plan the right learning experience for your team.
            </h1>
            <p className="hero-desc" style={{ maxWidth: '650px', fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Reach out for enterprise training, private programs, certification pathways, or platform guidance. We are here to help you build a smarter workforce.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {[
              { title: "Sales and partnerships", desc: "Speak with us about enterprise training, private programs, and rollout plans." },
              { title: "Program guidance", desc: "Get support choosing the right learning journey for your workforce or audience." },
              { title: "Fast response", desc: "Reach out through email, phone, or WhatsApp and our team will follow up promptly." }
            ].map((item, i) => (
              <div key={i} className="card" style={{ padding: '40px', borderRadius: '32px', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-premium)', minHeight: '180px', justifyContent: 'center' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)', fontSize: '1.4rem' }}>
                  <FaCheckCircle />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--primary)' }}>{item.title}</h4>
                  <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: '0', background: 'var(--bg-card)', borderRadius: '48px', overflow: 'hidden', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)' }}>
          <div style={{ background: '#0F172A', padding: '80px 60px', color: 'white' }}>
            <div style={{ padding: '6px 16px', borderRadius: '100px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '32px', fontSize: '0.7rem', fontWeight: 700, width: 'fit-content', letterSpacing: '0.05em' }}>CONTACT INFO</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1.1 }}>Ready to upgrade your workforce?</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '48px', fontSize: '1.05rem', lineHeight: 1.6 }}>Speak with our team about platform access, training models, or a rollout approach that fits your organization.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '20px', background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'var(--secondary)', fontSize: '1.4rem' }}><FaEnvelope /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>info@shnoor.com <span style={{ opacity: 0.4, fontWeight: 400, fontSize: '0.8rem' }}>[General]</span></div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '6px' }}>proc@shnoor.com <span style={{ opacity: 0.4, fontWeight: 400, fontSize: '0.8rem' }}>[Sales]</span></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '20px', background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'var(--secondary)', fontSize: '1.4rem' }}><FaPhoneAlt /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>+91-9429694298</div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '6px' }}>+91-9041914601</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '20px', background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'var(--secondary)', fontSize: '1.4rem' }}><FaWhatsapp /></div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Message us on WhatsApp</div>
              </div>
              <div style={{ display: 'flex', gap: '20px', background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'var(--secondary)', fontSize: '1.4rem' }}><FaMapMarkerAlt /></div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.8)' }}>10009 Mount Tabor Road, City, Odessa Missouri, United States</div>
              </div>
            </div>
          </div>

          <div style={{ padding: '80px', background: 'var(--bg-card)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: '6rem', color: 'var(--accent)', marginBottom: '32px' }}><FaCheckCircle /></div>
                <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--primary)' }}>Message Received!</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '20px', fontSize: '1.2rem' }}>Our team will get back to you within 24 hours.</p>
                <button className="btn-primary" style={{ marginTop: '48px', padding: '18px 48px', fontSize: '1.1rem' }} onClick={() => navigate("/")}>Back to Home</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ padding: '6px 16px', borderRadius: '100px', background: 'var(--bg-main)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', marginBottom: '24px', fontSize: '0.7rem', fontWeight: 700, width: 'fit-content', letterSpacing: '0.05em' }}>SEND A MESSAGE</div>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '56px', color: 'var(--primary)', lineHeight: 1.2 }}>Tell us what you need and we'll help you move forward.</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>FIRST NAME</label>
                    <input type="text" className="input-field" placeholder="John" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--primary)', padding: '16px 20px', borderRadius: '14px', width: '100%' }} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>LAST NAME</label>
                    <input type="text" className="input-field" placeholder="Doe" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--primary)', padding: '16px 20px', borderRadius: '14px', width: '100%' }} required />
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>WORK EMAIL</label>
                  <input type="email" className="input-field" placeholder="john@example.com" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--primary)', padding: '16px 20px', borderRadius: '14px', width: '100%' }} required />
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>SUBJECT</label>
                  <input type="text" className="input-field" placeholder="How can we help you?" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--primary)', padding: '16px 20px', borderRadius: '14px', width: '100%' }} required />
                </div>

                <div style={{ marginBottom: '56px' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>MESSAGE</label>
                  <textarea className="input-field" style={{ height: '180px', resize: 'none', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--primary)', padding: '20px', borderRadius: '16px', width: '100%' }} placeholder="Tell us about your requirements..." required></textarea>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '22px', background: '#0F172A', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>
                  SEND MESSAGE <FaChevronRight />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
