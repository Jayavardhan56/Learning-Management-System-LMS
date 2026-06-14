import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import "../../styles/landing.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo-container" onClick={() => navigate("/")} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/logo.png" alt="SHNOOR" style={{ height: '40px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>SHNOOR</span>
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#2563eb', letterSpacing: '1px' }}>LEARNING MANAGEMENT SYSTEM</span>
        </div>
      </div>

      <ul className="nav-links">
        {["Home", "Methodology", "Features", "Training", "Contact"].map((name) => (
          <li key={name}>
            <Link to={name.toLowerCase().replace(/ /g, "-")} smooth={true} duration={500} style={{ cursor: 'pointer' }} offset={-120}>
              {name}
            </Link>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={() => navigate("/login")} style={{ background: 'none', border: 'none', color: '#6b7280', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}>Log In</button>
        <button className="btn-primary" style={{ padding: '10px 24px', borderRadius: '40px', fontSize: '0.85rem' }} onClick={() => navigate("/register")}>Get Started</button>
      </div>
    </nav>
  );
};

export default Navbar;