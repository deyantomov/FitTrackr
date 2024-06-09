import { fitbitCfg } from "../common/constants";
import { generateCodeChallenge } from "../common/utils";
import api from "../api/api";
import { toastTypes, toastMessages } from "../common/constants";

const { storeAccessTokens } = api;

let codeVerifier = null;

export const redirectToAuth = async (setToast) => {
  try {
    const { code_verifier, code_challenge } = await generateCodeChallenge();
    codeVerifier = code_verifier;

    const authUrl = `${fitbitCfg.authUri}?response_type=code&client_id=${fitbitCfg.client}&scope=${fitbitCfg.scopes.join(" ")}&code_challenge=${encodeURIComponent(code_challenge)}&code_challenge_method=S256&redirect_uri=${encodeURIComponent(fitbitCfg.redirectUrl)}`;

    return authUrl;
  } catch (error) {
    setToast({ type: toastTypes.ERROR, message: "Can't generate a PKCE challenge" });
  }
};

export const handleRedirect = async (app, setToast) => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const code_verifier = codeVerifier;

  if (code && code_verifier) {
    try {
      const { clientId, redirectUri, tokenUri } = fitbitCfg;

      const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code: code,
        code_verifier: code_verifier
      });

      const response = await fetch(tokenUri, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body.toString()
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Tokens: ", data);
        await storeAccessTokens(app, data);
      } else {
        setToast({ type: toastTypes.ERROR, mesage: data });
      }
    } catch (error) {
      setToast({ type: toastTypes.ERROR, message: "Couldn't exchange tokens" });
    }
  } else {
    setToast({ type: toastTypes.ERROR, message: "Missing authorization code or code verifier" });
  }
};