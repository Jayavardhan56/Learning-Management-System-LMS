import { FaChalkboardTeacher, FaUsers, FaGamepad, FaFlask } from "react-icons/fa";
import "../../styles/landing.css";

const Training = () => {
  const options = [
    { icon: <FaChalkboardTeacher />, title: "Instructor-led", desc: "Expert-led sessions for structured learning." },
    { icon: <FaUsers />, title: "Corporate", desc: "Customized tracks aligned to business goals." },
    { icon: <FaGamepad />, title: "Practice Arena", desc: "Gamified self-paced retention modules." },
    { icon: <FaFlask />, title: "Labs", desc: "Hands-on execution environments." }
  ];

  return (
    <section id="training" className="section light">
      <div className="container">
        <h2>Diverse <span style={{ color: '#2563eb' }}>Learning Formats</span></h2>
        <p className="section-desc">Whether your teams need guided instruction or self-paced flexibility, Shnoor delivers it all.</p>

        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {options.map((opt, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
               <div className="icon-circle" style={{ margin: '0 auto 20px', width: '50px', height: '50px', fontSize: '1.2rem' }}>{opt.icon}</div>
               <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '10px' }}>{opt.title}</h4>
               <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>{opt.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Training;