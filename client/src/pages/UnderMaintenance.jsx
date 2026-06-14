import DashboardLayout from "../components/dashboard/DashboardLayout";
import { FaTools, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UnderMaintenance = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="System Status">
      <div className="animate-fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '40px'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          background: '#EFF6FF',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#3B82F6',
          fontSize: '3.5rem',
          marginBottom: '30px',
          border: '1px solid #E2E8F0'
        }}>
          <FaTools />
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '15px' }}>
          Under Maintenance
        </h1>

        <p style={{ fontSize: '1.1rem', color: '#64748B', maxWidth: '500px', marginBottom: '40px', fontWeight: 600 }}>
          This module is currently being optimized to provide a more professional learning experience. Please check back later.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 40px' }}
        >
          <FaArrowLeft /> Go Back to Dashboard
        </button>
      </div>
    </DashboardLayout>
  );
};

export default UnderMaintenance;
