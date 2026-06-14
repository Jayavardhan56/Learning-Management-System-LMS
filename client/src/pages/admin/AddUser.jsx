import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  FaUserPlus, FaEnvelope, FaBuilding, FaPhone, FaUserTag, FaCheckCircle,
  FaArrowLeft, FaLock, FaFileCsv, FaUpload, FaSpinner, FaIdCard, FaQuoteLeft
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAuthToken, getAuthUser } from "../../utils/auth";
import "../../styles/Management.css";

const AddUser = ({ role }) => {
  const navigate = useNavigate();
  const currentUser = getAuthUser();
  const [activeTab, setActiveTab] = useState("manual");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college_name: currentUser.role === 'manager' ? (currentUser.college_name || "") : "",
    phone: "",
    bio: ""
  });

  const [bulkFile, setBulkFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });
    const token = getAuthToken();
    try {
      const res = await fetch("http://localhost:5000/api/auth/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, role })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: `Account created successfully! ${currentUser.role === 'manager' ? "Awaiting admin approval." : "Welcome email sent."}` });
        setFormData({
          name: "", email: "", password: "",
          college_name: currentUser.role === 'manager' ? (currentUser.college_name || "") : "",
          phone: "", bio: ""
        });
      } else {
        setStatus({ type: "error", message: data.message || "Could not create account." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return;
    setLoading(true);
    const token = getAuthToken();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split("\n").slice(1);
      const users = rows.filter(r => r.trim()).map(row => {
        const [name, email, password, phone] = row.split(",");
        return { name: name.trim(), email: email.trim(), password: password.trim(), phone: phone?.trim(), role };
      });

      try {
        const res = await fetch("http://localhost:5000/api/auth/bulk-create", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ users })
        });
        if (res.ok) {
          setStatus({ type: "success", message: `Bulk upload successful! ${users.length} users added to the pipeline.` });
          setBulkFile(null);
        }
      } catch (err) { setStatus({ type: "error", message: "Bulk upload failed." }); }
      finally { setLoading(false); }
    };
    reader.readAsText(bulkFile);
  };

  return (
    <DashboardLayout title={`Add ${role}`}>
      <div className="animate-fade-in mg-container">

        <div className="mg-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '12px', borderRadius: '14px' }}><FaArrowLeft /></button>
            <div>
               <h2 className="mg-title-h2">Create {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
               <p className="mg-subtitle">Onboard new platform members to the {currentUser.college_name || "LMS"} ecosystem.</p>
            </div>
          </div>
          <div style={{ display: 'flex', background: '#F1F5F9', padding: '5px', borderRadius: '100px' }}>
             <button onClick={() => setActiveTab("manual")} style={{ border: 'none', background: activeTab === 'manual' ? 'white' : 'none', color: activeTab === 'manual' ? '#0F172A' : '#64748B', borderRadius: '100px', padding: '10px 25px', fontWeight: 800, cursor: 'pointer', transition: '0.3s' }}>Manual Entry</button>
             <button onClick={() => setActiveTab("bulk")} style={{ border: 'none', background: activeTab === 'bulk' ? 'white' : 'none', color: activeTab === 'bulk' ? '#0F172A' : '#64748B', borderRadius: '100px', padding: '10px 25px', fontWeight: 800, cursor: 'pointer', transition: '0.3s' }}>Bulk Upload</button>
          </div>
        </div>

        {status.message && (
          <div style={{ padding: '20px 30px', borderRadius: '20px', marginBottom: '30px', background: status.type === 'success' ? '#D1FAE5' : '#FEE2E2', color: status.type === 'success' ? '#065F46' : '#991B1B', fontWeight: 700, border: '1px solid currentColor', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <FaCheckCircle /> {status.message}
          </div>
        )}

        {activeTab === 'manual' ? (
          <div className="mg-table-card" style={{ padding: '50px', maxWidth: '1000px' }}>
            <form onSubmit={handleSubmit} autoComplete="off">
              {}
              <input type="text" style={{ display: 'none' }} />
              <input type="password" style={{ display: 'none' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                 <div>
                    <label className="form-label" style={{ fontWeight: 800, color: '#475569', marginBottom: '10px', display: 'block' }}>FULL NAME</label>
                    <div style={{ position: 'relative' }}>
                       <FaIdCard style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                       <input className="input-field" style={{ paddingLeft: '45px' }} placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                 </div>
                 <div>
                    <label className="form-label" style={{ fontWeight: 800, color: '#475569', marginBottom: '10px', display: 'block' }}>EMAIL ADDRESS</label>
                    <div style={{ position: 'relative' }}>
                       <FaEnvelope style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                       <input className="input-field" style={{ paddingLeft: '45px' }} type="email" placeholder="email@shnoor.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required autoComplete="new-off" />
                    </div>
                 </div>
                 <div>
                    <label className="form-label" style={{ fontWeight: 800, color: '#475569', marginBottom: '10px', display: 'block' }}>TEMPORARY PASSWORD</label>
                    <div style={{ position: 'relative' }}>
                       <FaLock style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                       <input className="input-field" style={{ paddingLeft: '45px' }} type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required autoComplete="new-password" />
                    </div>
                 </div>
                 <div>
                    <label className="form-label" style={{ fontWeight: 800, color: '#475569', marginBottom: '10px', display: 'block' }}>PHONE NUMBER</label>
                    <div style={{ position: 'relative' }}>
                       <FaPhone style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                       <input className="input-field" style={{ paddingLeft: '45px' }} placeholder="+91 00000 00000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                 </div>
              </div>

              {role !== 'manager' && (
              <div style={{ marginBottom: '40px' }}>
                 <label className="form-label" style={{ fontWeight: 800, color: '#475569', marginBottom: '10px', display: 'block' }}>ASSIGNED ORGANIZATION</label>
                 <div style={{ position: 'relative' }}>
                    <FaBuilding style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input className="input-field" style={{ paddingLeft: '45px' }} value={formData.college_name || currentUser.college_name || ""} onChange={e => setFormData({...formData, college_name: e.target.value})} disabled={currentUser.role === 'manager'} placeholder="Enter institution name" />
                 </div>
              </div>
              )}

              <div style={{ marginBottom: '50px' }}>
                 <label className="form-label" style={{ fontWeight: 800, color: '#475569', marginBottom: '10px', display: 'block' }}>PROFESSIONAL BIOGRAPHY / NOTES</label>
                 <div style={{ position: 'relative' }}>
                    <FaQuoteLeft style={{ position: 'absolute', left: '15px', top: '20px', color: '#94A3B8' }} />
                    <textarea
                      className="input-field"
                      style={{ paddingLeft: '45px', height: '120px', paddingTop: '15px', resize: 'none' }}
                      placeholder="Enter a brief bio or administrative notes..."
                      value={formData.bio}
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                    ></textarea>
                 </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '20px', borderRadius: '18px', fontSize: '1.1rem', fontWeight: 800 }} disabled={loading}>
                 {loading ? <><FaSpinner className="animate-spin" /> Provisioning Account...</> : `Confirm & Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account`}
              </button>
            </form>
          </div>
        ) : (
          <div className="mg-table-card" style={{ maxWidth: '700px', padding: '80px 60px', textAlign: 'center' }}>
             <div style={{ width: '100px', height: '100px', background: '#F0FDF4', color: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 30px' }}>
                <FaFileCsv />
             </div>
             <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '10px' }}>Bulk Integration</h3>
             <p style={{ color: '#64748B', fontWeight: 600, marginBottom: '40px' }}>Upload a CSV file containing: <code style={{ color: '#3B82F6', background: '#EFF6FF', padding: '4px 8px', borderRadius: '6px' }}>name, email, password, phone</code></p>

             <div style={{ border: '2px dashed #E2E8F0', borderRadius: '24px', padding: '40px', marginBottom: '30px', position: 'relative' }}>
                <input type="file" accept=".csv" onChange={e => setBulkFile(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                <FaUpload style={{ fontSize: '2rem', color: '#94A3B8', marginBottom: '15px' }} />
                <div style={{ fontWeight: 800, color: '#0F172A' }}>{bulkFile ? bulkFile.name : "Click or drag CSV file here"}</div>
                <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '5px' }}>Maximum file size: 5MB</div>
             </div>

             <button onClick={handleBulkUpload} className="btn-primary" style={{ width: '100%', padding: '18px', borderRadius: '18px', fontSize: '1.1rem' }} disabled={!bulkFile || loading}>
               {loading ? <><FaSpinner className="animate-spin" /> Processing Data...</> : "Start Bulk Import"}
             </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AddUser;
