import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddUser from "./pages/admin/AddUser";
import ApproveUsers from "./pages/admin/ApproveUsers";
import ManageUsers from "./pages/admin/ManageUsers";
import ApproveCourses from "./pages/admin/ApproveCourses";
import ApproveEnrollments from "./pages/admin/ApproveEnrollments";
import AssignCourses from "./pages/admin/AssignCourses";
import ManagerList from "./pages/admin/ManagerList";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorCourses from "./pages/instructor/InstructorCourses";
import CreateCourse from "./pages/instructor/CreateCourse";
import EditCourse from "./pages/instructor/EditCourse";
import Courses from "./pages/student/Courses";
import MyCourses from "./pages/student/MyCourses";
import StudentDashboard from "./pages/student/StudentDashboard";
import CoursePlayer from "./pages/student/CoursePlayer";
import CourseOverview from "./pages/student/CourseOverview";
import ManagerStudents from "./pages/manager/Students";
import ManagerAssignCourses from "./pages/manager/AssignCourses";
import ApproveCertificates from "./pages/admin/ApproveCertificates";
import ApproveUpdates from "./pages/admin/ApproveUpdates";
import Certificate from "./pages/student/Certificate";
import StudentCertificates from "./pages/student/Certificates";
import UnderMaintenance from "./pages/UnderMaintenance";
import ContactPage from "./pages/ContactPage";
import Exams from "./pages/student/Exams";
import MockTest from "./pages/student/MockTest";
import PracticeArena from "./pages/student/PracticeArena";
import Leaderboard from "./pages/student/Leaderboard";
import MyGroups from "./pages/student/MyGroups";
import Messages from "./pages/student/Messages";
import Settings from "./pages/student/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactPage />} />

        {}
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/add-instructor" element={<ProtectedRoute allowedRole="admin"><AddUser role="instructor" /></ProtectedRoute>} />
        <Route path="/admin/add-manager" element={<ProtectedRoute allowedRole="admin"><AddUser role="manager" /></ProtectedRoute>} />
        <Route path="/admin/add-student" element={<ProtectedRoute allowedRole="admin"><AddUser role="student" /></ProtectedRoute>} />
        <Route path="/admin/approve-users" element={<ProtectedRoute allowedRole="admin"><ApproveUsers /></ProtectedRoute>} />
        <Route path="/admin/manage-users" element={<ProtectedRoute allowedRole="admin"><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/approve-courses" element={<ProtectedRoute allowedRole="admin"><ApproveCourses /></ProtectedRoute>} />
        <Route path="/admin/approve-enrollments" element={<ProtectedRoute allowedRole="admin"><ApproveEnrollments /></ProtectedRoute>} />
        <Route path="/admin/assign-courses" element={<ProtectedRoute allowedRole="admin"><AssignCourses /></ProtectedRoute>} />
        <Route path="/admin/manager-list" element={<ProtectedRoute allowedRole="admin"><ManagerList /></ProtectedRoute>} />
        <Route path="/admin/approve-certificates" element={<ProtectedRoute allowedRole={["admin", "manager"]}><ApproveCertificates /></ProtectedRoute>} />
        <Route path="/admin/approve-updates" element={<ProtectedRoute allowedRole="admin"><ApproveUpdates /></ProtectedRoute>} />

        {}
        <Route path="/manager" element={<ProtectedRoute allowedRole="manager"><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/manager/students" element={<ProtectedRoute allowedRole="manager"><ManagerStudents /></ProtectedRoute>} />
        <Route path="/manager/assign-courses" element={<ProtectedRoute allowedRole="manager"><ManagerAssignCourses /></ProtectedRoute>} />
        <Route path="/manager/approve-enrollments" element={<ProtectedRoute allowedRole="manager"><ApproveEnrollments /></ProtectedRoute>} />
        <Route path="/manager/approve-certificates" element={<ProtectedRoute allowedRole="manager"><ApproveCertificates /></ProtectedRoute>} />
        <Route path="/manager/messages" element={<ProtectedRoute allowedRole="manager"><Messages /></ProtectedRoute>} />

        {}
        <Route path="/instructor" element={<ProtectedRoute allowedRole="instructor"><InstructorDashboard /></ProtectedRoute>} />
        <Route path="/instructor/courses" element={<ProtectedRoute allowedRole="instructor"><InstructorCourses /></ProtectedRoute>} />
        <Route path="/instructor/create-course" element={<ProtectedRoute allowedRole="instructor"><CreateCourse /></ProtectedRoute>} />
        <Route path="/instructor/edit-course/:courseId" element={<ProtectedRoute allowedRole="instructor"><EditCourse /></ProtectedRoute>} />
        <Route path="/instructor/messages" element={<ProtectedRoute allowedRole="instructor"><Messages /></ProtectedRoute>} />

        {}
        <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/courses" element={<ProtectedRoute allowedRole={["student", "instructor"]}><Courses /></ProtectedRoute>} />
        <Route path="/student/my-courses" element={<ProtectedRoute allowedRole="student"><MyCourses /></ProtectedRoute>} />
        <Route path="/student/course/:courseId" element={<ProtectedRoute allowedRole="student"><CourseOverview /></ProtectedRoute>} />
        <Route path="/student/course/:courseId/learn" element={<ProtectedRoute allowedRole="student"><CoursePlayer /></ProtectedRoute>} />
        <Route path="/student/certificate/:courseId" element={<ProtectedRoute allowedRole="student"><Certificate /></ProtectedRoute>} />

        {}
        <Route path="/student/mock-test" element={<ProtectedRoute allowedRole="student"><MockTest /></ProtectedRoute>} />
        <Route path="/student/practice-arena" element={<ProtectedRoute allowedRole="student"><PracticeArena /></ProtectedRoute>} />
        <Route path="/student/exams" element={<ProtectedRoute allowedRole="student"><Exams /></ProtectedRoute>} />
        <Route path="/student/contests" element={<ProtectedRoute allowedRole="student"><Leaderboard /></ProtectedRoute>} />
        <Route path="/student/certificates" element={<ProtectedRoute allowedRole="student"><StudentCertificates /></ProtectedRoute>} />
        <Route path="/student/groups" element={<ProtectedRoute allowedRole="student"><MyGroups /></ProtectedRoute>} />
        <Route path="/student/messages" element={<ProtectedRoute allowedRole="student"><Messages /></ProtectedRoute>} />
        <Route path="/student/settings" element={<ProtectedRoute allowedRole="student"><Settings /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;