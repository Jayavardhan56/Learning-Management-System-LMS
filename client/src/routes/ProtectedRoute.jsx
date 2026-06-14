import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const roles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];

  let token = null;
  let user = null;

  for (const role of roles) {
    const t = localStorage.getItem(`token_${role}`);
    if (t) {
      token = t;
      user = JSON.parse(localStorage.getItem(`user_${role}`) || "{}");
      break;
    }
  }

  if (!token) {
    token = localStorage.getItem("token");
    user = JSON.parse(localStorage.getItem("user") || "{}");
  }

  if (!token) return <Navigate to="/login" />;

  const isAuthorized = roles.includes(user.role);
  if (!isAuthorized) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;