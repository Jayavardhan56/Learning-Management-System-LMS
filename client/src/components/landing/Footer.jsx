import { FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram, FaEnvelope, FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import "../../styles/landing.css";

const Footer = () => {
  return (
    <footer style={{ background: '#020617', color: 'rgba(255, 255, 255, 0.5)', padding: '120px 0 60px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: '80px', marginBottom: '100px' }}>
          {}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px' }}>
              <img src="/logo.png" alt="SHNOOR" style={{ height: '45px', filter: 'brightness(0) invert(1)' }} />
              <div>
                <div style={{ color: 'white', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '1px' }}>SHNOOR</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#3B82F6', letterSpacing: '2px' }}>LEARNING MANAGEMENT SYSTEM</div>
              </div>
            </div>
            <p style={{ lineHeight: 1.8, marginBottom: '40px', maxWidth: '400px', fontSize: '1rem' }}>
              Transforming the global educational landscape with a next-generation ecosystem built for intelligence, security, and verified skill mastery.
            </p>
            <div style={{ display: 'flex', gap: '25px', fontSize: '1.4rem' }}>
              <FaTwitter style={{ cursor: 'pointer', transition: '0.3s' }} className="nav-hover" />
              <FaFacebookF style={{ cursor: 'pointer', transition: '0.3s' }} className="nav-hover" />
              <FaLinkedinIn style={{ cursor: 'pointer', transition: '0.3s' }} className="nav-hover" />
              <FaInstagram style={{ cursor: 'pointer', transition: '0.3s' }} className="nav-hover" />
            </div>
          </div>

          {}
          <div>
            <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 900, marginBottom: '35px' }}>Infrastructure</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px', listStyle: 'none' }}>
              {["Platform Home", "Our Methodology", "Feature Matrix", "Training Formats", "Global Contact"].map(link => (
                <li key={link} style={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }} className="nav-hover">{link}</li>
              ))}
            </ul>
          </div>

          {}
          <div className="glass-card" style={{ padding: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 900, marginBottom: '30px' }}>Global Headquarters</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '25px', listStyle: 'none' }}>
              <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <FaEnvelope style={{ marginTop: '5px', color: '#3B82F6' }} />
                <div>
                   <div style={{ color: 'white', fontWeight: 700 }}>General Inquiries</div>
                   <div style={{ fontSize: '0.9rem' }}>info@shnoor.com</div>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <FaPhoneAlt style={{ marginTop: '5px', color: '#3B82F6' }} />
                <div>
                   <div style={{ color: 'white', fontWeight: 700 }}>Direct Line</div>
                   <div style={{ fontSize: '0.9rem' }}>+91-9429694298</div>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <FaMapMarkerAlt style={{ marginTop: '5px', color: '#3B82F6' }} />
                <div style={{ lineHeight: 1.6, fontSize: '0.9rem' }}>
                  10009 Mount Tabor Road<br />
                  Odessa Missouri, United States
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
          <div>© 2026 SHNOOR INTERNATIONAL LLC. ARCHITECTED FOR EXCELLENCE.</div>
          <div style={{ display: 'flex', gap: '40px' }}>
            <span style={{ cursor: 'pointer' }} className="nav-hover">Privacy Protocol</span>
            <span style={{ cursor: 'pointer' }} className="nav-hover">Legal Terms</span>
            <span style={{ cursor: 'pointer' }} className="nav-hover">Security Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;