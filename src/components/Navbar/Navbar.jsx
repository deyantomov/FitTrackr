import { Bars3Icon } from "@heroicons/react/16/solid";
import ProfilePic from "../ProfilePic/ProfilePic";
import AuthButtons from "../AuthButtons/AuthButtons";
import { useApp } from "../../hooks/useApp";
import { useEffect, useState, useRef } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
import { Dropdown, Input, Indicator, Badge, Button } from "react-daisyui";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  BellIcon,
  UserGroupIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { mongoCfg } from "../../common/constants";

const { getProfilePic, getUserById } = api;

/**
 * @param {{toggleDrawer: () => void}} props
 * @returns {React.FC}
 */
export default function Navbar({ toggleDrawer }) {
  const app = useApp();
  const [profilePic, setProfilePic] = useState("");
  const [uid, setUid] = useState("");
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
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
            const pic = await getProfilePic(user.profilePic);
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

  //  Real-time listener for profile pics and notifications
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      const listenForPicChanges = async () => {
        const mongoClient = app.currentUser.mongoClient(mongoCfg.mongoClient);
        const picCollection = mongoClient
          .db(mongoCfg.db)
          .collection(mongoCfg.collections.profile_pics);

        const pipeline = [
          {
            $match: {
              "fullDocument.userId": app.currentUser.id,
              operationType: { $in: ["insert", "update", "replace", "delete"] }
            }
          }
        ];
    
        const changeStreamPics = picCollection.watch(pipeline);

        try {
          for await (const change of changeStreamPics) {
            switch (change.operationType) {
            case "insert":
              setProfilePic(change.fullDocument.img);
              break;
            case "update":
            case "replace":
              if (app.currentUser) {
                const user = await getUserById(app.currentUser.id);
                if (user && user.profilePic) {
                  const pic = await getProfilePic(user.profilePic);
                  setProfilePic(pic.img);
                }
              }
              break;
            case "delete":
              setProfilePic(null);
              break;
            default:
              throw new Error("Unhandled change event:", change);
            }
          }
        } catch (err) {
          console.error("Error listening for changes:", err);
        }
      };

      const initializeNotificationCount = async () => {
        const user = await getUserById(app.currentUser.id);
        if (user && user.notifications) {
          const notificationCount = Object.values(user.notifications).reduce(
            (total, current) => total + current.length,
            0
          );
          setNotificationCount(notificationCount);
        }
      };

      initializeNotificationCount();

      const listenForNotificationChanges = async () => {
        const mongoClient = app.currentUser.mongoClient(mongoCfg.mongoClient);
        const usersCollection = mongoClient
          .db(mongoCfg.db)
          .collection(mongoCfg.collections.users);

        const changeStreamUsers = usersCollection.watch();
        
        try {
          for await (const change of changeStreamUsers) {
            switch (change.operationType) {
            case "insert":
            case "update":
            case "replace":
              if (app.currentUser) {
                const user = await getUserById(app.currentUser.id);

                if (user && user.notifications) {
                  const notificationCount = Object
                    .values(user.notifications)
                    .reduce((total, current) => total + current.length, 0);

                  setNotificationCount(notificationCount);
                }
              }

              break;
            case "delete":
              setNotificationCount(prev => prev - 1);
              break;
            default:
              throw new Error("Unhandled change event:", change);
            }
          }
        } catch (err) {
          console.error(err);
        }
      };

      listenForPicChanges();
      listenForNotificationChanges();
    }

    return () => {
      isMounted = false; // set the flag to false on cleanup
    };
  }, [app]);

  //  close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    //  bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      //  unbind the event listener on clean up
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
      </div>
      <div className="flex justify-center items-center">
        <Input
          type="text"
          className="w-full"
          onChange={(e) => handleUpdateSearchTerm(e)}
          value={searchTerm}
          placeholder="Search users and exercises"
        />
        <MagnifyingGlassIcon
          className="hover:bg-base-200 cursor-pointer rounded-full ms-2 me-4 md:ms-4"
          style={{ width: "32px" }}
          onClick={handleSearch}
        />
      </div>
      <div className="rounded-full w-full flex flex-row gap-4 md:gap-8 justify-end align-end p-0">
        {app.currentUser && (
          <Dropdown className="m-0 p-0" ref={dropdownRef}>
            <div className="relative">
              <Dropdown.Toggle
                className="cursor-pointer m-0 p-0"
                button={false}
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="grid w-14 h-14 rounded-full bg-base-300 place-items-center">
                  <ProfilePic profilePic={profilePic} dimensions="56px" />
                </div>
                {notificationCount > 0 && (
                  <Indicator className="absolute bottom-0 left-10 bg-red-400 p-2 py-0 rounded-full">
                    <Indicator.Item>{notificationCount}</Indicator.Item>
                  </Indicator>
                )}
              </Dropdown.Toggle>
            </div>
            {isOpen && (
              <Dropdown.Menu className="w-52 mt-2 ms-10 absolute right-0 shadow-xl z-50">
                <Dropdown.Item className="hover:bg-base-100 cursor-default my-1">
                  <h2 className="text-xl cursor-default">{handle}</h2>
                  <Button className="btn-sm text-sm btn-warning btn-outline"><ArrowPathIcon style={{ width: "20px" }} /></Button>
                </Dropdown.Item>
                <hr className="border-1 border-warning my-2" />
                <Link to={`/profile/${uid}`} as="div">
                  <Dropdown.Item>
                    <UserCircleIcon className="h-5 w-5 mr-2" />
                    <p>My profile</p>
                  </Dropdown.Item>
                </Link>
                <Link to={`/notifications/${uid}`}>
                  <Dropdown.Item>
                    <BellIcon className="h-5 w-5 mr-2" />
                    <p>Notifications</p>
                    {notificationCount > 0 && (
                      <Badge className="px-2 rounded-full bg-red-400">
                        {notificationCount}
                      </Badge>
                    )}
                  </Dropdown.Item>
                </Link>
                <Link to="/friend-list" as="div">
                  <Dropdown.Item>
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    <p>Friend List</p>
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

Navbar.propTypes = {
  toggleDrawer: PropTypes.func.isRequired,
};
