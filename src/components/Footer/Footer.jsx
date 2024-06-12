import { Footer } from "react-daisyui";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function FooterNav() {
  return (
    <>
      <Footer className="px-12 py-6 text-neutral-content border-t border-t-2 border-t-warning relative text-base-600 footer-bg text-white">
        <div className="flex justify-center items-center gap-36 text-lg px-32">
          <Link to="/home" className="bg-gray-900/50 pt-2 pb-3 px-6 rounded-full ms-4 m-0">
            <h2 className="text-5xl m-0">FitTrackr</h2>
          </Link>
        </div>
      </Footer>
    </>
  );
}
