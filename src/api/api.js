import {
  usersEndpoint,
  createUserEndpoint,
  updateProfileEndpoint,
  updateProfilePicEndpoint,
  getProfilePicEndpoint,
  onlineUsersEndpoint,
  createNewExerciseEndpoint,
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
      createdOn: new Date()
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
    const updateImgId = JSON.parse(await updateImgRes.json())["_id"];

    const response = await fetch(`${updateProfileEndpoint}?uid=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        age: updatedFields.age,
        bio: updatedFields.bio,
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
  const user = app.currentUser;

  if (user) {
    const response = await fetch(`${getProfilePicEndpoint}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
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
  const response = await fetch(
    `${onlineUsersEndpoint}id=${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({ isOnline }),
    }
  );

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
    throw new Error('Exercise object cannot be empty!');
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
        title: exercise.title,
        description: exercise.description,
        level: exercise.level.toLowerCase(),
        duration: exercise.duration,
        rating: 0,
        isPrivate: exercise.isPrivate,
        createdOn: new Date()
      })
    });

    return response.json();
  }
}

export const getAllExercises = async () => {
  const response = await fetch(createNewExerciseEndpoint);
  return response.json();
}

export const getExercisesByUserId = async (uid) => {
  const response = await fetch(`${createNewExerciseEndpoint}?uid=${uid}`);
  return response.json();
}

export const getExercisesByDifficulty = async (difficulty) => {
  //  Difficulty - "Beginner" | "Intermediate" | "Pro"
  const response = await fetch(`${createNewExerciseEndpoint}?level=${difficulty}`);
  return response.json();
}

export const sortExercisesByRating = async (rating) => {
  //  Rating = "lowest" | "highest" 
  const response = await fetch(`${createNewExerciseEndpoint}?rating=${rating}`);
  return response.json();
}
