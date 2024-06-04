import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAllUsers,
  getAllExercises,
  getProfilePic,
  getExerciseImage,
  sendFriendRequest,
  getUserById,
} from "../../api/api";
import { Card, Loading, Button } from "react-daisyui";
import { useApp } from "../../hooks/useApp";
import ProfilePic from "../../components/ProfilePic/ProfilePic";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function SearchResults() {
  const app = useApp();
  const params = useParams();
  const [users, setUsers] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = params.query;

    const fetchUserData = async () => {
      setLoading(true);
      const allUsers = await getAllUsers();
      const matchingUsers = allUsers.filter((user) =>
        user.handle.includes(q.toLowerCase())
      );

      const usersWithProfilePic = await Promise.all(
        matchingUsers.map(async (user) => {
          const profilePic = (await getProfilePic(user.profilePic))["img"];

          return { ...user, profilePic };
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
          const img = await getExerciseImage(exercise.img);

          if (img) {
            const pic = img["img"];
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
    if (app.currentUser) {
      setLoading(true);
      const response = await sendFriendRequest(app, to);

      setLoading(false);
      return response;
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
                      profilePic={user.profilePic}
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
                          (currentUserData.friendList.some(
                            (friend) => friend.uid === user.uid
                          ) ||
                            currentUserData.notifications.friendRequests.some(
                              (request) => request.from === user.uid
                            ))
                            ? "btn-disabled"
                            : ""
                        }`}
                        onClick={() => {
                          if (
                            currentUserData &&
                            !currentUserData.friendList.some(
                              (friend) => friend.uid === user.uid
                            ) &&
                            !currentUserData.notifications.friendRequests.some(
                              (request) => request.from === user.uid
                            )
                          ) {
                            handleSendFriendRequest(user.uid);
                          }
                        }}
                        disabled={
                          currentUserData &&
                          (currentUserData.friendList.some(
                            (friend) => friend.uid === user.uid
                          ) ||
                            currentUserData.notifications.friendRequests.some(
                              (request) => request.from === user.uid
                            ))
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
                  <Link to={"/home"} className="flex flex-row">
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
