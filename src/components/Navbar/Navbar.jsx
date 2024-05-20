import { Bars3Icon } from "@heroicons/react/16/solid";
import ProfilePic from "../ProfilePic/ProfilePic";
import AuthButtons from "../AuthButtons/AuthButtons";
import { useApp } from "../../hooks/useApp";
import { useEffect, useState } from "react";
import { getProfilePic, getUserById } from "../../api/api";

export default function Navbar({ toggleDrawer }) {
  const app = useApp();
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const fetchPic = async () => {      
      if (app.currentUser) {
        const user = await getUserById(app.currentUser.id);

        if (user && user.profilePic) {
          const pic = await getProfilePic(app, user.profilePic);
          setProfilePic(pic);
        } 
      } else {
        setProfilePic('');
      }
    };
    
    fetchPic();
  }, [app.currentUser]);
  
  return (
    <div className="flex flex-row w-full bg-gray-800 p-4">
      <label
        htmlFor="my-drawer-2"
        className="btn btn-transparent drawer-button h-full"
        style={{ width: "64px" }}
        onClick={toggleDrawer}
      >
        <Bars3Icon className="w-full" />
      </label>
      <div className="rounded-full w-full flex flex-row justify-end align-end p-0">
        <ProfilePic profilePic={profilePic} />
        <AuthButtons></AuthButtons>
      </div>
    </div>
  );
}
