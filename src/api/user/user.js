/* eslint-disable no-unused-vars */
import { buildUrl } from "../index";
import { endpoints } from "../endpoints";
import { login } from "../../services/auth.service";
import * as Realm from "realm-web";

/**
 * Creates a new user (in the database)
 *
 * @async
 * @param {User} user - The user object (document) to create
 * @returns {Promise<Response>}
 */
export const createUser = async (user) => {
  const url = buildUrl(endpoints.users);

  const response = await fetch(url, {
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
  const url = buildUrl(endpoints.users);

  const response = await fetch(url);
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
  const url = buildUrl(endpoints.users);

  const response = await fetch(`${url}?handle=${handle}`);
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
  const url = buildUrl(endpoints.users);

  const response = await fetch(`${url}?email=${email}`);
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
  const url = buildUrl(endpoints.users);

  const response = await fetch(`${url}?id=${id}`);
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
  const url = buildUrl(endpoints.users);
  const user = await login(app, email, password);

  if (user) {
    const accessToken = user["_accessToken"]; // grab access token on successful auth
    let updateImgId;

    if (updatedFields.profilePic) {
      const updateImgRes = await fetch(`${url}/update_profile_pic?uid=${id}`, {
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
    
      // Check if the response is ok before trying to access its properties
      if (updateImgRes.ok) {
        const updateImgJson = await updateImgRes.json();
      
        // Check if updateImgJson is not null before trying to access its _id property
        if (updateImgJson) {
          updateImgId = updateImgJson["_id"];
        } else {
          throw new Error("Failed to get JSON from update profile picture response");
        }
      } else {
        throw new Error("Failed to update profile picture");
      }
    }

    if (
      updatedFields.phoneNumber &&
      updatedFields.phoneNumber.toString().length !== 10
    ) {
      throw new Error("Phone number must be 10 digits");
    }

    const response = await fetch(`${url}/update_profile?uid=${id}`, {
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
 * @param {string} id
 */
export const getProfilePic = async (id) => {
  const url = buildUrl(endpoints.users);

  const response = await fetch(`${url}/profile_pic?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const img = JSON.parse(await response.text());
  return img;
};

/**
 * Sets the user's online status to true/false
 *
 * @param {User} user
 * @param {string} id
 * @param {boolean} isOnline
 */
export const setUserOnlineStatus = async (user, id, isOnline) => {
  const url = buildUrl(endpoints.users);

  const response = await fetch(`${url}/online?id=${id}`, {
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
 * 
 * @param {Realm.App} app 
 * @returns {Promise<any>}
 */
export const getFriendList = async (app) => {
  const url = buildUrl(endpoints.friendList);
  const { currentUser } = app;

  if (currentUser) {
    const response = await fetch(`${url}?id=${currentUser.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${currentUser.accessToken}`,
      }
    });

    return response.json();
  }
};

export const savePKCE = async (app, codeVerifier) => {
  const url = buildUrl(endpoints.users);
  const { currentUser } = app;

  if (currentUser) {
    try {
      const response = await fetch(`${url}/save_pkce_verifier?id=${currentUser.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
        body: JSON.stringify({ codeVerifier }),
      });

      return response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  }
};

export const retrievePKCE = async (app) => {
  const url = buildUrl(endpoints.users);
  const { currentUser } = app;
  
  if (currentUser) {
    try {
      const response = await fetch(`${url}/retrieve_pkce_verifier?id=${currentUser.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`,
        }
      });

      return response.json();
    } catch (err) {
      throw new Error(err.message);
    }
  }
};

/**
 * 
 * @param {Realm.App} app 
 * @param {Array<string>} tokens 
 * @returns {Promise<any>}
 */
export const storeAccessTokens = async (app, tokens) => {
  const url = buildUrl(endpoints.users);
  const { currentUser } = app;

  if (currentUser) {
    const response = await fetch(`${url}/store_fitbit_data?id=${currentUser.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
      body: JSON.stringify(tokens),
    });

    return response.json();
  } 
};

export const getAccessTokens = async (app) => {
  const url = buildUrl(endpoints.users);
  const { currentUser } = app;

  if (currentUser) {
    const response = await fetch(`${url}/get_fitbit_data?id=${currentUser.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      }
    });

    return response.json();
  } 
}