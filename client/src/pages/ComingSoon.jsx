import DashboardLayout from "../components/dashboard/DashboardLayout";
import { FaTools } from "react-icons/fa";

const ComingSoon = ({ title }) => {
  return (
    <DashboardLayout title={title || "Feature Coming Soon"}>
      <div style={{ textAlign: 'center', padding: '100px', background: 'white', borderRadius: '24px' }}>
        <div style={{ fontSize: '4rem', color: 'var(--secondary)', marginBottom: '20px' }}>
          <FaTools />
        </div>
        <h2>Under Development</h2>
        <p style={{ color: 'var(--text-muted)' }}>We are working hard to bring this feature to you. Stay tuned!</p>
      </div>
    </DashboardLayout>
  );
};

export default ComingSoon;
