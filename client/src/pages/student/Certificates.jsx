import { useState, useEffect } from "react";
import { FaAward, FaDownload, FaArrowRight, FaCertificate, FaSearch, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../utils/auth";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/courses/certificate-requests", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCertificates(Array.isArray(data) ? data.filter(r => r.status === 'approved') : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCerts = certificates.filter(c =>
    (c.course_title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Professional Credentials">
      <div className="animate-fade-in" style={{ padding: '30px' }}>

        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '24px',
          padding: '50px',
          color: 'white',
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}>
           <div style={{ position: 'relative', zIndex: 2 }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '15px' }}>Your Verified Achievements</h1>
              <p style={{ fontSize: '1.1rem', color: '#94A3B8', maxWidth: '600px' }}>
                Access and download your industry-recognized certificates of completion.
              </p>
           </div>
           <FaAward style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '15rem', color: 'white', opacity: 0.05 }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
           <div style={{ position: 'relative', width: '400px' }}>
              <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search certificates..."
                className="input-field"
                style={{ paddingLeft: '45px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div style={{ color: '#64748B', fontWeight: 700, fontSize: '0.9rem' }}>
              TOTAL CREDENTIALS: <span style={{ color: '#3B82F6' }}>{certificates.length}</span>
           </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px', color: '#64748B' }}>Validating your credentials...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
            {filteredCerts.map((cert) => (
              <div key={cert.id} style={{ background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '30px', transition: '0.3s' }}>
                <div style={{ width: '60px', height: '60px', background: '#F0FDF4', color: '#10B981', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', marginBottom: '25px' }}>
                  <FaCertificate />
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>{cert.course_title}</h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600, marginBottom: '25px' }}>
                  Issued on: {new Date(cert.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                <div style={{ display: 'flex', gap: '12px' }}>
                   <button
                     onClick={() => navigate(`/student/certificate/${cert.course_id}`)}
                     className="btn-primary"
                     style={{ flex: 1, padding: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                   >
                     View & Download <FaDownload />
                   </button>
                </div>
              </div>
            ))}

            {filteredCerts.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', background: 'white', borderRadius: '30px', border: '2px dashed #E2E8F0' }}>
                 <FaInfoCircle style={{ fontSize: '3rem', color: '#CBD5E1', marginBottom: '20px' }} />
                 <h3 style={{ fontWeight: 800, color: '#475569' }}>No certificates found</h3>
                 <p style={{ color: '#94A3B8', fontWeight: 600 }}>Complete your courses and pass assessments to earn professional certifications.</p>
                 <button onClick={() => navigate("/student/courses")} className="btn-primary" style={{ marginTop: '30px' }}>Explore Courses</button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentCertificates;
