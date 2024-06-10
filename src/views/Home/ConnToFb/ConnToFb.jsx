import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { redirectToAuth } from "../../../services/fitbit.service";

/**
 * @param {{setToast: () => void}} props
 * @returns {React.FC}
 */
export default function ConnToFb({ setToast }) {
  
  const handleRedirectToAuth = async () => {
    try {
      const url = await redirectToAuth(setToast);

      setTimeout(() => {}, 0);
      window.location.href = url;
    } catch (err) {
      setToast({ type: "error", message: err.message });
    }
  };
  
  return (
    <div
      className="card w-96 h-full p-6 flex flex-col items-center justify-center rounded-md"
      style={{
        backgroundImage: "url(/fitbit-2.jpg)",
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
          <button className="btn btn-md btn-warning text-black mt-12" onClick={handleRedirectToAuth}>
            Link Fitbit account
          </button>
        </Link>
      </div>
    </div>
  );
}

ConnToFb.propTypes = {
  setToast: PropTypes.func.isRequired,
};
