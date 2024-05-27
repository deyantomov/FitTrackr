import { useApp } from "../../hooks/useApp";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById } from "../../api/api";

export default function Authenticated({ children }) {
  const app = useApp();
  const location = useLocation(); //  pathname property = current location
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      setUser(await getUserById(app.currentUser.id));
    }

    fetchUser();
  }, [])

  return user ? <>{children}</> : <>{navigate("/login", { state: location.pathname })}</>;
}