import { useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaUserTie,
  FaChalkboardTeacher,
  FaUserGraduate,
} from "react-icons/fa";
import "../styles/auth.css";
function RoleSelect() {
  const navigate = useNavigate();
  const roles = [
    {
      name: "admin",
      icon: <FaUserShield />,
      desc: "Full control over system, users and analytics.",
      btn: "Access as Admin",
    },
    {
      name: "manager",
      icon: <FaUserTie />,
      desc: "Manage operations, monitor performance and approvals.",
      btn: "Manage as Manager",
    },
    {
      name: "instructor",
      icon: <FaChalkboardTeacher />,
      desc: "Create courses, upload content and guide learners.",
      btn: "Be an Instructor",
    },
    {
      name: "student",
      icon: <FaUserGraduate />,
      desc: "Enroll in courses, learn and earn certifications.",
      btn: "Start as Student",
    },
  ];
  return (
    <div className="role-page">
      <div className="role-container">
        <h1>Select Your Role</h1>
        <div className="role-grid">
          {roles.map((role) => (
            <div className="role-card" key={role.name}>
              <div className="role-icon">{role.icon}</div>
              <h3>{role.name.toUpperCase()}</h3>
              <p>{role.desc}</p>
              <button
                onClick={() => navigate(`/login/${role.name}`)}
              >
                {role.btn}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default RoleSelect;