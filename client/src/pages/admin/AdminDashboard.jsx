import { useState, useEffect } from "react";
import {
  FaUsers, FaChalkboardTeacher, FaCheckSquare, FaBookOpen,
  FaPlus, FaCheckCircle, FaLaptopMedical, FaSync, FaCertificate,
  FaArrowRight, FaUserShield, FaChartBar, FaInfoCircle
} from "react-icons/fa";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../utils/auth";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    instructors: 0,
    managers: 0,
    pending_users: 0,
    total_courses: 0,
    pending_courses: 0,
    total_enrollments: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/auth/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Admin Console">
      <div className="animate-fade-in ad-analytics-overview">

        {}
        <div className="ad-welcome-banner">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <FaUserShield style={{ color: '#3B82F6' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#3B82F6', letterSpacing: '2px' }}>ADMINISTRATIVE PORTAL</span>
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '15px', letterSpacing: '-1px' }}>Platform Master Control</h1>
            <p style={{ fontSize: '1.1rem', color: '#94A3B8', maxWidth: '600px' }}>Monitor system health, manage global user accounts, and oversee platform-wide academic excellence in real-time.</p>
          </div>
          <button onClick={fetchStats} className="btn-primary" style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <FaSync className={loading ? 'fa-spin' : ''} style={{ fontSize: '1.5rem' }} />
          </button>
        </div>

        {}
        <div className="ad-stats-grid">
          <StatCard
            icon={<FaCheckSquare />}
            label="Pending Users"
            value={stats.pending_users}
            color="#EF4444"
            onClick={() => navigate("/admin/approve-users")}
            trend="Needs Review"
          />
          <StatCard
            icon={<FaUsers />}
            label="Total Students"
            value={stats.students}
            color="#3B82F6"
            trend="Active Registry"
          />
          <StatCard
            icon={<FaChalkboardTeacher />}
            label="Verified Instructors"
            value={stats.instructors}
            color="#8B5CF6"
            trend="Academic Board"
          />
          <StatCard
            icon={<FaBookOpen />}
            label="Active Courses"
            value={stats.total_courses}
            color="#10B981"
            trend="Live Content"
          />
        </div>

        {}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '30px', marginTop: '40px' }}>

          <div>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '25px' }}>Quick Management Actions</h2>
             <div className="ad-quick-actions-grid">
                <ActionCard icon={<FaPlus />} label="Add Instructor" sub="Provision new credentials" onClick={() => navigate("/admin/add-instructor")} />
                <ActionCard icon={<FaPlus />} label="Add Manager" sub="Assign organizational oversight" onClick={() => navigate("/admin/add-manager")} />
                <ActionCard icon={<FaPlus />} label="Add Student" sub="Manual account creation" onClick={() => navigate("/admin/add-student")} />
                <ActionCard icon={<FaLaptopMedical />} label="Manage Users" sub="System-wide directory" onClick={() => navigate("/admin/manage-users")} />
                <ActionCard icon={<FaBookOpen />} label="Assign Courses" sub="Enroll students in programs" onClick={() => navigate("/admin/assign-courses")} />
                <ActionCard icon={<FaCheckSquare />} label="Enrollments" sub="Approve pending requests" onClick={() => navigate("/admin/approve-enrollments")} />
                <ActionCard icon={<FaCertificate />} label="Certificates" sub="Pending validation requests" onClick={() => navigate("/admin/approve-certificates")} />
                <ActionCard icon={<FaSync />} label="Update Requests" sub="Profile/Password changes" onClick={() => navigate("/admin/approve-updates")} />
                <ActionCard icon={<FaChartBar />} label="Reports" sub="Export institutional analytics" onClick={() => {}} />
             </div>
          </div>

          <div>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '25px' }}>System Integrity</h2>
             <div style={{ background: 'white', borderRadius: '32px', padding: '35px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 800, color: '#475569' }}>Server Health</div>
                      <div style={{ color: '#10B981', fontWeight: 800, fontSize: '0.85rem', padding: '5px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '100px' }}>OPERATIONAL</div>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 800, color: '#475569' }}>Database Sync</div>
                      <div style={{ color: '#10B981', fontWeight: 800, fontSize: '0.85rem', padding: '5px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '100px' }}>ACTIVE</div>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 800, color: '#475569' }}>Course Pipeline</div>
                      <div style={{ color: '#3B82F6', fontWeight: 800, fontSize: '0.85rem', padding: '5px 12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '100px' }}>{stats.pending_courses} PENDING</div>
                   </div>
                </div>

                <div style={{ marginTop: '40px', padding: '25px', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                   {stats.pending_courses > 0 ? (
                     <>
                        <h4 style={{ fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>Pending Approvals</h4>
                        <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>{stats.pending_courses} new course submissions are awaiting administrative review.</p>
                        <button
                         onClick={() => navigate("/admin/approve-courses")}
                         style={{ marginTop: '15px', background: 'none', border: 'none', color: '#3B82F6', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          Review Now <FaArrowRight />
                        </button>
                     </>
                   ) : (
                     <div style={{ textAlign: 'center', color: '#94A3B8', padding: '10px' }}>
                        <FaCheckCircle style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#10B981' }} />
                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Platform Up to Date</div>
                     </div>
                   )}
                </div>
             </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ icon, label, value, color, onClick, trend }) => (
  <div className="ad-stat-card-premium" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
      <div className="ad-stat-icon-box" style={{ background: `${color}15`, color: color }}>
        {icon}
      </div>
      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: color, padding: '5px 12px', background: `${color}10`, borderRadius: '100px' }}>
        {trend}
      </div>
    </div>
    <div>
      <div className="ad-stat-label">{label}</div>
      <div className="ad-stat-value">{value}</div>
    </div>
  </div>
);

const ActionCard = ({ icon, label, sub, onClick }) => (
  <div className="ad-action-card" onClick={onClick}>
    <div className="ad-action-icon">{icon}</div>
    <div>
      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>{label}</div>
      <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>{sub}</div>
    </div>
  </div>
);

export default AdminDashboard;