import { buildUrl } from "../index";
import { endpoints } from "../endpoints";

export const updateWeeklyStreak = async (app) => {
  const url = buildUrl(endpoints.users);
  const user = app.currentUser;

  if (user) {
    const response = await fetch(
      `${url}/update_weekly_streak?uid=${app.currentUser.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );

    return response;
  }
};

export const updateSteps = async (app, steps) => {
  const url = buildUrl(endpoints.users);
  const user = app.currentUser;

  if (user) {
    const stepsResponse = await fetch(
      `${url}/update_steps?uid=${app.currentUser.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          steps,
        }),
      }
    );

    const weeklyStreakResponse = await updateWeeklyStreak(app);

    return [stepsResponse, weeklyStreakResponse];
  }
};

export const updateCalories = async (app, calories) => {
  const url = buildUrl(endpoints.users);
  const user = app.currentUser;

  if (user) {
    const caloriesResponse = await fetch(
      `${url}/update_calories?uid=${app.currentUser.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          calories,
        }),
      }
    );

    const weeklyStreakResponse = await updateWeeklyStreak(app);

    return [caloriesResponse, weeklyStreakResponse];
  }
};

export const updateDistance = async (app, distance) => {
  const url = buildUrl(endpoints.users);
  const user = app.currentUser;

  if (user) {
    const distanceResponse = await fetch(
      `${url}/update_distance?uid=${app.currentUser.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          distance,
        }),
      }
    );

    const weeklyStreakResponse = await updateWeeklyStreak(app);

    return [distanceResponse, weeklyStreakResponse];
  }
};