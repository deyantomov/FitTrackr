import {
  usersEndpoint,
  createUserEndpoint,
  updateProfileEndpoint,
  updateProfilePicEndpoint,
  getProfilePicEndpoint,
  onlineUsersEndpoint,
  createNewExerciseEndpoint,
  createNewGoalEndpoint,
  updateStepsEndpoint,
  updateCaloriesEndpoint,
  updateDistanceEndpoint,
  updateWeeklyStreakEndpoint,
  getExerciseImageEndpoint,
  likeExerciseEndpoint,
  notificationsEndpoint,
  updateExerciseEndpoint,
  removeExerciseEndpoint,
  sendFriendRequestEndpoint,
  acceptFriendRequestEndpoint
} from "./endpoints";
import { login } from "../services/auth.service";
import * as Realm from "realm-web";

/**
 * Creates a new user (in the database)
 *
 * @async
 * @param {User} user - The user object (document) to create
 * @returns {Promise<Response>}
 */
export const createUser = async (user) => {
  const response = await fetch(createUserEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email,
      handle: user.handle,
      firstName: user.firstName,
      lastName: user.lastName,
      createdOn: new Date(),
    }),
  });

  return response;
};

/**
 * Retrieves all users from the database
 *
 * @async
 * @returns {Promise<any>}
 */
export const getAllUsers = async () => {
  const response = await fetch(usersEndpoint);
  return response.json();
};

/**
 * Retrieves a user by their handle
 *
 * @async
 * @param {string} handle The handle of the user to retrieve
 * @returns {Promise<any>}
 */
export const getUserByHandle = async (handle) => {
  const response = await fetch(`${usersEndpoint}handle=${handle}`);
  return response.json();
};

/**
 * Retrieves a user by their email
 *
 * @async
 * @param {string} email - The email of the user to retrieve
 * @returns {Promise<any>}
 */
export const getUserByEmail = async (email) => {
  const response = await fetch(`${usersEndpoint}email=${email}`);
  return response.json();
};

/**
 * Retrieves a user by their ID
 *
 * @async
 * @param {string} id The ID of the user to retrieve (ObjectId string)
 * @returns {Promise<any>}
 */
export const getUserById = async (id) => {
  const response = await fetch(`${usersEndpoint}id=${id}`);
  return response.json();
};

/**
 * Attempts to log in with email and password.
 * If successful, grabs access token from the returned user, and uses it to send a POST request
 * using the updated fields in the body.
 *
 * @async
 * @param {Realm.App} app Realm app instance
 * @param {string} id User's uid
 * @param {object} updatedFields Fields to update the user document with
 * @param {string} email user's email (auth)
 * @param {string} password user's password (auth)
 * @returns {Promise<Response | string>}
 */
export const updateUserProfile = async (
  app,
  id,
  updatedFields,
  email,
  password
) => {
  const user = await login(app, email, password);

  if (user) {
    const accessToken = user["_accessToken"]; // grab access token on successful auth
    let updateImgId;

    if (updatedFields.profilePic) {
      //  update image
      const updateImgRes = await fetch(`${updateProfilePicEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          owner: user.id,
          img: updatedFields.profilePic,
        }),
      });

      //  grab id to associate user with photo
      // console.log(updateImgId);
      updateImgId = (await updateImgRes.json())["_id"];
    }

    if (
      updatedFields.phoneNumber &&
      updatedFields.phoneNumber.toString().length !== 10
    ) {
      throw new Error("Phone number must be 10 digits");
    }

    const response = await fetch(`${updateProfileEndpoint}?uid=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        firstName: updatedFields.firstName,
        lastName: updatedFields.lastName,
        age: updatedFields.age,
        phoneNumber: updatedFields.phoneNumber,
        weight: updatedFields.weight,
        height: updatedFields.height,
        profilePic: updateImgId,
      }),
    });

    return response.json();
  }

  return "Authentication failed!";
};

/**
 * Fetches a user's profile picture
 *
 * @param {Realm.App} app
 * @param {string} id
 */
export const getProfilePic = async (app, id) => {
  // const user = app.currentUser;

  if (true) {
    const response = await fetch(`${getProfilePicEndpoint}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${user.accessToken}`,
      },
    });

    const img = JSON.parse(await response.text());
    return img;
  }
};

/**
 * Sets the user's online status to true/false
 *
 * @param {User} user
 * @param {string} id
 * @param {boolean} isOnline
 */
