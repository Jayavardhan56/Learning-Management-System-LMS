import { FaRocket, FaShieldAlt, FaChartBar, FaGlobe } from "react-icons/fa";
import "../../styles/landing.css";

const Features = () => {
  const features = [
    {
      icon: <FaRocket />,
      title: "Rapid Deployment",
      desc: "Accelerate professional growth with curated learning paths designed for modern industry demands."
    },
    {
      icon: <FaShieldAlt />,
      title: "Verified Certs",
      desc: "Gain industry-recognized credentials backed by SHNOOR's rigorous validation process."
    },
    {
      icon: <FaChartBar />,
      title: "Deep Analytics",
      desc: "Track every milestone with deep-dive metrics. Managers get full visibility into team progress."
    },
    {
      icon: <FaGlobe />,
      title: "Global Mesh",
      desc: "Learn from anywhere, at any time. Our platform ensures a seamless experience worldwide."
    }
  ];

  return (
    <section className="section gray" id="features">
      <div className="container">
        <h2>Built for <span style={{ color: '#2563eb' }}>Excellence</span></h2>
        <p className="section-desc">Advanced tools and features designed to provide a comprehensive learning ecosystem.</p>

        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              <div className="icon-circle" style={{ minWidth: '70px', marginBottom: 0 }}>
                {f.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;