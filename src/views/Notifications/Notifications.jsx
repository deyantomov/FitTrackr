import { useApp } from "../../hooks/useApp";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getExercisesByUserId, getUserById } from "../../api/api";
import { Card, Loading, Table } from "react-daisyui";
import { HeartIcon } from "@heroicons/react/24/outline";

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

          const allHandles = await Promise.all(
            user.notifications.likes.map((like) => handleGetUser(like.from))
          );
          setHandles(
            allHandles.reduce(
              (obj, handle, i) => ({
                ...obj,
                [user.notifications.likes[i].from]: handle,
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

  // useEffect(() => {
  //   console.log(handles);
  // }, [handles])

  async function handleGetUser(uid) {
    const user = await getUserById(uid);

    return user.handle;
  }

  if (loading) {
    return (
      <div className="flex w-full h-full justify-center align-center items-center">
        <Loading />
      </div>
    );
  }

  async function handleGetExercise(postId) {
    const post = await getExercisesByUserId();
  }

  return (
    <div className="flex flex-col w-full h-full justify-start align-center items-center">
      <h2 className="text-5xl my-12">Likes</h2>
      <div className="overflow-x-auto w-full flex justify-center align-center">
        <Table className="text-2xl">
          <Table.Head className="odd:bg-gray-200">
            <span style={{ padding: "12px 24px" }}>User Handle</span>
            <span style={{ padding: "12px 24px" }}>Exercise ID</span>
            <span style={{ padding: "12px 24px" }}>Date</span>
          </Table.Head>

          <Table.Body>
            {notifications &&
              notifications.likes &&
              notifications.likes.map((like, index) => (
                <Table.Row key={index} className="even:bg-gray-200">
                  <span style={{ padding: "12px 24px" }}>
                    {handles[like.from]}
                  </span>
                  <span style={{ padding: "12px 24px" }}>
                    {notifications.likes[index].postId}
                  </span>
                  <span style={{ padding: "12px 24px" }}>
                    {new Date(
                      notifications.likes[index].likedOn
                    ).toLocaleDateString("en-GB")}
                  </span>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
      <hr className="border-t-2 border-warning w-3/6 mt-12"/>
      <h2 className="text-5xl my-12">Friend requests</h2>
    </div>
  );
}
