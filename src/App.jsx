import { AppProvider } from "./providers/AppProvider";
import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./hoc/Sidebar";
import Home from "./views/Home/Home";
import Login from "./views/Login/Login";
import SignUp from "./views/Signup/Signup";
import Goals from "./views/Goals/Goals";
import Profile from "./views/Profile/Profile";
import Notifications from "./views/Notifications/Notifications";
import Authenticated from "./components/Authenticated/Authenticated";
import SearchResults from "./views/SearchResults/SearchResults";
import atlasConfig from "../atlasConfig.json";
import "./App.css";
import NewExerciseForm from "./views/NewExercise/NewExercise";
import NotFound from "./views/NotFound/NotFound";
import Exercises from "./views/Exercises/Exercises";
import FriendList from "./views/FriendList/FriendList";
import { ToastProvider } from "./providers/ToastProvider";
const { appId } = atlasConfig;

export default function ProvidedApp() {
  return (
    <AppProvider appId={appId}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AppProvider>
  );
}

function App() {
  const location = useLocation();
  const [theme, setTheme] = useState("bumblebee");

  const toggleTheme = () => {
    setTheme(theme === "bumblebee" ? "night" : "bumblebee");
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Sidebar theme={theme} toggleTheme={toggleTheme}>
            <Home />
          </Sidebar>
        }
      />
      <Route
        path="/home"
        index
        element={
          <Sidebar theme={theme} toggleTheme={toggleTheme}>
            <Home />
          </Sidebar>
        }
      />
      <Route
        path="/login"
        element={
          <Sidebar theme={theme} toggleTheme={toggleTheme}>
            <Login />
          </Sidebar>
        }
      />
      <Route
        path="/signup"
        element={
          <Sidebar theme={theme} toggleTheme={toggleTheme}>
            <SignUp />
          </Sidebar>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <Sidebar theme={theme} toggleTheme={toggleTheme}>
            <Profile />
          </Sidebar>
        }
      />
      <Route
        path="/notifications/:id"
        element={
          <Authenticated>
            <Sidebar theme={theme} toggleTheme={toggleTheme}>
              <Notifications />
            </Sidebar>
          </Authenticated>
        }
      />
      <Route
        path="/new-exercise"
        element={
          <Authenticated>
            <Sidebar theme={theme} toggleTheme={toggleTheme}>
              <NewExerciseForm />
            </Sidebar>
          </Authenticated>
        }
      />
      <Route
        path="/goals"
        element={
          <Authenticated>
            <Sidebar theme={theme} toggleTheme={toggleTheme}>
              <Goals />
            </Sidebar>
          </Authenticated>
        }
      />
      <Route
        path="/exercises"
        element={
          <Sidebar theme={theme} toggleTheme={toggleTheme}>
            <Exercises key={location.key} />
          </Sidebar>
        }
      />
      <Route
        path="/search/:query"
        element={
          <Sidebar theme={theme} toggleTheme={toggleTheme}>
            <SearchResults />
          </Sidebar>
        }
      />
      <Route
        path="friend-list"
        element={
          <Sidebar theme={theme} toggleTheme={toggleTheme}>
            <FriendList />
          </Sidebar>
        }
      />
      <Route
        path="*"
        element={
          <Sidebar theme={theme} toggleTheme={toggleTheme}>
            <NotFound />
          </Sidebar>
        }
      />
    </Routes>
  );
}
