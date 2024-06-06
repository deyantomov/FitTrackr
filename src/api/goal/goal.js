import { buildUrl } from "../index";
import { endpoints } from "../endpoints";
import { getUserById } from "../user/user";

/**
 * Creates a new goal with the given info, and adds it to the db
 *
 * @param {Realm.App} app
 * @param {object} goal
 */
export const createNewGoal = async (app, goal) => {
  if (Object.keys(goal).length === 0) {
    throw new Error("Goal object cannot be empty!");
  }

  const url = buildUrl(endpoints.goal);
  const currentUser = app.currentUser;

  if (currentUser) {
    const user = await getUserById(currentUser.id);

    const response = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
      body: JSON.stringify({
        owner: user.uid,
        title: goal.title,
        type: goal.type, // "steps" || "calories" || "distance"
        period: goal.period, // "daily" || "weekly" || "monthly"
        target: goal.target,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create goal");
    }

    return response.json();
  } else {
    throw new Error("User is not authenticated!");
  }
};

export const getAllGoals = async (app) => {
  if (app.currentUser) {
    const url = buildUrl(endpoints.goal);
    const user = await getUserById(app.currentUser.id);
    
    const response = await fetch(`${url}?uid=${user.uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${app.currentUser.accessToken}`,
      },
    });

    return response.json();
  }
};

export const removeGoal = async (app, goalId) => {
  const url = buildUrl(endpoints.goal);
  const { currentUser } = app;

  if (currentUser) {
    const response = await fetch(`${url}/remove?id=${goalId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
    });

    return response.json();
  }
};