import { AppProvider } from "./providers/AppProvider";
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./hoc/Sidebar";
import Home from "./views/Home/Home";
import Login from "./views/Login/Login";
import SignUp from "./views/Signup/Signup";
import Goals from "./views/Goals/Goals";
import Profile from "./views/Profile/Profile";
import Authenticated from "./components/Authenticated/Authenticated";
// import UpdateProfile from "./components/UpdateProfile";
import atlasConfig from "../atlasConfig.json";
import "./App.css";
import NewExerciseForm from "./views/NewExercise/NewExercise";
import NotFound from "./views/NotFound/NotFound";
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
      navigate("/home");
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
      <Route
        path="/profile/:id"
        element={
          <Sidebar>
            <Profile />
          </Sidebar>
        }
      />
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
      <Route
        path="/new-exercise"
        index
        element={
          <Sidebar>
            <NewExerciseForm />
          </Sidebar>
        }
      />
      <Route
        path="/goals"
        index
        element={
          <Sidebar>
            <Goals />
          </Sidebar>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
