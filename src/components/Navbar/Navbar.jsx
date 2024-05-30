import { Bars3Icon } from "@heroicons/react/16/solid";
import ProfilePic from "../ProfilePic/ProfilePic";
import AuthButtons from "../AuthButtons/AuthButtons";
import { useApp } from "../../hooks/useApp";
import { useEffect, useState, useRef } from "react";
import { getProfilePic, getUserById } from "../../api/api";
import { Link } from "react-router-dom";
import { Dropdown, Input } from "react-daisyui";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Navbar({ toggleDrawer }) {
  const app = useApp();
  const [profilePic, setProfilePic] = useState("");
  const [uid, setUid] = useState("");
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleUpdateSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/search/${searchTerm}`);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    const fetchPic = async () => {
      if (app.currentUser) {
        const user = await getUserById(app.currentUser.id);

        if (user) {
          setUid(user.uid);
          setHandle(user.handle);

          if (user.profilePic) {
            const pic = await getProfilePic(app, user.profilePic);
            setProfilePic(pic.img);
          }
        }
      } else {
        setProfilePic("");
      }
    };

    fetchPic();
    setLoading(false);
  }, [app.currentUser]);

  //  Real-time listener for profile pics
  useEffect(() => {
    let isMounted = true;

    const listenForChanges = async () => {
      const mongoClient = app.currentUser.mongoClient("mongodb-atlas");
      const collection = mongoClient
        .db("sample_data")
        .collection("profile_pics");
      const changeStream = collection.watch();

      const cleanup = () => {
        changeStream.close();
      };

      // Listen for changes
      for await (const change of changeStream) {
        if (app.currentUser) {
          const user = await getUserById(app.currentUser.id);

          if (user) {
            setUid(user.uid);
            setHandle(user.handle);

            if (user.profilePic) {
              const pic = await getProfilePic(app, user.profilePic);
              setProfilePic(pic.img);
            }
          }
        }
      }

      //  clean up;
      return cleanup;
    };

    listenForChanges().catch(console.error);

    return () => {
      isMounted = false; // set the flag to false when the component unmounts
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
  
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center"></div>
    );
  }

  return (
    <div className="grid grid-cols-3 w-full bg-base-800 p-4 justify-center align-center items-center border-b-warning border-b-2">
      <div className="flex justify-start items-center">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-transparent border-1 border-base-900 drawer-button h-full"
          style={{ width: "64px" }}
          onClick={toggleDrawer}
        >
          <Bars3Icon className="w-full" />
        </label>
        <div className="ms-12 xl:flex flex-row gap-8 hidden">
          <Link to="/">
            <h2 className="text-2xl">Home</h2>
          </Link>
          <Link to="/exercises">
            <h2 className="text-2xl">Exercises</h2>
          </Link>
          {app.currentUser && (
            <Link to="/goals">
              <h2 className="text-2xl">Goals</h2>
            </Link>
          )}
          <Link to="/about-us">
            <h2 className="text-2xl">About</h2>
          </Link>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Input
          type="text"
          className="w-full"
          onChange={(e) => handleUpdateSearchTerm(e)}
          value={searchTerm}
          placeholder="Search users and exercises"
        />
        <MagnifyingGlassCircleIcon
          className="hover:bg-base-200 cursor-pointer rounded-full ms-2 me-4 md:ms-4"
          style={{ width: "64px" }}
          onClick={handleSearch}
        />
      </div>
      <div className="rounded-full w-full flex flex-row gap-8 justify-end align-end p-0">
        {app.currentUser && (
          <Dropdown className="m-0 p-0" ref={dropdownRef}>
            <Dropdown.Toggle
              className="cursor-pointer m-0 p-0"
              button={false}
              onClick={() => setIsOpen(!isOpen)}
            >
              <ProfilePic profilePic={profilePic} dimensions="56px" />
            </Dropdown.Toggle>
            {isOpen && (
              <Dropdown.Menu className="w-52 mt-4 absolute right-2 shadow-xl">
                <Dropdown.Item className="hover:bg-base-100 cursor-default my-1">
                  <h2 className="text-xl cursor-default">{handle}</h2>
                </Dropdown.Item>
                <Link to={`/profile/${uid}`}>
                  <Dropdown.Item>
                    <p>My profile</p>
                  </Dropdown.Item>
                </Link>
                <Link to={`/home`}>
                  <Dropdown.Item>
                    <p>Liked posts</p>
                  </Dropdown.Item>
                </Link>
              </Dropdown.Menu>
            )}
          </Dropdown>
        )}

        <AuthButtons></AuthButtons>
      </div>
    </div>
  );
}
