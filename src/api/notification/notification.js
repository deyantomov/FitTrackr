import { buildUrl } from "../index";
import { endpoints } from "../endpoints";

export const sendFriendRequest = async (app, to) => {
  const url = buildUrl(endpoints.users);
  const { currentUser } = app;

  if (currentUser) {
    const response = await fetch(`${url}/send_friend_request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
      body: JSON.stringify({
        to,
        from: currentUser.id,
      }),
    });

    return response.json();
  }
};

export const acceptFriendRequest = async (app, from) => {
  const url = buildUrl(endpoints.users);
  const { currentUser } = app;

  if (currentUser) {
    const response = await fetch(`${url}/accept_friend_request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
      body: JSON.stringify({
        to: currentUser.id,
        from,
      }),
    });

    return response.json();
  }
};

export const markNotificationAsRead = async (app, exerciseId, from) => {
  const url = buildUrl(endpoints.notifications);
  const { currentUser } = app;

  if (currentUser) {
    const response = await fetch(
      `${url}/mark_as_read?id=${exerciseId}&uid=${currentUser.id}&from=${from}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      }
    );

    return response.json();
  }
};