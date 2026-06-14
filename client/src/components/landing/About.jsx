import "../../styles/landing.css";

const About = () => {
  const recognition = [
    { title: "NASSCOM Recognized", desc: "Proudly recognized for our innovative learning delivery models." },
    { title: "Industry Standard", desc: "Setting the global benchmark for corporate training and development." }
  ];

  return (
    <section className="section light" id="about">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '100px' }}>
          <div>
            <div style={{ background: '#eff6ff', color: '#2563eb', padding: '8px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '24px', display: 'inline-block' }}>
              OUR VISION
            </div>
            <h2 style={{ textAlign: 'left', fontSize: '3.5rem', marginBottom: '24px' }}>
              Redefining <span style={{ color: '#2563eb' }}>Institutional</span> Learning
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '40px', lineHeight: 1.6 }}>
              Shnoor is more than a platform. It's a comprehensive ecosystem designed to empower educators and inspire learners through state-of-the-art technology.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {["Enterprise First", "Outcome Driven", "Flexible Delivery", "Built for Growth"].map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: '#111827' }}>
                  <div style={{ width: '10px', height: '100%', background: '#2563eb', borderRadius: '2px' }}>&nbsp;</div>
                  {v}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {recognition.map((rec, i) => (
              <div
                key={i}
                className="card"
                style={{ borderLeft: '6px solid #2563eb', borderRadius: '0 20px 20px 0' }}
              >
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>{rec.title}</h4>
                <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{rec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;