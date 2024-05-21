import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import { HomeIcon, GlobeAltIcon, QuestionMarkCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import SidebarButton from "./SidebarNavigation/SidebarButton";
/**
 *
 * @param {{children: JSX.Element | Array<JSX.Element>}} props
 */
export default function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="drawer h-full">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle h-full" />
      <div className="drawer-content flex flex-col items-start justify-center p-0">
        <Navbar toggleDrawer={toggleSidebar} />
        <div className="flex flex-col w-full h-full text-4xl">{children}</div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu p-4 w-80 min-h-screen bg-base-200 text-base-content">
          <Link to="/">
            <h2 className="text-4xl mt-3 ms-2 p-2">FitTrackr</h2>
          </Link>
          <hr className="border-t-2 border-warning my-4" />
          <SidebarButton
            text="Home"
            icon={<HomeIcon title="home" className="h-3/6" />}
          ></SidebarButton>
          <SidebarButton
            text="Explore exercises"
            icon={<GlobeAltIcon title="exercises" className="h-3/6" />}
          ></SidebarButton>
          <SidebarButton
            text="About us"
            icon={<QuestionMarkCircleIcon title="about" className="h-3/6" />}
          ></SidebarButton>
          <hr className="border-t-2 border-warning my-4" />
          <Link to="/new-exercise">
          <SidebarButton
          text="Create Exercise"
          icon={<PlusIcon title="create" className="h-3/6" />}
          ></SidebarButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
