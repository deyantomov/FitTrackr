import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  GlobeAltIcon,
  QuestionMarkCircleIcon,
  PlusIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import SidebarButton from "./SidebarNavigation/SidebarButton";
import { useApp } from "../hooks/useApp";
import { logout } from "../services/auth.service";
import FooterNav from "../components/Footer/Footer";
import SwitchTheme from "./SwitchTheme";
import PropTypes from "prop-types";

/**
 *
 * @param {{children: JSX.Element | Array<JSX.Element>, toggleTheme: () => void, theme: string}} props
 * @returns {React.FC}
 */
export default function Sidebar({ children, toggleTheme, theme }) {
  const app = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout(app);
    setIsLoggedIn(false);
  };

  return (
    <div className="drawer h-full z-50">
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle h-full"
      />
      <div className="drawer-content flex flex-col items-start justify-center p-0">
        {/* Content */}
        <Navbar toggleDrawer={toggleSidebar} />
        <div className="flex flex-col w-full h-full text-4xl">
          {children}
          <FooterNav></FooterNav>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu p-4 w-80 min-h-screen bg-base-200 text-base-content">
          <div className="flex flex-row justify-start align-start items-center text-center gap-12 my-2 mx-0 p-2">
            <Link to="/">
              {/* <img src="logo.png" className="w-16 m-0 p-0" /> */}
              <h2 className="text-5xl font-light ms-2">FitTrackr</h2>
            </Link>
            <SwitchTheme theme={theme} toggle={toggleTheme}></SwitchTheme>
          </div>
          <hr className="border-t-2 border-warning my-4" />
          <Link to="/home">
            <SidebarButton
              text="Home"
              icon={<HomeIcon title="home" className="h-3/6" />}
            ></SidebarButton>
          </Link>
          <Link to="/exercises">
            <SidebarButton
              text="Explore exercises"
              icon={<GlobeAltIcon title="exercises" className="h-3/6" />}
            ></SidebarButton>
          </Link>
          <Link to="/about">
            <SidebarButton
              text="About us"
              icon={<QuestionMarkCircleIcon title="about" className="h-3/6" />}
            ></SidebarButton>
          </Link>
          <hr className="border-t-2 border-warning my-4" />
          {app.currentUser && (
            <>
              <Link to="/new-exercise">
                <SidebarButton
                  text="Create Exercise"
                  icon={<PlusIcon title="create" className="h-3/6" />}
                ></SidebarButton>
              </Link>
              {/* <Link to="/progress">
                <SidebarButton
                  text="Progress"
                  icon={<PresentationChartLineIcon title="progress" className="h-3/6" />}
                ></SidebarButton>
              </Link> */}
              <Link to="/goals">
                <SidebarButton
                  text="Goals"
                  icon={<TrophyIcon title="goals" className="h-3/6" />}
                ></SidebarButton>
              </Link>
              <Link to="/friend-list">
                <SidebarButton
                  text="Friend List"
                  icon={<UserGroupIcon title="friendlist" className="h-3/6" />}
                ></SidebarButton>
              </Link>
              <button
                className="btn btn-warning mt-auto"
                onClick={async () => await handleLogout()}
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]),
  toggleTheme: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
};