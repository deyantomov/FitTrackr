import { imageToBase64, checkEmail } from "../../common/utils";

describe("imageToBase64", () => {
  test("should convert files and blobs to base64", async () => {
    const file = new File(["test"], "test.png");
    const blob = new Blob(["test"]);
    const fileResult = await imageToBase64(file);
    const blobResult = await imageToBase64(blob);

    expect(fileResult).toBeTruthy();
    expect(blobResult).toBeTruthy();
  });
  
  test("should throw if something different than a file is passed", async () => {
    const value = "test";
    await expect(imageToBase64(value)).rejects.toThrow(TypeError);
  });  
});

describe("checkEmail", () => {
  test("should validate correct email addresses", () => {
    expect(checkEmail.test("john_doe@example.com")).toBeTruthy();
    expect(checkEmail.test("username@domain.co")).toBeTruthy();
  });

  test("should reject incorrect email addresses", () => {
    expect(checkEmail.test("test@example")).toBeFalsy();
    expect(checkEmail.test("john@doe.com@net")).toBeFalsy();
    expect(checkEmail.test("@nope")).toBeFalsy();
  });
});