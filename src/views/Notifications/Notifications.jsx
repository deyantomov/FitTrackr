import { useApp } from "../../hooks/useApp";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getExercisesByUserId,
  getUserById,
  acceptFriendRequest,
  markNotificationAsRead,
} from "../../api/api";
import { Loading, Table, Button } from "react-daisyui";

export default function Notifications() {
  const app = useApp();
  const { id } = useParams();
  const [notifications, setNotifications] = useState({});
  const [handles, setHandles] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotificationData = async () => {
      if (app.currentUser.id === id) {
        setLoading(true);
        const user = await getUserById(id);

        if (user) {
          setNotifications(user.notifications);

          const likesHandles = await Promise.all(
            user.notifications.likes.map((like) => handleGetUser(like.from))
          );

          const friendRequestsHandles = await Promise.all(
            user.notifications.friendRequests.map((request) =>
              handleGetUser(request.from)
            )
          );

          const allHandles = [...likesHandles, ...friendRequestsHandles];

          setHandles(
            allHandles.reduce(
              (obj, handle, i) => ({
                ...obj,
                [i < likesHandles.length
                  ? user.notifications.likes[i].from
                  : user.notifications.friendRequests[i - likesHandles.length].from]: handle,
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
    
  })

  async function handleGetUser(uid) {
    setLoading(true);
    const user = await getUserById(uid);

    setLoading(false);
    
    return user.handle;
  }

  //  TODO: Get each exercise by id and link to exercise id in the table
  async function handleGetExercise(postId) {
    // const post = await getExercisesByUserId();
  }

  const handleRemoveNotification = async (exerciseId, from) => {
    setLoading(true);
    const response = await markNotificationAsRead(app, exerciseId, from);

    setLoading(false);

    return response;
  };

  if (loading) {
    return (
      <div className="flex w-full h-full justify-center align-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full justify-start align-center items-center">
      <h2 className="text-3xl md:text-4xl lg:text-5xl my-12">Likes</h2>
      <div className="overflow-auto w-full flex justify-center align-center">
        <Table className="text-xs md:text-xl lg:text-2xl">
          {notifications.likes && notifications.likes.length > 0 && (
            <Table.Head className="invisible md:visible odd:bg-gray-200">
              <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4 overflow-hidden overflow-ellipsis whitespace-nowrap break-words">
                User Handle
              </span>
              <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4 overflow-hidden overflow-ellipsis whitespace-nowrap break-words">
                Exercise ID
              </span>
              <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4 overflow-hidden overflow-ellipsis whitespace-nowrap break-words">
                Date
              </span>
              <span className="px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4 overflow-hidden overflow-ellipsis whitespace-nowrap break-words">
                Action
              </span>
            </Table.Head>
          )}

          <Table.Body className="w-full">
            {notifications.likes && notifications.likes.length > 0 ? (
              notifications.likes.map((like, index) => (
                <Table.Row
                  key={index}
                  className="flex flex-col sm:table-row even:bg-gray-200 justify-center align-center items-center w-full"
                >
                  <span className="block sm:table-cell w-full px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4 overflow-hidden overflow-ellipsis whitespace-nowrap break-words">
                    {handles[like.from]}
                  </span>
                  <span className="block sm:table-cell w-full px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4 overflow-hidden overflow-ellipsis whitespace-nowrap break-words">
                    {notifications.likes[index].postId}
                  </span>
                  <span className="block sm:table-cell w-full px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4 overflow-hidden overflow-ellipsis whitespace-nowrap break-words">
                    {new Date(
                      notifications.likes[index].likedOn
                    ).toLocaleDateString("en-GB")}
                  </span>
                  <span className="block sm:table-cell w-full px-0 py-3 sm:px-0 sm:py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 xl:px-8 xl:py-4 overflow-hidden overflow-ellipsis whitespace-nowrap break-words">
                    <Button
                      className="btn-ghost text-xs md:text-xl"
                      onClick={() =>
                        handleRemoveNotification(like.postId, like.from)
                      }
                    >
                      Mark as read
                    </Button>
                  </span>
                </Table.Row>
              ))
            ) : (
              <div className="flex w-full text-center justify-center align-center items-center bg-gray-100 p-6 py-12">
                Nothing to show here :\
              </div>
            )}
          </Table.Body>
        </Table>
      </div>
      <h2 className="text-5xl my-12">Friend requests</h2>
      <div className="overflow-auto w-full flex justify-center align-center">
        <Table className="text-xs md:text-xl lg:text-2xl">
          {notifications.friendRequests && notifications.friendRequests.length > 0 && (
            <Table.Head className="invisible md:visible odd:bg-gray-200">
              <span style={{ padding: "12px 24px" }}>User Handle</span>
              <span style={{ padding: "12px 24px" }}>Date</span>
              <span style={{ padding: "12px 24px" }}>Action</span>
            </Table.Head>
          )}

          <Table.Body className="w-full">
            {notifications.friendRequests && notifications.friendRequests.length > 0 ? (
              notifications.friendRequests.map((request, index) => (
                <Table.Row key={index} className="even:bg-gray-200">
                  <span style={{ padding: "12px 24px" }}>
                    {handles[request.from]}
                  </span>
                  <span style={{ padding: "12px 24px" }}>
                    {new Date(request.sentOn).toLocaleDateString("en-GB")}
                  </span>
                  <span style={{ padding: "12px 24px" }}>
                    <Button
                      className="btn-ghost"
                      onClick={() => acceptFriendRequest(app, request.from)}
                    >
                      Accept
                    </Button>
                  </span>
                </Table.Row>
              ))
            ) : (
              <div className="flex w-full text-center justify-center align-center items-center bg-gray-100 p-6 py-12">
                Nothing to show here :\
              </div>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
