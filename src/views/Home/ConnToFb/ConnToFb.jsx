import { Link } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * @param {{uid: string}} props
 * @returns {React.FC}
 */
export default function ConnToFb({ uid }) {
  return (
    <div
      className="card w-96 h-full p-6 flex flex-col items-center justify-center rounded-md"
      style={{
        backgroundImage: "url(/public/fitbit-2.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "550px",
      }}
    >
      <div
        className="flex flex-col w-full h-full justify-center items-center p-4 rounded-md"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.55)" }}
      >
        <h2 className="text-4xl text-black mt-2 mb-4 rounded-lg text-center">
          Connect to your Fitbit
        </h2>
        <Link to={"/"}>
          <button className="btn btn-md btn-warning text-black mt-12">
            Link Fitbit account
          </button>
        </Link>
      </div>
    </div>
  );
}

PropTypes.ConnToFb = {
  uid: PropTypes.string.isRequired,
};
