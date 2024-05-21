// import { createUser } from "../api/api";
import { useApp } from "../../hooks/useApp";
import { register } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const app = useApp();
  const navigate = useNavigate();

  const onFormSubmit = async ({
    email,
    password,
    handle,
    firstName,
    lastName,
  }) => {
    try {
      await register(app, email, password, firstName, lastName, handle, navigate);
    } catch (erry) {
      console.error(err.message);
    }
  };

  //  TODO: Fix design, make it more responsive (landscape:hidden or portrait:hidden to control visibility on different screen sizes)
  return (
    <div className="flex flex-row h-screen justify-center items-center">
      <div className="card w-auto bg-gray-200 opacity-80 p-8 lg:px-12 md:px-10 sm:px-8 flex flex-column flex-wrap justify-center align-center items-center text-black">
        <h2 className="card-title text-4xl">Sign up with email</h2>
        <form
          className="signup-form mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const { email, password, handle, firstName, lastName } =
              Object.fromEntries(formData.entries());

            onFormSubmit({
              email: email.toString(),
              password: password.toString(),
              handle: handle.toString(),
              firstName: firstName.toString(),
              lastName: lastName.toString(),
            }).catch((err) => {
              e.preventDefault();
              console.error(err.message);
            })
          }}
        >
          <div className="mt-8 flex flex-col gap-2 text-md items-center">
            <label>
              Email Address:
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
            <label className="w-full">
              Password:
              <input
                id="signup-password"
                name="password"
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