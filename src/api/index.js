//  Revealing module pattern (encapsulation/information hiding)
const baseUrl = "https://eu-central-1.aws.data.mongodb-api.com/app/application-0-sffvmko/endpoint";

/**
 * Creates a URL by appending the endpoint to the base URL.
 * 
 * @param {string} endpoint 
 * @returns {string}
 */
export const buildUrl = (endpoint) => {
  return `${baseUrl}${endpoint}`;
}