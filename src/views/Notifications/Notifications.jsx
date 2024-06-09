import { useApp } from "../../hooks/useApp";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { Loading, Table, Button } from "react-daisyui";
import { useToast } from "../../hooks/useToast";
import { toastTypes, toastMessages } from "../../common/constants";

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

          const likesHandles = user.notifications && user.notifications.likes ? await Promise.all(
            user.notifications.likes.map((like) => handleGetUser(like.from))
          ) : [];

          const friendRequestsHandles = user.notifications && user.notifications.friendRequests ? await Promise.all(
            user.notifications.friendRequests.map((request) => 
              handleGetUser(request.from)
            )
          ) : [];

          const allHandles = [...likesHandles, ...friendRequestsHandles];
          console.log(allHandles)

          setHandles(
            allHandles.reduce(
              (obj, handle, i) => ({
                ...obj,
                [i < likesHandles.length
                  ? user.notifications.likes[i].from
                  : user.notifications.friendRequests[i].from]: handle,
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
    <div className="flex flex-col w-full h-full justify-start align-center items-center py-12">
      <h2 className="text-3xl md:text-4xl lg:text-5xl mb-12">Likes</h2>
      <div className="overflow-auto w-full flex justify-center align-center">
        <Table className="text-xs md:text-xl lg:text-2xl w-full">
          {notifications.likes && notifications.likes.length > 0 && (
            <Table.Head className="invisible md:visible odd:bg-base-200">
              <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4">
                User Handle
              </span>
              <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4">
                Exercise
              </span>
              <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4">
                Date
              </span>
              <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4">
                Action
              </span>
            </Table.Head>
          )}

          <Table.Body className="w-full">
            {notifications.likes && notifications.likes.length > 0 ? (
              notifications.likes.map((like, index) => (
                <Table.Row
                  key={index}
                  className="even:bg-base-200 w-full text-center"
                >
                  <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-4 xl:px-8 xl:py-6 text-center">
                    {handles[like.from]}
                  </span>
                  <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-4 xl:px-8 xl:py-6 text-center">
                    {exercises && exercises.length > 0 && getExercise(notifications.likes[index].postId) && getExercise(notifications.likes[index].postId)["title"]}
                  </span>
                  <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-4 xl:px-8 xl:py-6 text-center">
                    {new Date(
                      notifications.likes[index].likedOn
                    ).toLocaleDateString("en-GB")}
                  </span>
                  <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-4 xl:px-8 xl:py-6 text-center">
                    <Button
                      className="btn-ghost text-xs md:text-xl"
                      onClick={() =>
                        handleRemoveLikeNotification(like.postId, like.from)
                      }
                    >
                      Mark as read
                    </Button>
                  </span>
                </Table.Row>
              ))
            ) : (
              <div className="flex w-full text-center justify-center align-center items-center bg-base-200 p-6 py-12">
                Nothing to show here :\
              </div>
            )}
          </Table.Body>
        </Table>
      </div>
      <h2 className="text-5xl my-12">Friend requests</h2>
      <div className="overflow-auto w-full flex justify-center align-center">
        <Table className="text-xs md:text-xl lg:text-2xl w-full">
          {notifications.friendRequests && notifications.friendRequests.length > 0 && (
            <Table.Head className="invisible md:visible odd:bg-base-200">
              <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4">User Handle</span>
              <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4">Date</span>
              <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4">Action</span>
            </Table.Head>
          )}

          <Table.Body className="w-full">
            {notifications.friendRequests && notifications.friendRequests.length > 0 ? (
              notifications.friendRequests.map((request, index) => (
                <Table.Row key={index} className="even:bg-base-200">
                  <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4">
                    {handles[request.from]}
                  </span>
                  <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4">
                    {new Date(request.sentOn).toLocaleDateString("en-US")}
                  </span>
                  <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4">
                    <Button
                      className="btn-ghost"
                      onClick={() => handleRemoveRequestNotification(request.from)}
                    >
                      Accept
                    </Button>
                  </span>
                </Table.Row>
              ))
            ) : (
              <div className="flex w-full text-center justify-center align-center items-center bg-base-200 p-6 py-12">
                Nothing to show here :\
              </div>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
