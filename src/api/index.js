//  Revealing module pattern (encapsulation/information hiding)
const baseUrl = "https://eu-central-1.aws.data.mongodb-api.com/app/fittrackr-rnylmjz/endpoint";

/**
 * Creates a URL by appending the endpoint to the base URL.
 * 
 * @param {string} endpoint 
 * @returns {string}
 */
export const buildUrl = (endpoint) => {
  return `${baseUrl}${endpoint}`;
}