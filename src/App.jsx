import { AppProvider } from "./providers/AppProvider";
import { Routes, Route, useLocation } from "react-router-dom";
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

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Sidebar>
            <Home />
          </Sidebar>
        }
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
        path="/notifications/:id"
        element={
          <Authenticated>
            <Sidebar>
              <Notifications />
            </Sidebar>
          </Authenticated>
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
        path="/goals"
        element={
          <Authenticated>
            <Sidebar>
              <Goals />
            </Sidebar>
          </Authenticated>
        }
      />
      <Route
        path="/exercises"
        element={
          <Sidebar>
            <Exercises key={location.key} />
          </Sidebar>
        }
      />
      <Route
        path="/search/:query"
        element={
          <Sidebar>
            <SearchResults />
          </Sidebar>
        }
      />
      <Route
        path="friend-list"
        element={
          <Sidebar>
            <FriendList />
          </Sidebar>
        }
      />
      <Route
        path="*"
        element={
          <Sidebar>
            <NotFound />
          </Sidebar>
        }
      />
    </Routes>
  );
}
