import api from "../../api/api";
import { useApp } from "../../hooks/useApp";
import { register } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { checkEmail } from "../../common/utils";

const { getUserByEmail } = api;

export default function SignUp() {
  const app = useApp();
  const { setToast } = useToast();
  const navigate = useNavigate();

  const onFormSubmit = async ({
    email,
    password,
    handle,
    firstName,
    lastName,
  }) => {
    try {
      const isExistingUser = await getUserByEmail(email);

      if (isExistingUser && isExistingUser["_id"]) {
        throw new Error("User already registered");
      }

      if (handle.length < 2 || handle.length > 20) {
        throw new Error("Username must be 2-20 characters long!");
      }

      if(firstName.length < 2 || firstName.length > 20) {
        throw new Error("First name must be 2-20 characters long!");
      }

      if(lastName.length < 2 || lastName.length > 20) {
        throw new Error("Last name must be 2-20 characters long!");
      }
  
      if (!email || !checkEmail.test(email)) {
        throw new Error("Invalid email address!");
      }

      const result = await register(
        app,
        email,
        password,
        firstName,
        lastName,
        handle,
        navigate
      );

      if (result === "User already registered") {
        setToast({ type: "error", message: "User already registered" });
      }
    } catch (err) {
      setToast({ type: "error", message: err.message });
    }
  };

  return (
    <div className="flex flex-row h-screen justify-center items-center">
      <div className="card w-auto bg-gray-200 opacity-80 p-10 lg:px-12 md:px-10 sm:px-8 flex flex-column flex-wrap justify-center align-center items-center text-black">
        <h2 className="card-title text-4xl md:text-5xl font-thin">
          Sign up with email
        </h2>
        <form
          className="signup-form mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const {
              email,
              password,
              confirmPassword,
              handle,
              firstName,
              lastName,
            } = Object.fromEntries(formData.entries());

            if (password === confirmPassword) {
              onFormSubmit({
                email: email.toString(),
                password: password.toString(),
                handle: handle.toString(),
                firstName: firstName.toString(),
                lastName: lastName.toString(),
              }).catch((err) => {
                e.preventDefault();
                setToast({ type: "error", message: err.message });
              });
            } else {
              setToast({ type: "error", message: "Passwords do not match" });
            }
          }}
        >
          <div className="mt-8 flex flex-col landscape:flex-row gap-2 text-lg items-center">
            <div className="flex flex-col w-full">
              <label className="">
                Email:
                <input
                  id="signup-email"
                  name="email"
                  className="input w-full mt-1 bg-white text-black"
                />
              </label>
              <label className="w-full">
                Username:
                <input
                  id="signup-handle"
                  name="handle"
                  type="text"
                  className="input w-full mt-1 bg-white"
                />
              </label>
            </div>
            <div className="flex flex-col w-full">
              <label className="w-full">
                First Name:
                <input
                  id="signup-first-name"
                  name="firstName"
                  type="text"
                  className="input w-full mt-1 bg-white"
                />
              </label>
              <label className="w-full">
                Last Name:
                <input
                  id="signup-last-name"
                  name="lastName"
                  type="text"
                  className="input w-full mt-1 bg-white"
                />
              </label>
            </div>
          </div>
          <div className="flex flex-col mt-2 text-lg">
            <label className="w-full">
              Password:
              <input
                id="signup-password"
                name="password"
                type="password"
                className="input w-full mt-1 bg-white"
              />
            </label>
            <label className="w-full">
              Confirm password:
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                className="input w-full mt-1 bg-white"
              />
            </label>
          </div>
          <button
            id="submit-button"
            data-testid="submitbutton"
            className="btn btn-md btn-warning w-full mt-12"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
