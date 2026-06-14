import { FaRoute, FaGraduationCap, FaAward, FaCogs, FaRocket, FaCheckCircle } from "react-icons/fa";
import "../../styles/landing.css";

const HowItWorks = () => {
  const workflow = [
    {
      title: "Admin Control Center",
      icon: <FaCogs />,
      desc: "Centralized management for users, courses, and complex system configurations with master oversight."
    },
    {
      title: "Learning Delivery",
      icon: <FaRocket />,
      desc: "High-performance content delivery with real-time tracking and deep engagement analytics."
    },
    {
      title: "Certifications",
      icon: <FaCheckCircle />,
      desc: "Automated issuance of industry-standard certificates upon successful completion of curriculum."
    }
  ];

  return (
    <section id="methodology" className="section light">
      <div className="container">
        <h2>The Shnoor <span style={{ color: '#2563eb' }}>Engine</span></h2>
        <p className="section-desc">A robust, three-tiered infrastructure designed for seamless learning delivery and administrative control.</p>

        <div className="card-grid">
          {workflow.map((item, i) => (
            <div key={i} className="card">
              <div className="icon-circle">{item.icon}</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '15px' }}>{item.title}</h3>
              <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '80px', padding: '60px', background: '#f8fafc', borderRadius: '32px', border: '1px solid #e5e7eb' }}>
           <div className="card-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {[
                { icon: <FaRoute />, title: "Structured Journeys", desc: "Tailored paths for every career goal." },
                { icon: <FaGraduationCap />, title: "Digital Campus", desc: "Boundaryless institutional education." },
                { icon: <FaAward />, title: "Verified Skills", desc: "Rigorous testing & mastery validation." }
              ].map((item, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                   <div style={{ color: '#2563eb', fontSize: '2.5rem', marginBottom: '20px' }}>{item.icon}</div>
                   <h4 style={{ fontWeight: 800, marginBottom: '10px', fontSize: '1.1rem' }}>{item.title}</h4>
                   <p style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500 }}>{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;