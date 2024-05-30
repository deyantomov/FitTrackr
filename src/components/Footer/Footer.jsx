import { Footer } from "react-daisyui";
import { Link } from "react-router-dom";

export default function FooterNav() {
  return (
    <>
      <Footer className="px-12 py-6 text-neutral-content border-t border-t-2 border-t-warning relative text-base-600">
        <div className="flex justify-center items-center gap-36 text-lg px-32">
          <div className="my-2">
            <Link to="/home">
              <p>Home</p>
            </Link>
            <Link to="/exercises">
              <p>Exercises</p>
            </Link>
            <Link to="/about">
              <p>About us</p>
            </Link>
          </div>
          <div className="my-2">
            <p>Social media</p>
            <p>Contact us</p>
          </div>
        </div>
      </Footer>
    </>
  );
}
