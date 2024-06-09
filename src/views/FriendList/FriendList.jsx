import api from "../../api/api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../hooks/useApp";
import { Loading, Card } from "react-daisyui";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ProfilePic from "../../components/ProfilePic/ProfilePic";
import { useToast } from "../../hooks/useToast";
import { toastTypes, toastMessages } from "../../common/constants";

const { getFriendList, getUserById, getProfilePic } = api;

function FriendList() {
  const app = useApp();
  const { setToast } = useToast();
  const [friendList, setFriendList] = useState([]);
  const [friendData, setFriendData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFriendList = async () => {
      setLoading(true);
      try {
        const { friendList } = await getFriendList(app);
        if (!friendList) {
          // setToast({ type: toastTypes.ERROR, message: toastMessages.unableToGetFriendList });
          return;
        }

        setFriendList(friendList);

        return friendList;
      } catch (err) {
        setToast({ type: toastTypes.ERROR, message: toastMessages.unableToGetFriendList });
      } finally {
        setLoading(false);
      }
    };

    fetchFriendList();
  }, [app]);

  useEffect(() => {
    const fetchUserDataWithProfilePic = async () => {
      setLoading(true);
  
      try {
        const promises = friendList.map(async (friend) => {
          const user = await getUserById(friend.uid);
          const profilePic = (await getProfilePic(user.profilePic))["img"];
          return { ...user, profilePic };
        });
        const usersWithProfilePic = await Promise.all(promises);
  
        setFriendData(usersWithProfilePic);
      } catch(err) {
        setToast({ type: toastTypes.ERROR, message: toastMessages.unableToGetUserData });
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserDataWithProfilePic();
  }, [friendList]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center align-center items-center">
        <Loading />
      </div>
    );
  }


  return(
    <div className="w-full h-full flex flex-col p-8">
      {friendData.length > 0 ? (
        <>
          <h1 className="font-light text-5xl mb-4">Friend List:</h1>
          {friendData.map((user, index) => {
            return (
              <Card className="bg-base-200 p-4 my-2 w-full" key={index}>
                <div className="flex flex-row gap-4 items-center">
                  <div className="flex flex-row justify-start align-start gap-4 w-full">
                    <ProfilePic
                      profilePic={user.profilePic}
                      dimensions="96px"
                      className="ms-4"
                    />
                    <Card.Title className="mb-4">{user.handle}</Card.Title>
                  </div>
                </div>
                <Card.Body className="text-lg m-0 p-0 mt-4 flex flex-row justify-center align-center items-center w-full">
                  <Link to={`/profile/${user.uid}`} className="flex flex-row">
                    <ChevronDownIcon style={{ width: "24px" }} />
                    <span>View full profile</span>
                  </Link>
                </Card.Body>
              </Card>
            );
          })}
        </>
      ) : (
        <div className="w-full h-full flex justify-center align-center items-center">
          <h1 className="text-5xl">No friends yet!</h1>
        </div>
      )}
    </div>
  );
}

export default FriendList;