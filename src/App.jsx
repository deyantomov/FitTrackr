import { AppProvider } from "./providers/AppProvider";
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./hoc/Sidebar";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import SignUp from "./components/Signup/Signup";
import Authenticated from "./components/Authenticated/Authenticated";
// import UpdateProfile from "./components/UpdateProfile";
import atlasConfig from "../atlasConfig.json";
import "./App.css";
const { appId } = atlasConfig;

export default function ProvidedApp() {
  return (
    <AppProvider appId={appId}>
      <App />
    </AppProvider>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate('/home');
    }
  }, [location, navigate]);

  return (
    <Routes>
      {/* <Route
        path="/"
        element={<>{redirect('/home')}</>}
      /> */}
      <Route
        path="/home"
        index
        element={
          <Sidebar>
            <Home />
          </Sidebar>
        }
      />
      <Route path="/login" element={<Login></Login>} />
      <Route path="/signup" element={<SignUp />} />
      {/* <Route
        path="/update-profile"
        element={
          <Authenticated>
            <Sidebar>
              <UpdateProfile />
            </Sidebar>
          </Authenticated>
        }
      /> */}
    </Routes>
  );
}