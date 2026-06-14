import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaUsers, FaUserPlus, FaComments } from "react-icons/fa";

const MyGroups = () => {
  return (
    <DashboardLayout title="My Groups">
      <div className="animate-fade-in" style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
           <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#0F172A" }}>Learning Communities</h1>
           <button className="btn-primary" style={{ padding: "12px 25px", borderRadius: "12px" }}><FaUserPlus /> Join New Group</button>
        </div>

        <div style={{ textAlign: "center", padding: "100px", background: "white", borderRadius: "30px", border: "2px dashed #E2E8F0" }}>
           <FaUsers style={{ fontSize: "4rem", color: "#E2E8F0", marginBottom: "20px" }} />
           <h2 style={{ fontSize: "1.5rem", color: "#64748B" }}>Social learning is coming soon!</h2>
           <p style={{ color: "#94A3B8" }}>You will be able to collaborate with peers in your organization here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyGroups;
