import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAuthToken, getAuthUser } from "../../utils/auth";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FaDownload, FaShareAlt } from "react-icons/fa";
import "../../styles/Certificate.css";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Certificate = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [certId, setCertId] = useState("");
  const user = getAuthUser();

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const token = getAuthToken();
      const [courseRes, certRes] = await Promise.all([
        fetch(`http://localhost:5000/api/courses/${courseId}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`http://localhost:5000/api/courses/certificate-requests`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const courseData = await courseRes.json();
      const certData = await certRes.json();

      if (courseRes.ok) {
        setCourse(courseData);

        const baseTimestamp = Date.now().toString(36).toUpperCase();
        const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        setCertId(`C${courseData.id}U${user.id}-${baseTimestamp}-${randPart}`);
      }

      if (certRes.ok && Array.isArray(certData)) {
        const myReq = certData.find(r => r.course_id == courseId);
        if (!myReq || myReq.status !== 'approved') {
          alert("Your certificate is pending admin approval.");
          window.location.href = "/student";
        }
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const certElement = document.getElementById("certificate-node");
      const canvas = await html2canvas(certElement, { scale: 3, useCORS: true, allowTaint: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SHNOOR_Certificate_${user.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error("Error generating PDF", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <DashboardLayout title="Certificate"><div style={{ padding: '100px', textAlign: 'center' }}>Loading Credentials...</div></DashboardLayout>;
  if (!course) return <DashboardLayout title="Certificate"><div style={{ padding: '100px', textAlign: 'center' }}>Certificate data not found.</div></DashboardLayout>;

  return (
    <DashboardLayout title="Certificate of Achievement">
      <div className="ct-cert-container">

        <div id="certificate-node" className="ct-cert-paper">
           <div className="ct-cert-blue-border">
              <div className="ct-cert-inner-content">

                 <div className="ct-cert-header-meta">
                    <div className="ct-cert-id-badge">
                       <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=SHNOOR-CERT-${course.id}-${user.id}`} alt="QR" className="ct-cert-qr-top" />
                       <div style={{ marginTop: '5px' }}>ID: {certId}</div>
                    </div>
                 </div>

                 <div style={{ marginTop: '20px' }}>
                    <img src="/logo.png" alt="SHNOOR" className="ct-cert-logo-main" />
                 </div>

                 <h1 className="ct-cert-title-primary">CERTIFICATE OF ACHIEVEMENT</h1>
                 <p className="ct-cert-sub-text">This is to certify that</p>

                 <h2 className="ct-cert-recipient-name">{user.name}</h2>

                 <p className="ct-cert-body-text">has successfully completed the training program with</p>
                 <h3 className="ct-cert-course-name">SHNOOR LMS</h3>

                 <div className="ct-cert-issue-date">Issued on: {new Date().toLocaleDateString('en-GB')}</div>

                 <div className="ct-cert-footer-layout" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="ct-cert-footer-right">
                       <div className="ct-cert-signature-line">
                          <div className="ct-cert-mock-signature">{course.instructor_name || 'Admin Coordinator'}</div>
                          <div className="ct-cert-auth-title">AUTHORIZED SIGNATURE</div>
                          <div className="ct-cert-dir-info">{course.instructor_name ? 'Course Instructor' : 'Director of Shnoor'}</div>
                       </div>
                    </div>
                 </div>

              </div>
           </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px', marginBottom: '30px' }} className="no-print">
           <button onClick={handleDownload} disabled={downloading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 30px', cursor: downloading ? 'wait' : 'pointer' }}>
              <FaDownload /> {downloading ? 'Processing...' : 'Download PDF'}
           </button>
           <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 30px' }}>
              <FaShareAlt /> Share
           </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Certificate;

