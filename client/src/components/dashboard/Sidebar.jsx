import { useNavigate, useLocation } from "react-router-dom";
import {
  FaThLarge, FaUserPlus, FaUsers, FaUserGraduate,
  FaChalkboardTeacher, FaCheckSquare, FaListUl,
  FaLayerGroup, FaFileSignature, FaClock, FaCommentDots,
  FaBook, FaBookOpen, FaGraduationCap, FaPlus,
  FaClipboardList, FaGamepad, FaPencilAlt, FaTrophy, FaCertificate, FaEnvelope, FaCog, FaSignOutAlt, FaRocket, FaSync
} from "react-icons/fa";
import { logout } from "../../utils/auth";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSession = () => {
    const path = location.pathname;
    let userStr = null;
    if (path.startsWith('/admin')) userStr = localStorage.getItem('user_admin');
    else if (path.startsWith('/manager')) userStr = localStorage.getItem('user_manager');
    else if (path.startsWith('/instructor')) userStr = localStorage.getItem('user_instructor');
    else if (path.startsWith('/student')) userStr = localStorage.getItem('user_student');

    if (!userStr) userStr = localStorage.getItem('user');

    try {
      return JSON.parse(userStr || '{}');
    } catch (e) {
      return {};
    }
  };

  const user = getSession();
  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return [
          { name: "Dashboard", icon: <FaThLarge />, path: "/admin" },
          { name: "Add Instructor", icon: <FaPlus />, path: "/admin/add-instructor" },
          { name: "Add Manager", icon: <FaPlus />, path: "/admin/add-manager" },
          { name: "Add Student", icon: <FaPlus />, path: "/admin/add-student" },
          { name: "Manage Users", icon: <FaUsers />, path: "/admin/manage-users" },
          { name: "Approve Users", icon: <FaCheckSquare />, path: "/admin/approve-users" },
          { name: "Approve Courses", icon: <FaFileSignature />, path: "/admin/approve-courses" },
          { name: "Assign Courses", icon: <FaLayerGroup />, path: "/admin/assign-courses" },
          { name: "Certificate Requests", icon: <FaCertificate />, path: "/admin/approve-certificates" },
          { name: "Update Requests", icon: <FaSync />, path: "/admin/approve-updates" },
        ];
      case 'instructor':
        return [
          { name: "Dashboard", icon: <FaThLarge />, path: "/instructor" },
          { name: "My Courses", icon: <FaBook />, path: "/instructor/courses" },
          { name: "Create Course", icon: <FaPlus />, path: "/instructor/create-course" },
        ];
      case 'manager':
        return [
          { name: "Dashboard", icon: <FaThLarge />, path: "/manager" },
          { name: "Manage Students", icon: <FaUsers />, path: "/manager/students" },
        ];
      case 'student':
        return [
          { name: "Dashboard", icon: <FaThLarge />, path: "/student" },
          { name: "My Courses", icon: <FaBookOpen />, path: "/student/my-courses" },
          { name: "Mock Test", icon: <FaClipboardList />, path: "/student/mock-test" },
          { name: "Practice Arena", icon: <FaGamepad />, path: "/student/practice-arena" },
          { name: "Exams", icon: <FaPencilAlt />, path: "/student/exams" },
          { name: "Weekly Contests", icon: <FaTrophy />, path: "/student/contests" },
          { name: "Certificates", icon: <FaCertificate />, path: "/student/certificates" },
          { name: "My Groups", icon: <FaUsers />, path: "/student/groups" },
          { name: "Messages", icon: <FaEnvelope />, path: "/student/messages" },
          { name: "Settings", icon: <FaCog />, path: "/student/settings" },
        ];
      default: return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ padding: '30px 25px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" alt="SHNOOR" style={{ height: '35px' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'white', letterSpacing: '0.5px' }}>SHNOOR</span>
               <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.5px' }}>LEARNING MANAGEMENT SYSTEM</span>
            </div>
         </div>
      </div>

      <div className="sidebar-menu" style={{ padding: '10px 15px' }}>
        {Array.isArray(menuItems) && menuItems.map((item, i) => (
          <div
            key={i}
            className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
            style={{ fontSize: '0.9rem' }}
          >
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '20px' }}>
         <button onClick={handleLogout} className="menu-item" style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', padding: '12px 20px' }}>
           <FaSignOutAlt />
           <span>Logout</span>
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;
