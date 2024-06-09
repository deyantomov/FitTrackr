import pkceChallenge from "pkce-challenge";

/**
 * @typedef {Object} PKCEChallenge
 * @property {string} code_verifier
 * @property {string} code_challenge
 */

/**
 * Utilizing the FileReader API to convert an image to base64
 * 
 * @param {Blob | File} file 
 * @returns {Promise<string>}
 */
export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result); 
    reader.onerror = reject;

    reader.readAsDataURL(file); // this will trigger the onload method
  });
};

//  https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
export const checkEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

/**
 * @returns {Promise<PKCEChallenge>}
 */
export const generateCodeChallenge = () => {
  return new Promise((resolve, reject) => {
    try {
      const challenge = pkceChallenge();
      resolve(challenge);
    } catch (error) {
      reject(error);
    }
  });
};