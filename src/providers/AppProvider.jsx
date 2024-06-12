import { useState, useEffect } from "react";
import * as Realm from "realm-web";
import { AppContext } from "../context/AppContext";
import atlasConfig from "../../atlasConfig.json";
import PropTypes from "prop-types";

const { baseUrl } = atlasConfig;

/**
 * Create a new instance of the Realm Application
 * 
 * @param {string} id
 * @returns {Realm.App}
 */
const createApp = (id) => {
  return new Realm.App({ id, baseUrl });
};

/**
 * 
 * @param {{appId: string, children: React.FC}} props 
 * @returns {React.FC}
 */
export const AppProvider = ({ appId, children }) => {
  const [app, setApp] = useState(createApp(appId));

  useEffect(() => {
    setApp(createApp(appId));
  }, [appId]);

  const [currentUser, setCurrentUser] = useState(app.currentUser);

  const logIn = async (credentials) => {
    await app.logIn(credentials);

    setCurrentUser(app.currentUser);
    return app.currentUser;
  };

  const logOut = async () => {
    try {
      const user = app.currentUser;

      if (user) {
        await user.logOut();
        await app.removeUser(user);
      }
    } catch (e) {
      console.error(e);
    }

    setCurrentUser(app.currentUser);
  };
  
  const appContext = {
    ...app,
    logIn,
    logOut,
    currentUser
  };

  return (
    <AppContext.Provider value={appContext}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  appId: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};