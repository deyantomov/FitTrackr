import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import { Card, Loading, Button } from "react-daisyui";
import { useApp } from "../../hooks/useApp";
import ProfilePic from "../../components/ProfilePic/ProfilePic";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { toastTypes, toastMessages } from "../../common/constants";

const {
  getAllUsers,
  getAllExercises,
  getProfilePic,
  getExerciseImage,
  sendFriendRequest,
  getUserById,
} = api;

export default function SearchResults() {
  const app = useApp();
  const params = useParams();
  const { setToast } = useToast();
  const [users, setUsers] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = params.query;

    const fetchUserData = async () => {
      setLoading(true);
      const allUsers = await getAllUsers();
      const matchingUsers = allUsers.filter((user) => {
        if (user && user.handle) {
          return user.handle.includes(q.toLowerCase());
        }
      });

      const usersWithProfilePic = await Promise.all(
        matchingUsers.map(async (user) => {
          const profilePic = (await getProfilePic(user.profilePic))["img"];

          if (profilePic) {
            return { ...user, profilePic };
          } else {
            return user;
          }
        })
      );

      if (usersWithProfilePic) {
        setUsers(usersWithProfilePic);
      }

      setLoading(false);
    };

    const fetchExerciseData = async () => {
      setLoading(true);

      const allExercises = await getAllExercises();
      const matchingExercises = allExercises.data.filter(
        (exercise) =>
          exercise.title.includes(q || q.toLowerCase()) ||
          exercise.description.includes(q || q.toLowerCase())
      );

      const exercisesWithImage = await Promise.all(
        matchingExercises.map(async (exercise) => {
          const exerciseImg = await getExerciseImage(exercise.img);

          if (exerciseImg) {
            const pic = exerciseImg["img"];
            return { ...exercise, pic };
          }

          return exercise;
        })
      );

      if (exercisesWithImage) {
        setExercises(exercisesWithImage);
      }

      setLoading(false);
    };

    fetchUserData();
    fetchExerciseData();
  }, [params]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setLoading(true);
      
      const user = await getUserById(app.currentUser.id);
      setCurrentUserData(user);
      
      setLoading(false);
    };

    fetchCurrentUser();
  }, [app]);

  const handleSendFriendRequest = async (to) => {
    try {
      if (app.currentUser) {
        const response = await sendFriendRequest(app, to);

        setToast({ type: toastTypes.SUCCESS, message: toastMessages.successfulFriendRequest });

        return response;
      }
    } catch (err) {
      setToast({ type: toastTypes.ERROR, message: toastMessages.unsuccessfulFriendRequest });
    } finally {
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center align-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center align-center items-center p-6">
      <div className="w-full h-full flex flex-col align-center items-center">
        <h2 className="mb-8 mt-4">Users:</h2>
        {users &&
          users.map((user, index) => {
            return (
              <Card className="bg-base-200 p-4 my-2 w-full" key={index}>
                <div className="flex flex-row gap-4 items-center">
                  <div className="flex flex-row justify-start align-start gap-4 w-full">
                    <ProfilePic
                      profilePic={user.profilePic ? user.profilePic : null}
                      dimensions="96px"
                      className="ms-4"
                    />
                    <Card.Title className="mb-4">{user.handle}</Card.Title>
                  </div>
                  <div className="flex flex-row justify-end align-end items-center">
                    {app.currentUser && app.currentUser.id !== user.uid && (
                      <Button
                        className={`me-4 btn-warning ${
                          currentUserData && 
                        ((currentUserData.friendList &&
                          currentUserData.friendList.some((friend) => friend.uid === user.uid)) ||
                        (currentUserData.notifications &&
                          currentUserData.notifications.friendRequests &&
                          currentUserData.notifications.friendRequests.some(
                            (request) => request.from === user.uid
                          )))
                            ? "btn-disabled"
                            : ""
                        }`}
                        onClick={() => {
                          if (
                            currentUserData &&
                          (!(currentUserData.friendList &&
                            currentUserData.friendList.some((friend) => friend.uid === user.uid)) &&
                          !(currentUserData.notifications &&
                            currentUserData.notifications.friendRequests &&
                            currentUserData.notifications.friendRequests.some(
                              (request) => request.from === user.uid
                            )))
                          ) {
                            handleSendFriendRequest(user.uid);
                          }
                        }}
                        disabled={
                          currentUserData && 
                        ((currentUserData.friendList &&
                          currentUserData.friendList.some((friend) => friend.uid === user.uid)) ||
                        (currentUserData.notifications &&
                          currentUserData.notifications.friendRequests &&
                          currentUserData.notifications.friendRequests.some(
                            (request) => request.from === user.uid
                          )))
                        }
                      >
                      Add friend
                      </Button>
                    )}
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
        <hr className="border-t-1 border-t-warning my-12 w-3/6" />
        <h2 className="mb-8">Exercises:</h2>
        {exercises &&
          exercises.map((exercise, index) => {
            return (
              <Card className="bg-base-200 p-4 my-2 w-full" key={index}>
                <div className="flex flex-row gap-4">
                  <ProfilePic
                    profilePic={exercise.pic && exercise.pic}
                    dimensions="96px"
                    className="ms-4"
                  />
                  <Card.Title className="mb-4">{exercise.title}</Card.Title>
                </div>
                <Card.Body className="text-lg m-0 p-0 mt-4 flex flex-row justify-center align-center items-center w-full">
                  <Link to={`/exercises/${exercise["_id"]}`} className="flex flex-row">
                    <ChevronDownIcon style={{ width: "24px" }} />
                    <span>View full exercise</span>
                  </Link>
                </Card.Body>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
