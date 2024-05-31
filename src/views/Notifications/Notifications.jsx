import { useApp } from "../../hooks/useApp";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById } from "../../api/api";

export default function Notifications() {
  const app = useApp();
  const { id } = useParams();
  const [notifications, setNotifications] = useState({});
  
  useEffect(() => {
    const fetchNotificationData = async () => {
      if (app.currentUser.id === id) {
        const user = await getUserById(id);

        if (user) {
          setNotifications(user.notifications);
        }
      }
    }

    fetchNotificationData();
  }, [app, id]);

  return (
    <div className="w-full h-full">
      {console.log(notifications)}
    </div>
  )
}