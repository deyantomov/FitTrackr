import * as Realm from "realm-web";
import { createUser, getUserByEmail } from "../api/api";
import { setUserOnlineStatus } from "../api/api";

/**
 * Logs in a user using the provided email and password
 *
 * @async
 * @param {Realm.App} app Realm app instance
 * @param {string} email User's email address
 * @param {string} password User's password
 * @returns {Promise<Realm.User | undefined>} A promise that resolves with the logged-in user
 */
export const login = async (
  app,
  email,
  password,
) => {
  try {
    const credentials = Realm.Credentials.emailPassword(email, password);
    const user = await app.logIn(credentials);

    await setUserOnlineStatus(user, user.id, true);
    return user;
  
  } catch (err) {
    console.error(err.message);
  }
};

/**
 * Logs out the currently logged-in user
 *
 * @async
 * @param {Realm.App} app Realm app instance
 */
export const logout = async (app) => {
  try {
    const user = app.currentUser;

    if (user) {
      await setUserOnlineStatus(user, user.id, false);
      await user.logOut();
      await app.logOut();

      // localStorage.clear();
    }
    
  } catch (err) {
    console.error(err.message);
  }
};

/**
 * Creates a new user account and initializes a user document
 * in the database associated with the created account
 *
 * @async
 * @param {Realm.App} app Realm app instance
 * @param {string} email User's email address
 * @param {string} password User's password
 * @param {string} firstName User's first name
 * @param {string} lastName User's last name
 * @param {string} handle User's handle/username
 */
export const register = async (
  app,
  email,
  password,
  firstName,
  lastName,
  handle,
  navigate
) => {
  try {
    const isExistingUser = await getUserByEmail(email);

    if (isExistingUser && isExistingUser["_id"]) {
      throw new Error("User already registered");
    }

    await app.emailPasswordAuth.registerUser({ email, password });

    const credentials = Realm.Credentials.emailPassword(email, password);
    const user = await app.logIn(credentials);

    if (user) {
      await createUser({
        uid: user.id,
        email,
        handle,
        firstName,
        lastName,
        role: 'user',
        createdOn: new Date(),
      });

      setUserOnlineStatus(user, user.id, true);

      navigate("/home", { state: handle });
    } else {
      return "Log in failed!";
    }
  } catch (err) {
    console.error(err.message);
    return err.message;
  }
};
