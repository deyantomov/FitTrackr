import { useEffect } from "react";
import { getProfilePic, getUserById } from "../../api/api";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../../hooks/useApp";
import ProfilePic from "../ProfilePic/ProfilePic";

export default function Profile() {
  const app = useApp();
  const params = useParams();
  const [user, setUser] = useState({});
  const [userPic, setUserPic] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      const profile = await getUserById(params.id);
      setUser(profile);

      const pic = await getProfilePic(app, profile.profilePic);
      setUserPic(pic.img);

      // console.log(pic);
    };

    getProfile();
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center align-center items-center p-8">
      <div className="flex flex-col bg-white p-12">
        <div className="flex flex-row items-start">
          <ProfilePic profilePic={userPic} dimensions="96px"></ProfilePic>
          <div className="flex flex-col">
            <p className="text-gray-600 text-2xl">@{user.handle}</p>
            <div className="flex flex-col items-start text-lg mt-3">
              <p>
                <b>First name:</b> {user.firstName}
              </p>
              <p>
                <b>Last name:</b> {user.lastName}
              </p>
              <p>
                <b>Age:</b> {user.age}
              </p>
              <p>
                <b>Bio:</b> {user.bio}
              </p>
            </div>
          </div>
        </div>
        <button className="btn btn-warning mt-8">Update your profile</button>
      </div>
    </div>
  );
}
