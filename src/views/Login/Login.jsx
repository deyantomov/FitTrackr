import { useApp } from "../../hooks/useApp";
import { login } from "../../services/auth.service";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "react-daisyui";

export default function Login() {
  const app = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const onFormSubmit = async ({ email, password }) => {
    const user = await login(app, email, password);

    if (user) {
      location.state ? navigate(location.state) : navigate('/');
    } else {
      alert('Login failed');
    }
  }

  return (
    <div className="flex flex-row h-screen justify-center items-center">
      <div className="card w-auto bg-gray-200 opacity-80 p-10 lg:px-12 md:px-10 sm:px-8 flex flex-column flex-wrap justify-center align-center items-center text-black">
        <h2 className="card-title text-4xl landscape:text-5xl font-thin">Sign in with email</h2>
        <form
          className="login-form mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const { email, password } = Object.fromEntries(formData.entries());

            onFormSubmit({
              email: email.toString(),
              password: password.toString()
            });

            navigate("/");
          }}
        >
          <div className="mt-8 flex flex-col gap-2 text-md items-center text-lg">
            <label>
              Email Address:
              <input
                id="login-email"
                name="email"
                className="input w-full mt-1 bg-white"
              />
            </label>
            <label className="w-full">
              Password:
              <input
                id="login-password"
                name="password"
                type="password"
                className="input w-full mt-1 bg-white"
              />
            </label>
            <Button type="submit" className="btn-md btn-warning w-full mt-6">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}