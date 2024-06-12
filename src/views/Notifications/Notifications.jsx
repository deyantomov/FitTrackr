import { useApp } from "../../hooks/useApp";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { Loading, Button } from "react-daisyui";
import { useToast } from "../../hooks/useToast";
import { toastTypes, toastMessages } from "../../common/constants";
import { HandRaisedIcon, HandThumbUpIcon } from "@heroicons/react/16/solid";

const {
  getExercisesByUserId,
  getUserById,
  acceptFriendRequest,
  markNotificationAsRead,
} = api;

export default function Notifications() {
  const app = useApp();
  const { id } = useParams();
  const { setToast } = useToast();
  const [notifications, setNotifications] = useState({});
  const [handles, setHandles] = useState({});
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchNotificationData = async () => {
      if (app.currentUser.id === id) {
        setLoading(true);
        const user = await getUserById(id);

        if (user) {
          setNotifications(user.notifications);

          const likesHandles = user.notifications && user.notifications.likes && user.notifications.likes.length > 0 ? await Promise.all(
            user.notifications.likes.map((like) => handleGetUser(like.from))
          ) : [];

          const friendRequestsHandles = user.notifications && user.notifications.friendRequests && user.notifications.friendRequests.length > 0 ? await Promise.all(
            user.notifications.friendRequests.map((request) => handleGetUser(request.from))
          ) : [];

          const allHandles = [...likesHandles, ...friendRequestsHandles];

          setHandles(
            allHandles.reduce(
              (obj, handle, i) => ({
                ...obj,
                [(i < likesHandles.length && user.notifications.likes[i])
                  ? user.notifications.likes[i].from
                  : (user.notifications.friendRequests[i] && user.notifications.friendRequests[i].from)]: handle,
              }),
              {}
            )
          );
        }

        setLoading(false);
      }
    };

    fetchNotificationData();
  }, [app, id]);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      const fetchedExercises = await getExercisesByUserId(app.currentUser.id);
      setExercises(fetchedExercises.data);
      setLoading(false);
    };
  
    fetchExercises();
  }, [app.currentUser.id]);

  async function handleGetUser(uid) {
    try {
      setLoading(true);

      const { handle } = await getUserById(uid);
      setLoading(false);
      
      return handle;
    } catch (err) {
      setToast({ type: toastTypes.ERROR, message: toastMessages.unableToGetUserData });
    }
  }

  const handleRemoveLikeNotification = async (postId, from) => {
    setLoading(true);
    const response = await markNotificationAsRead(app, postId, from);

    const updatedLikes = notifications.likes.filter(like => like.postId !== postId || like.from !== from);
  
    setNotifications({
      ...notifications,
      likes: updatedLikes,
    });
  
    setLoading(false);
  
    return response;
  };

  const handleRemoveRequestNotification = async (from) => {
    setLoading(true);
    const response = await acceptFriendRequest(app, from);

    const updatedRequests = notifications.friendRequests.filter(request => request.from !== from);
  
    setNotifications({
      ...notifications,
      friendRequests: updatedRequests,
    });

    setLoading(false);

    return response;
  };

  const getExercise = (exerciseId) => {
    const exercise = exercises.find(exercise => exercise["_id"] === exerciseId);

    return exercise;
  };

  useEffect(() => {
    console.log(handles);
  }, [handles]);

  if (loading) {
    return (
      <div className="flex w-full h-full justify-center align-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full justify-start items-center">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl md:text-4xl lg:text-5xl my-12">Likes</h2>
        {notifications && notifications.likes && notifications.likes.length > 0 ? (
          <ul className="space-y-4">
            {notifications.likes.map((like, index) => (
              <li key={index} className="border p-4 rounded-lg bg-gray-100 flex items-center justify-between transition-transform duration-200 ease-in-out transform hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="mr-4">
                    <HandThumbUpIcon className="text-blue-500 h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-semibold">{handles[like.from]}</span>
                    <div className="text-sm text-gray-500">{new Date(like.likedOn).toLocaleDateString("en-GB")}</div>
                    <div className="text-gray-700">{getExercise(like.postId) && getExercise(like.postId).title}</div>
                  </div>
                </div>
                <Button
                  className="mt-4 btn-ghost text-xs md:text-base"
                  onClick={() => handleRemoveLikeNotification(like.postId, like.from)}
                >
                  Mark as read
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex w-full text-center justify-center items-center bg-gray-100 p-6 py-12">
            Nothing to show here :\
          </div>
        )}
      </div>
      <div className="w-full max-w-3xl mt-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl my-12">Friend requests</h2>
        {notifications && notifications.friendRequests && notifications.friendRequests.length > 0 ? (
          <ul className="space-y-4">
            {notifications.friendRequests.map((request, index) => (
              <li key={index} className="border p-4 rounded-lg bg-gray-100 flex items-center justify-between transition-transform duration-200 ease-in-out transform hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="mr-4">
                    <HandRaisedIcon className="text-green-500 h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-semibold">{handles[request.from]}</span>
                    <div className="text-sm text-gray-500">{new Date(request.sentOn).toLocaleDateString("en-GB")}</div>
                  </div>
                </div>
                <Button
                  className="btn-ghost"
                  onClick={() => handleRemoveRequestNotification(request.from)}
                >
                  Accept
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex w-full text-center justify-center items-center bg-gray-100 p-6 py-12">
            Nothing to show here :\
          </div>
        )}
      </div>
    </div>
  );

}
