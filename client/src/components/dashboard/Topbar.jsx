import { useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch, FaBell, FaUserCircle, FaSignOutAlt,
  FaTrophy, FaStar, FaAward, FaFire, FaBars
} from "react-icons/fa";
import { logout } from "../../utils/auth";

const Topbar = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSession = () => {
    const path = location.pathname;
    if (path.startsWith('/admin')) return JSON.parse(localStorage.getItem('user_admin') || localStorage.getItem('user') || '{}');
    if (path.startsWith('/manager')) return JSON.parse(localStorage.getItem('user_manager') || localStorage.getItem('user') || '{}');
    if (path.startsWith('/instructor')) return JSON.parse(localStorage.getItem('user_instructor') || localStorage.getItem('user') || '{}');
    if (path.startsWith('/student')) return JSON.parse(localStorage.getItem('user_student') || localStorage.getItem('user') || '{}');
    return JSON.parse(localStorage.getItem('user') || '{}');
  };

  const user = getSession();

  const getRank = (xp) => {
    if (xp >= 1500) return "Expert";
    if (xp >= 500) return "Professional";
    return "Novice";
  };

  return (
    <header className="topbar" style={{ background: '#F8FAFC', border: 'none', height: '80px', padding: '0 30px' }}>
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <FaBars style={{ fontSize: '1.2rem', color: '#94A3B8', cursor: 'pointer' }} />
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E293B' }}>{title || "Dashboard"}</h2>
      </div>

      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="search-bar" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <FaSearch style={{ position: 'absolute', left: '16px', color: '#94A3B8', fontSize: '0.9rem' }} />
          <input
            type="text"
            placeholder="Search projects, courses..."
            className="input-field"
            style={{
              paddingLeft: '45px',
              width: '300px',
              height: '45px',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              background: 'white',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div style={{ position: 'relative', cursor: 'pointer', background: 'white', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FaBell style={{ fontSize: '1.1rem', color: '#64748B' }} />
          <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%', border: '2px solid white' }}></span>
        </div>

        {user.role === 'student' && (
          <>
            <div style={{
              background: 'white',
              border: '1px solid #E2E8F0',
              padding: '8px 15px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
               <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8' }}>RANK</span>
               <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>{getRank(user.xp || 0)}</span>
               <FaTrophy style={{ color: user.xp >= 1500 ? '#F59E0B' : user.xp >= 500 ? '#8B5CF6' : '#94A3B8', fontSize: '0.9rem' }} />
            </div>

            <div style={{
              background: 'white',
              border: '1px solid #E2E8F0',
              padding: '8px 15px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
               <FaStar style={{ color: '#F59E0B', fontSize: '0.9rem' }} />
               <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>{user.xp || 0} XP</span>
            </div>
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '10px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>{user.name || "Abhishek"}</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>{user.role}</div>
          </div>
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Abhishek"
            alt="User"
            style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F1F5F9' }}
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;