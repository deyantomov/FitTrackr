import { useApp } from "../../hooks/useApp";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout } from "../../services/auth.service";

export default function AuthButtons() {
  const app = useApp();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (app.currentUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [app.currentUser]);

  const handleLogout = async () => {
    await logout(app);
    setIsLoggedIn(false);
  }
  
  return (
    <div className="flex flex-row gap-3 p-0 align-center items-center">
      {isLoggedIn ? (
        <div className="flex flex-row gap-6 align-center items-center p-0">
          <button
            className="btn btn-warning"
            onClick={async () => await handleLogout()}
          >
            Log out
          </button>
        </div>
      ) : (
        <>
          <Link to="/login">
            <button className="btn btn-warning text-gray-800">Sign in</button>
          </Link>
          <Link to="/signup">
            <button className="btn btn-outline btn-warning">Sign up</button>
          </Link>
        </>
      )}
    </div>
  )
}