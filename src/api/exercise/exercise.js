import { buildUrl } from "../index";
import { endpoints } from "../endpoints";
import { getUserById } from "../user/user";

/**
 * Creates a new exercise with the given info, and adds it to the db
 *
 * @param {Realm.App} app
 * @param {object} exercise
 */
export const createNewExercise = async (app, exercise) => {
  if (Object.keys(exercise) === 0) {
    throw new Error("Exercise object cannot be empty!");
  }

  const url = buildUrl(endpoints.exercise);
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
        ownerHandle: user.handle,
        title: exercise.title,
        description: exercise.description,
        img: exercise.img,
        level: exercise.level.toLowerCase(),
        duration: exercise.duration,
        rating: 0,
        isPrivate: exercise.isPrivate,
        createdOn: new Date(),
      }),
    });

    return response.json();
  }
};

export const updateExercise = async (app, exercise) => {
  if (Object.keys(exercise) === 0) {
    throw new Error("Exercise object cannot be empty!");
  }

  const url = buildUrl(endpoints.exercise);
  const currentUser = app.currentUser;

  if (currentUser) {
    const { uid, handle } = await getUserById(currentUser.id);

    const response = await fetch(
      `${url}/update?id=${exercise.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
        body: JSON.stringify({
          owner: uid,
          ownerHandle: handle,
          title: exercise.title,
          description: exercise.description,
          img: exercise.img,
          level: exercise.level.toLowerCase(),
          duration: exercise.duration,
          rating: 0,
          isPrivate: exercise.isPrivate,
        }),
      }
    );

    return response.json();
  }
};

export const removeExercise = async (app, exerciseId) => {
  const url = buildUrl(endpoints.exercise);
  const currentUser = app.currentUser;

  if (currentUser) {
    const response = await fetch(`${url}/remove?id=${exerciseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
    });

    return response.json();
  }
};

export const getAllExercises = async (page = 1) => {
  const url = buildUrl(endpoints.exercise);

  const response = await fetch(`${url}?page=${page}`);
  return response.json();
};

export const getExercisesByUserId = async (uid, page = 1) => {
  const url = buildUrl(endpoints.exercise);
  const response = await fetch(
    `${url}?uid=${uid}&page=${page}`
  );
  return response.json();
};

export const getExercisesByDifficulty = async (difficulty, page = 1) => {
  //  Difficulty - "Beginner" | "Intermediate" | "Pro"
  const url = buildUrl(endpoints.exercise);

  const response = await fetch(
    `${url}?level=${difficulty}&page=${page}`
  );
  return response.json();
};

export const sortExercisesByRating = async (rating, page = 1) => {
  //  Rating = "lowest" | "highest"
  const url = buildUrl(endpoints.exercise);
  
  const response = await fetch(
    `${url}?rating=${rating}&page=${page}`
  );
  return response.json();
};

export const getExerciseImage = async (id) => {
  if (id) {
    const url = buildUrl(endpoints.exercise);
    
    const response = await fetch(`${url}/image?id=${id}`);
    return response.json();
  }
};

export const likeExercise = async (app, exerciseId, owner) => {
  const url = buildUrl(endpoints.exercise);
  const notificationsUrl = buildUrl(endpoints.notifications);
  
  const user = app.currentUser;

  if (user) {
    const response = await fetch(`${url}/like?id=${exerciseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: app.currentUser.id,
    });

    const notification = await fetch(
      `${notificationsUrl}?type=likedExercise`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          to: owner,
          from: app.currentUser.id,
          postId: exerciseId,
        }),
      }
    );

    return [response.json(), notification.json()];
  }
};