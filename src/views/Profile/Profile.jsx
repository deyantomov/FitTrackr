import { useEffect } from "react";
import { getProfilePic, getUserById, updateUserProfile } from "../../api/api";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../../hooks/useApp";
import ProfilePic from "../../components/ProfilePic/ProfilePic";
import { imageToBase64 } from "../../common/utils";
import { Card, Button, Input, Badge, Modal, Loading } from "react-daisyui";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function Profile() {
  const app = useApp();
  const params = useParams();
  const [user, setUser] = useState({});
  const [userPic, setUserPic] = useState("");

  const [currentUser, setCurrentUser] = useState({});

  const [newUserInfo, setNewUserInfo] = useState({});
  const [newProfilePic, setNewProfilePic] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const profile = await getUserById(params.id);
      setUser(profile);

      const profilePic = await getProfilePic(app, profile.profilePic);
      setUserPic(profilePic.img);
    };

    const getCurrentUser = async () => {
      setCurrentUser(await getUserById(app.currentUser.id));
    }

    getProfile();
    getCurrentUser();

    setLoading(false);
  }, []);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      Object.keys(newUserInfo).forEach((key) => {
        if (!newUserInfo[key]) {
          delete newUserInfo[key];
        }
      });

      await updateUserProfile(
        app,
        user.uid,
        newUserInfo,
        user.email,
        newUserInfo.oldPassword
      );
    } catch (err) {
      console.error(err);
    } finally {
      const profile = await getUserById(params.id);
      setUser(profile);

      const profilePic = await getProfilePic(app, profile.profilePic);
      setUserPic(profilePic.img);

      setLoading(false);
    }
  };

  const handleSelectProfilePic = async (e) => {
    e.preventDefault();
    setLoading(true);

    const file = e.target.files[0];

    if (file) {
      try {
        const img = await imageToBase64(file);
        setNewProfilePic(img);
      } catch (err) {
        console.error(err);
      }
    }

    setLoading(false);
  };

  const handleUpdateProfilePic = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (newProfilePic) {
      try {
        const newUserInfo = { profilePic: newProfilePic };

        await updateUserProfile(
          app,
          user.uid,
          newUserInfo,
          user.email,
          password
        );

        setUserPic(newProfilePic);
        setIsOpen(false);
      } catch (err) {
        console.error(err);
      }
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loading />
      </div>
    )
  }

  return (
    <div className="flex flex-row w-full h-full justify-center align-center items-center p-2">
      <Card className="bg-white p-12 shadow-xl">
        <div className="flex flex-row gap-0 items-start w-full h-full align-center items-start">
          <div className="flex flex-col justify-center align-center items-center">
            <div className="relative">
              <ProfilePic
                profilePic={userPic}
                dimensions="96px"
                className="flex-shrink-0 me-8"
              />
              {currentUser.uid === user.uid && (
                <div className="relative flex flex-row justify-center align-center items-center">
                  <div
                    className="absolute bottom-1 right-7 bg-blue-500 text-white text-sm rounded-full h-8 w-8 flex items-center justify-center"
                    style={{ transform: "translate(0%, 0%)" }}
                  >
                    <PlusIcon className="absolute max-w-4" />
                    <Input
                      type="file"
                      className="absolute opacity-0 w-full h-full cursor-pointer"
                      onChange={handleSelectProfilePic}
                    />
                  </div>
                </div>
              )}
              {newProfilePic && (
                <Button
                  className="btn-warning btn-outline mt-5 w-full"
                  onClick={() => setIsOpen(true)}
                >
                  Upload
                </Button>
              )}
              <Modal
                open={isOpen}
                className="p-4 mt-2 bg-white text-black"
              >
                <h2 className="text-xl mb-4">Enter Password</h2>
                <Input
                  type="password"
                  size="sm"
                  value={password}
                  className="bg-white border border-2 border-black"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex flex-row w-full justify-center align-center items-center gap-6 mt-4">
                <Button className="btn-success" onClick={handleUpdateProfilePic}>Submit</Button>
                <Button className="btn-error" onClick={() => {
                  setIsOpen(false);
                  setPassword('');
                }}>Close</Button>
                </div>
              </Modal>
            </div>
          </div>
          <div className="flex flex-col w-full h-auto gap-0">
            <Card.Title className="text-gray-500 opacity-70 mt- mb-0 p-0">
              @{user.handle}
            </Card.Title>
            <Card.Body className="p-0 flex flex-row gap-1 w-16 text-black text-lg">
              <p>{user.firstName && user.firstName}</p>
              <p>{user.lastName && user.lastName}</p>
            </Card.Body>
            <div className="w-32 text-sm text-center mt-1">
              <Badge className="badge-info rounded-full text-white">
                {user.phoneNumber && user.phoneNumber}
              </Badge>
            </div>
          </div>
        </div>
        <hr className="border border-t-1 border-t-gray my-6" />
        {(currentUser && currentUser.uid === user.uid) && (
          <div className="grid grid-rows-1 text-center align-center place-items-center justify-center text-black bg-gray-100 p-8 h-auto ">
            <h2 className="text-2xl mb-2">Update your profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-2 text-start md:gap-2 w-full">
              <label className="text-base mb-2">
                First Name
                <Input
                  size={"sm"}
                  type="text"
                  onChange={(e) =>
                    setNewUserInfo({
                      ...newUserInfo,
                      firstName: e.target.value,
                    })
                  }
                  className="bg-white w-full"
                ></Input>
              </label>
              <label className="text-base mb-2">
                Last Name
                <Input
                  size={"sm"}
                  type="text"
                  onChange={(e) =>
                    setNewUserInfo({ ...newUserInfo, lastName: e.target.value })
                  }
                  className="bg-white w-full"
                ></Input>
              </label>
            </div>
            <div className="grid grid-cols-1 w-full h-auto">
              <label className="text-base md:mb-2 text-start m-0">
                Phone Number
                <Input
                  size={"sm"}
                  type="text"
                  onChange={(e) =>
                    setNewUserInfo({ ...newUserInfo, phoneNumber: e.target.value })
                  }
                  className="bg-white w-full"
                ></Input>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 md:mt-2 text-start gap-2 w-full">
              <label className="text-base mb-2">
                Age
                <Input
                  size={"sm"}
                  type="number"
                  onChange={(e) =>
                    setNewUserInfo({ ...newUserInfo, age: e.target.value })
                  }
                  className="bg-white w-full"
                ></Input>
              </label>
              <label className="text-base mb-2">
                Weight
                <Input
                  size={"sm"}
                  type="number"
                  onChange={(e) =>
                    setNewUserInfo({ ...newUserInfo, weight: e.target.value })
                  }
                  className="bg-white w-full"
                ></Input>
              </label>
              <label className="text-base md:mb-2">
                Height
                <Input
                  size={"sm"}
                  type="number"
                  onChange={(e) =>
                    setNewUserInfo({ ...newUserInfo, height: e.target.value })
                  }
                  className="bg-white w-full"
                ></Input>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:mt-2 text-start gap-2 w-full">
              <label className="text-base mb-2">
                Type your password
                <Input
                  size={"sm"}
                  type="password"
                  onChange={(e) =>
                    setNewUserInfo({
                      ...newUserInfo,
                      newPassword: e.target.value,
                    })
                  }
                  className="bg-white w-full"
                ></Input>
              </label>
              <label className="text-base mb-2">
                Confirm your password
                <Input
                  size={"sm"}
                  type="password"
                  onChange={(e) =>
                    setNewUserInfo({
                      ...newUserInfo,
                      oldPassword: e.target.value,
                    })
                  }
                  className="bg-white w-full"
                ></Input>
              </label>
            </div>
            <Button className="btn-warning w-2/6 my-4" onClick={handleUpdate}>
              Update profile
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