export const setUserOnlineStatus = async (user, id, isOnline) => {
  const response = await fetch(`${onlineUsersEndpoint}id=${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.accessToken}`,
    },
    body: JSON.stringify({ isOnline }),
  });

  return response.json();
};

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

  const currentUser = app.currentUser;

  if (currentUser) {
    const user = await getUserById(currentUser.id);

    const response = await fetch(`${createNewExerciseEndpoint}`, {
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

  const currentUser = app.currentUser;

  if (currentUser) {
    const { uid, handle } = await getUserById(currentUser.id);

    const response = await fetch(`${updateExerciseEndpoint}?id=${exercise.id}`, {
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
    });

    return response.json();
  }
}

export const removeExercise = async (app, exerciseId) => {
  const currentUser = app.currentUser;

  if (currentUser) {
    const response = await fetch(`${removeExerciseEndpoint}?id=${exerciseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      }
    })

    return response.json();
  }
}

export const getAllExercises = async (page = 1) => {
  const response = await fetch(`${createNewExerciseEndpoint}?page=${page}`);
  return response.json();
};

export const getExercisesByUserId = async (uid, page = 1) => {
  const response = await fetch(`${createNewExerciseEndpoint}?uid=${uid}&page=${page}`);
  return response.json();
};

export const getExercisesByDifficulty = async (difficulty, page = 1) => {
  //  Difficulty - "Beginner" | "Intermediate" | "Pro"
  const response = await fetch(
    `${createNewExerciseEndpoint}?level=${difficulty}&page=${page}`
  );
  return response.json();
};

export const sortExercisesByRating = async (rating, page = 1) => {
  //  Rating = "lowest" | "highest"
  const response = await fetch(`${createNewExerciseEndpoint}?rating=${rating}&page=${page}`);
  return response.json();
};

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

  const currentUser = app.currentUser;

  if (currentUser) {
    const user = await getUserById(currentUser.id);

    const response = await fetch(`${createNewGoalEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
      body: JSON.stringify({
        owner: user.uid,
        title: goal.title,
        type: goal.type, // "steps" || "calories" || "distance"
        period: goal.duration, // "daily" || "weekly" || "monthly"
        targetValue: goal[goal.type] // targetValue is dynamically set based on the type
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
    const user = await getUserById(app.currentUser.id);
    const response = await fetch(`${createNewGoalEndpoint}?uid=${user.uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${app.currentUser.accessToken}`,
      },
    });

    return response.json();
  }
};

export const updateWeeklyStreak = async (app) => {
  const user = app.currentUser;

  if (user) {
    const response = await fetch(
      `${updateWeeklyStreakEndpoint}?uid=${app.currentUser.id}`,
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
  const user = app.currentUser;

  if (user) {
    const stepsResponse = await fetch(
      `${updateStepsEndpoint}?uid=${app.currentUser.id}`,
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
  const user = app.currentUser;

  if (user) {
    const caloriesResponse = await fetch(
      `${updateCaloriesEndpoint}?uid=${app.currentUser.id}`,
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
  const user = app.currentUser;

  if (user) {
    const distanceResponse = await fetch(
      `${updateDistanceEndpoint}?uid=${app.currentUser.id}`,
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

export const getExerciseImage = async (id) => {
  if (id) {
    const response = await fetch(`${getExerciseImageEndpoint}?id=${id}`);
    return response.json();
  }
};

export const likeExercise = async (app, exerciseId, owner) => {
  const user = app.currentUser;

  if (user) {
    const response = await fetch(`${likeExerciseEndpoint}?id=${exerciseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: app.currentUser.id,
    });

    const notification = await fetch(`${notificationsEndpoint}?type=likedExercise`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
        to: owner,
        from: app.currentUser.id,
        postId: exerciseId
      })
    })

    return [response.json(), notification.json()];
  }
};

export const sendFriendRequest = async (app, to) => {
  const { currentUser } = app;

  if (currentUser) {
    const response = await fetch(`${sendFriendRequestEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
      body: JSON.stringify({
        to,
        from: currentUser.id
      })
    });

    return response.json();
  }
};

export const acceptFriendRequest = async (app, from) => {
  const { currentUser } = app;

  if (currentUser) {
    const response = await fetch(`${acceptFriendRequestEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
      body: JSON.stringify({
        to: currentUser.id,
        from
      })
    });

    return response.json();
  }
};