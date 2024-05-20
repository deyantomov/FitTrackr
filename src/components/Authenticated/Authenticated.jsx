import { useApp } from "../../hooks/useApp";
import { useNavigate, useLocation } from "react-router-dom";

export default function Authenticated({ children }) {
  const app = useApp();
  const location = useLocation(); //  pathname property = current location
  const navigate = useNavigate();
  
  return app.currentUser ? <>{children}</> : <>{navigate("/login", { state: location.pathname })}</>;
}