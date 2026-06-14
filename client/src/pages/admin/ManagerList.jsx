import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaUserTie, FaEnvelope, FaBuilding, FaPhone } from "react-icons/fa";
import { getAuthToken } from "../../utils/auth";

const ManagerList = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setManagers(data.filter(u => u.role === 'manager'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Manager Directory">
      <div className="analytics-overview">
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Assigned Managers</h2>
          <p style={{ color: 'var(--text-muted)' }}>Overview of all regional and organizational managers.</p>
        </div>

        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {managers.map((manager) => (
            <div key={manager.id} className="stat-card" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ width: '70px', height: '70px', background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--secondary)' }}>
                  <FaUserTie />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{manager.name}</h3>
                  <div style={{ color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 700 }}>CERTIFIED MANAGER</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <FaEnvelope /> {manager.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <FaBuilding /> {manager.college_name || "Enterprise Partner"}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <FaPhone /> {manager.phone || "No phone provided"}
                </div>
              </div>
            </div>
          ))}
          {managers.length === 0 && !loading && (
            <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '100px', background: 'white', borderRadius: '24px' }}>
              No managers found in the system.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerList;
