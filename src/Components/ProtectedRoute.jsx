import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ Children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("logIn") === "true";
    if (!isAuthenticated) {
      if (location.pathname !== "/login") {
        navigate("/login");
      }
    } else {
      if (location.pathname === "/login") {
        navigate("/dashboard");
      }
    }
  }, [location, navigate]);
  return <div>{<Children />}</div>;
};

export default ProtectedRoute;
