import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  FaUsers, FaChartLine, FaClipboardCheck, FaArrowRight,
  FaCertificate, FaUniversity, FaUserGraduate, FaChartPie, FaInfoCircle, FaPlus, FaCheckSquare
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAuthToken, getAuthUser } from "../../utils/auth";
import "../../styles/ManagerDashboard.css";

const ManagerDashboard = () => {
  const user = getAuthUser();
  const [stats, setStats] = useState({
    students: 0,
    enrollments: 0,
    completionRate: 0,
    certificatesIssued: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = getAuthToken();
      const [studentsRes, statsRes] = await Promise.all([
        fetch("http://localhost:5000/api/courses/manager/students", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/auth/stats", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const studentsData = await studentsRes.json();
      const statsData = await statsRes.json();

      if (studentsRes.ok) {
        const managedStudents = Array.isArray(studentsData) ? studentsData : [];

        const totalEnrollments = managedStudents.reduce((acc, s) => acc + (Number(s.active_enrollments) || 0), 0);
        const totalCerts = managedStudents.reduce((acc, s) => acc + (Number(s.certificates_earned) || 0), 0);

        setStats({
          students: managedStudents.length,
          enrollments: totalEnrollments,
          completionRate: managedStudents.length > 0 ? Math.min(100, Math.round((totalCerts / (totalEnrollments || 1)) * 100)) : 0,
          certificatesIssued: totalCerts
        });
        setRecentActivity([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Manager Console">
      <div className="animate-fade-in md-analytics-overview">

        {}
        <div className="md-welcome-banner">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="md-org-badge">
              <FaUniversity /> {user.college_name || "AUTHORIZED ORGANIZATION"}
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '15px', letterSpacing: '-1px' }}>Organization Performance</h1>
            <p style={{ fontSize: '1.1rem', color: '#94A3B8', maxWidth: '600px' }}>Monitor student engagement, track academic milestones, and oversee excellence within your institution.</p>
          </div>
        </div>

        {}
        <div className="md-stats-grid">
           <StatCard
            icon={<FaUsers />}
            label="Managed Students"
            value={stats.students}
            color="#3B82F6"
            onClick={() => navigate("/manager/students")}
            sub="Active student registry"
           />
           <StatCard
            icon={<FaChartLine />}
            label="Avg. Completion"
            value={`${stats.completionRate}%`}
            color="#10B981"
            sub="Real-time progress"
           />
           <StatCard
            icon={<FaCertificate />}
            label="Certs Issued"
            value={stats.certificatesIssued}
            color="#F59E0B"
            sub="Verified achievements"
           />
        </div>

        {}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>

           <div className="md-record-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                 <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A' }}>Quick Management</h3>
                 <FaChartPie style={{ color: '#94A3B8' }} />
              </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                  <ActionCard icon={<FaUserGraduate />} label="Students" sub="Managed directory" onClick={() => navigate("/manager/students")} />
                  <ActionCard icon={<FaCheckSquare />} label="Approvals" sub="Pending enrollments" onClick={() => navigate("/manager/approve-enrollments")} />
                  <ActionCard icon={<FaCertificate />} label="Certs" sub="Verify requests" onClick={() => navigate("/manager/approve-certificates")} />
               </div>
              <button
                onClick={() => navigate("/manager/students")}
                style={{ width: '100%', marginTop: '30px', padding: '15px', borderRadius: '14px', background: 'none', border: '1px solid #E2E8F0', color: '#3B82F6', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                View Full Directory <FaArrowRight />
              </button>
           </div>

           <div className="md-record-card" style={{ background: '#0F172A', color: 'white', border: 'none' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '15px' }}>Institutional Insights</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '40px' }}>Dynamic data for {user.college_name || "your organization"}.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                 <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 800 }}>
                       <span>Overall Progress</span>
                       <span>{stats.completionRate}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                       <div style={{ width: `${Math.min(100, stats.completionRate)}%`, height: '100%', background: '#3B82F6', borderRadius: '10px' }}></div>
                    </div>
                 </div>
                 <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 800 }}>
                       <span>Assessment Mastery</span>
                       <span>0%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                       <div style={{ width: '0%', height: '100%', background: '#10B981', borderRadius: '10px' }}></div>
                    </div>
                 </div>
              </div>

              <div style={{ marginTop: '50px', padding: '30px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                 <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '10px' }}>Reports & Analytics</div>
                 <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '20px' }}>Comprehensive academic performance reports will appear here as students complete modules.</p>
                 <button className="btn-primary" style={{ padding: '12px 25px', borderRadius: '12px', fontSize: '0.85rem', opacity: 0.5, cursor: 'not-allowed' }}>Generate Report</button>
              </div>
           </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ icon, label, value, color, onClick, sub }) => (
  <div className="md-stat-card-premium" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <div className="md-stat-icon-circle" style={{ background: `${color}15`, color: color }}>
      {icon}
    </div>
    <div>
      <div className="md-stat-label">{label}</div>
      <div className="md-stat-value">{value}</div>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', marginTop: '4px' }}>{sub}</div>
    </div>
  </div>
);

const ActionCard = ({ icon, label, sub, onClick }) => (
  <div onClick={onClick} style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #E2E8F0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', transition: '0.3s' }} className="md-action-card">
    <div style={{ width: '45px', height: '45px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
      {icon}
    </div>
    <div>
      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>{label}</div>
      <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>{sub}</div>
    </div>
  </div>
);

export default ManagerDashboard;