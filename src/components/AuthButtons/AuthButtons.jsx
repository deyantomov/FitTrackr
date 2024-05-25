import { useApp } from "../../hooks/useApp";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserById } from "../../api/api";
// import { useLocation } from "react-router-dom";
import { logout } from "../../services/auth.service";
import { Button } from "react-daisyui";

export default function AuthButtons() {
  const app = useApp();
  // const location = useLocation(); //  state from successful registration
  // const [handle, setHandle] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (app.currentUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [app.currentUser])

  // useEffect(() => {
  //   const fetchHandle = async () => {
  //     if (isLoggedIn) {
  //       const user = await getUserById(app.currentUser.id);
  //       setHandle(user.handle);
  //     }
  //   };
  
  //   fetchHandle();
  // }, [isLoggedIn, app.currentUser]);

  const handleLogout = async () => {
    await logout(app);
    setIsLoggedIn(false);
  }
  
  return (
    <div className="flex flex-row gap-3 p-0 align-center items-center">
      {isLoggedIn ? (
        <div className="flex flex-row gap-6 align-center items-center p-0">
          <Button
            className="btn-warning"
            onClick={async () => await handleLogout()}
          >
            Log out
          </Button>
        </div>
      ) : (
        <>
          <Link to="/login">
            <Button className="btn-warning text-gray-800">Sign in</Button>
          </Link>
          <Link to="/signup">
            <Button className="btn-outline btn-warning">Sign up</Button>
          </Link>
        </>
      )}
    </div>
  )
}