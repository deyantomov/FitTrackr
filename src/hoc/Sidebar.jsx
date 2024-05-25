import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  GlobeAltIcon,
  QuestionMarkCircleIcon,
  PlusIcon,
  TrophyIcon,
  PresentationChartLineIcon
} from "@heroicons/react/24/outline";
import SidebarButton from "./SidebarNavigation/SidebarButton";
import { useApp } from "../hooks/useApp";
import { logout } from "../services/auth.service";
import { Menu } from "react-daisyui";

/**
 *
 * @param {{children: JSX.Element | Array<JSX.Element>}} props
 */
export default function Sidebar({ children }) {
  const app = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout(app);
    setIsLoggedIn(false);
  }


  return (
    <div className="drawer h-full">
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle h-full"
      />
      <div className="drawer-content flex-col items-start justify-center p-0 h-full">
        <Navbar toggleDrawer={toggleSidebar} />
        <div className="flex flex-col w-full h-full text-4xl">{children}</div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <Menu className="p-4 w-80 min-h-screen bg-base-200 text-base-content">
          <Link to="/">
            <div className="flex flex-row justify-start align-start text-center  my-3 m-0 p-0">
              {/* <img src="logo.png" className="w-16 m-0 p-0" /> */}
              <h2 className="text-5xl font-light ms-2 p-2">FitTrackr</h2>
            </div>
          </Link>
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
              <button
                className="btn btn-warning mt-auto"
                onClick={async () => await handleLogout()}
              >
                Log out
              </button>
            </>
          )}
        </Menu>
      </div>
    </div>
  );
}