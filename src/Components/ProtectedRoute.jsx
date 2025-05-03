import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ Children }) => {
  const navigate = useNavigate();
  const pathname = useLocation();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("logIn") === "true";
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(pathname.path === "/login" ? "/dashboard" : pathname.path);
    }
  }, []);
  return <div>{<Children />}</div>;
};

export default ProtectedRoute;
