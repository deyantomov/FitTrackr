/**
 * Utilizing the FileReader API to convert an image to base64
 * 
 * @param {Blob | File} file 
 * @returns {Promise<string | void>}
 */
export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result); 
    reader.onerror = reject;

    reader.readAsDataURL(file); // this will trigger the onload method
  });
};

export const checkEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
