import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAuthUser } from "../../utils/auth";

const DashboardLayout = ({ children, title }) => {
  const user = getAuthUser();
  const navigate = useNavigate();
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title={title} />
        <div className="page-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {}
      {user?.role === 'student' && (
        <button
          onClick={() => navigate("/student/messages")}
          style={{
            position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px',
            borderRadius: '50%', background: '#3B82F6', color: 'white', border: 'none',
            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
            zIndex: 1000, transition: '0.3s'
          }}
          className="msg-float-btn"
        >
          <FaEnvelope />
        </button>
      )}
    </div>
  );
};

export default DashboardLayout;
