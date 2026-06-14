import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaSync, FaCheck, FaTimes, FaUser, FaLock } from "react-icons/fa";
import { getAuthToken } from "../../utils/auth";

const ApproveUpdates = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/auth/pending-updates", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setRequests(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAction = async (requestId, status) => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/auth/approve-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, status })
      });
      if (res.ok) fetchRequests();
    } catch (err) { console.error(err); }
  };

  return (
    <DashboardLayout title="System Update Requests">
      <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>

        <div style={{ background: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
           <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                 <tr style={{ background: "#F8FAFC", textAlign: "left", borderBottom: "1px solid #E2E8F0" }}>
                    <th style={{ padding: "20px", fontWeight: 800 }}>User</th>
                    <th style={{ padding: "20px", fontWeight: 800 }}>Field</th>
                    <th style={{ padding: "20px", fontWeight: 800 }}>Current Value</th>
                    <th style={{ padding: "20px", fontWeight: 800 }}>New Value</th>
                    <th style={{ padding: "20px", fontWeight: 800 }}>Date</th>
                    <th style={{ padding: "20px", fontWeight: 800 }}>Action</th>
                 </tr>
              </thead>
              <tbody>
                 {requests.map(req => (
                   <tr key={req.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "20px" }}>
                         <div style={{ fontWeight: 700 }}>{req.current_name}</div>
                         <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{req.email}</div>
                      </td>
                      <td style={{ padding: "20px" }}>
                         <span style={{
                            background: req.field_name === 'password' ? "#FEF2F2" : "#EFF6FF",
                            color: req.field_name === 'password' ? "#EF4444" : "#3B82F6",
                            padding: "4px 10px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 800,
                            display: "flex", alignItems: "center", gap: "5px", width: "fit-content"
                         }}>
                            {req.field_name === 'password' ? <FaLock /> : <FaUser />}
                            {req.field_name.toUpperCase()}
                         </span>
                      </td>
                      <td style={{ padding: "20px", color: "#64748B", fontSize: "0.9rem" }}>
                         {req.field_name === 'password' ? "********" : req.current_name}
                      </td>
                      <td style={{ padding: "20px", color: "#0F172A", fontWeight: 700, fontSize: "0.9rem" }}>
                         {req.field_name === 'password' ? "********" : req.new_value}
                      </td>
                      <td style={{ padding: "20px", fontSize: "0.8rem", color: "#94A3B8" }}>
                         {new Date(req.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "20px" }}>
                         <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => handleAction(req.id, 'approved')} style={{ background: "#10B981", color: "white", border: "none", width: "35px", height: "35px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                               <FaCheck />
                            </button>
                            <button onClick={() => handleAction(req.id, 'rejected')} style={{ background: "#EF4444", color: "white", border: "none", width: "35px", height: "35px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                               <FaTimes />
                            </button>
                         </div>
                      </td>
                   </tr>
                 ))}
                 {requests.length === 0 && !loading && (
                   <tr>
                      <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>No pending update requests.</td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ApproveUpdates;
