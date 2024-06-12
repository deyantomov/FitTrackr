import { fitbitCfg } from "../common/constants";
import api from "../api/api";
import { toastTypes } from "../common/constants";

const { storeAccessTokens } = api;

/**
 * Creates an URL that redirects to the Fitbit OAuth2.0 page
 * @param {() => void} setToast
 * @returns {string | void}
 */
export const redirectToAuth = (setToast) => {
  try {
    const authUrl = `${fitbitCfg.authUri}?response_type=token&client_id=${fitbitCfg.client}&scope=${fitbitCfg.scopes.join("+")}&redirect_uri=${encodeURIComponent(fitbitCfg.redirectUrl)}&expires_in=604800`;

    return authUrl;
  } catch (error) {
    setToast({ type: toastTypes.ERROR, message: "Can't generate authorization URL" });
  }
};

/**
 * Handles the redirect from the Fitbit OAuth2.0 page
 * @param {Realm.App} app
 * @param {() => void} setToast
 */
export const handleRedirect = async (app, setToast) => {
  try {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const expiresIn = params.get("expires_in");
      const tokenType = params.get("token_type");
      console.log(accessToken, expiresIn, tokenType);

      if (accessToken) {
        await storeAccessTokens(app, { accessToken, expiresIn, tokenType });
        setToast({ type: toastTypes.SUCCESS, message: "Authorization successful" });
      } else {
        setToast({ type: toastTypes.ERROR, message: "Authorization failed" });
      }
    } else {
      setToast({ type: toastTypes.ERROR, message: "No authorization token found" });
    }
  } catch (error) {
    setToast({ type: toastTypes.ERROR, message: "Error handling authorization redirect" });
  }
};
