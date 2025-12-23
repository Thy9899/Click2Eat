import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { token, user } = useContext(AuthContext);

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (roles && !roles.includes(user.role)) {
    // Redirect cashier to /dashboard
    if (user.role === "cashier") {
      return <Navigate to="/" replace />;
    }

    // All other roles → default redirect
    return <Navigate to="/order/view-order" replace />;
  }

  return children;
};

export default ProtectedRoute;
