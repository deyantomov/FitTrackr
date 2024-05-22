import { Bars3Icon } from "@heroicons/react/16/solid";
import ProfilePic from "../ProfilePic/ProfilePic";
import AuthButtons from "../AuthButtons/AuthButtons";
import { useApp } from "../../hooks/useApp";
import { useEffect, useState } from "react";
import { getProfilePic, getUserById } from "../../api/api";
import { Link } from "react-router-dom";

export default function Navbar({ toggleDrawer }) {
  const app = useApp();
  const [profilePic, setProfilePic] = useState("");
  const [picOwner, setPicOwner] = useState("");

  useEffect(() => {
    const fetchPic = async () => {
      if (app.currentUser) {
        const user = await getUserById(app.currentUser.id);

        if (user && user.profilePic) {
          const pic = await getProfilePic(app, user.profilePic);
          setProfilePic(pic.img);
          setPicOwner(pic.owner);
        }
      } else {
        setProfilePic("");
      }
    };

    fetchPic();
  }, [app.currentUser]);

  return (
    <div className="flex flex-row w-full bg-base-800 p-4 justify-center items-center border-b-warning border-b-2">
      <label
        htmlFor="my-drawer-2"
        className="btn btn-transparent border-1 border-base-900 drawer-button h-full"
        style={{ width: "64px" }}
        onClick={toggleDrawer}
      >
        <Bars3Icon className="w-full" />
      </label>
      <div className="ms-12 lg:flex flex-row gap-8 hidden">
        <Link to="/">
          <h2 className="text-2xl">Home</h2>
        </Link>
        <Link to="/exercises">
          <h2 className="text-2xl">Exercises</h2>
        </Link>
        {app.currentUser && (
          <Link to="/progress">
            <h2 className="text-2xl">Progress</h2>
          </Link>
        )}
        {app.currentUser && (
          <Link to="/goals">
            <h2 className="text-2xl">Goals</h2>
          </Link>
        )}
        <Link to="/about-us">
          <h2 className="text-2xl">About</h2>
        </Link>
      </div>
      <div className="rounded-full w-full flex flex-row justify-end align-end p-0">
        <Link to={`/profile/${picOwner}`}>
          <ProfilePic profilePic={profilePic} dimensions="56px" />
        </Link>
        <AuthButtons></AuthButtons>
      </div>
    </div>
  );
}
