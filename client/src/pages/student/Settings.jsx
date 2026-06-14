import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaUser, FaLock, FaBell, FaPalette, FaShieldAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { getAuthUser, getAuthToken } from "../../utils/auth";

const Settings = () => {
  const user = getAuthUser();
  const [activeTab, setActiveTab] = useState("Profile");
  const [newName, setNewName] = useState(user.name);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "Profile", icon: <FaUser /> },
    { id: "Security", icon: <FaLock /> }
  ];

  const handleRequest = async (field, value) => {
    if (!value || value === user.name) return;
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/auth/update-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ field_name: field, new_value: value })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message });
        if (field === 'password') setNewPassword("");
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (err) { setMessage({ type: 'error', text: "Request failed" }); }
    finally { setLoading(false); }
  };

  return (
    <DashboardLayout title="Account Settings">
      <div className="animate-fade-in" style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>

        {message && (
          <div style={{
            maxWidth: "1000px", margin: "0 auto 20px", padding: "15px 25px", borderRadius: "12px",
            background: message.type === 'success' ? "#F0FDF4" : "#FEF2F2",
            color: message.type === 'success' ? "#10B981" : "#EF4444",
            display: "flex", alignItems: "center", gap: "12px", fontWeight: 700, border: "1px solid"
          }}>
            {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
            {message.text}
          </div>
        )}

        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "250px 1fr", gap: "40px" }}>

           <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px", padding: "15px 20px",
                    borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: 700,
                    background: activeTab === tab.id ? "#3B82F6" : "white",
                    color: activeTab === tab.id ? "white" : "#475569",
                    boxShadow: activeTab === tab.id ? "0 4px 12px rgba(59, 130, 246, 0.3)" : "none",
                    transition: "0.3s"
                  }}
                >
                  {tab.icon} {tab.id}
                </button>
              ))}
           </div>

           <div style={{ background: "white", padding: "40px", borderRadius: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0F172A", marginBottom: "30px" }}>{activeTab} Settings</h2>

              {activeTab === "Profile" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                   <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#64748B", marginBottom: "8px" }}>FULL NAME</label>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0", background: "#F8FAFC" }}
                      />
                      <p style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "5px" }}>Changing your name requires Admin approval.</p>
                   </div>
                   <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#64748B", marginBottom: "8px" }}>EMAIL ADDRESS</label>
                      <input type="email" defaultValue={user.email} disabled style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0", background: "#F1F5F9", cursor: "not-allowed" }} />
                   </div>
                   <button
                     onClick={() => handleRequest('name', newName)}
                     disabled={loading || newName === user.name}
                     className="btn-primary"
                     style={{ alignSelf: "flex-start", padding: "12px 30px", borderRadius: "10px" }}
                   >
                     Request Name Change
                   </button>
                </div>
              )}

              {activeTab === "Security" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                   <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#64748B", marginBottom: "8px" }}>NEW PASSWORD</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0", background: "#F8FAFC" }}
                      />
                      <p style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "5px" }}>Password resets are subject to security review.</p>
                   </div>
                   <button
                     onClick={() => handleRequest('password', newPassword)}
                     disabled={loading || !newPassword}
                     className="btn-primary"
                     style={{ alignSelf: "flex-start", padding: "12px 30px", borderRadius: "10px" }}
                   >
                     Request Password Reset
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
