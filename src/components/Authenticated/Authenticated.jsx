import { useApp } from "../../hooks/useApp";
import { useNavigate, useLocation } from "react-router-dom";
// import { get } from "../../services/localStorage.service";
// import { LocalStorage } from "../../providers/AppProvider";
import { useEffect, useState } from "react";

export default function Authenticated({ children }) {
  const app = useApp();
  const location = useLocation(); //  pathname property = current location
  const navigate = useNavigate();
  const [user, setUser] = useState();
  // const storage = new LocalStorage();
  
  useEffect(() => {
    const fetchUser = async () => {
      setUser(await app.storage.get("user"));
    }

    fetchUser();
  }, [])

  return user ? <>{children}</> : <>{navigate("/login", { state: location.pathname })}</>;
}