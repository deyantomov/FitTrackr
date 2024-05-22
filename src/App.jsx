import { AppProvider } from "./providers/AppProvider";
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./hoc/Sidebar";
import Home from "./views/Home/Home";
import Login from "./views/Login/Login";
import SignUp from "./views/Signup/Signup";
import Goals from "./views/Goals/Goals";
import Profile from "./views/Profile/Profile";
import Progress from "./views/Progress/Progress";
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
      <Route
        path="/"
        element={<Sidebar><Home /></Sidebar>}
      />
      <Route
        path="/home"
        index
        element={
          <Sidebar>
            <Home />
          </Sidebar>
        }
      />
      <Route
        path="/login"
        element={
          <Sidebar>
            <Login />
          </Sidebar>
        }
      />
      <Route
        path="/signup"
        element={
          <Sidebar>
            <SignUp />
          </Sidebar>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <Sidebar>
            <Profile />
          </Sidebar>
        }
      />
      <Route
        path="/new-exercise"
        element={
          <Authenticated>
            <Sidebar>
              <NewExerciseForm />
            </Sidebar>
          </Authenticated>
        }
      />
      <Route 
        path="/progress"
        element={
          <Sidebar>
            <Authenticated>
              <Progress />
            </Authenticated>
          </Sidebar>
        }
      />
      <Route
        path="/goals"
        element={
          <Sidebar>
            <Goals />
          </Sidebar>
        }
      />
      <Route path="*" element={<Sidebar><NotFound /></Sidebar>} />
    </Routes>
  );
}
