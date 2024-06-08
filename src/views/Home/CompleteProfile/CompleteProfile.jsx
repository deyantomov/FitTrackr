import { useState, useEffect } from "react";
import { useCompleteProfile } from "../../../hooks/useCompleteProfile";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * @param {uid: string} props
 * @returns {React.FC}
 */
export default function CompleteProfile({ uid }) {
  const progressHook = useCompleteProfile();
  const [progress, setProgress] = useState(progressHook);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [notCompleted, setNotCompleted] = useState([]);

  useEffect(() => {
    setProgress(progressHook);
  }, [progressHook]);

  useEffect(() => {
    const totalFields = Object.keys(progress).length;
    const completedFields = Object.values(progress).filter(
      (field) => field
    ).length;
    setProgressPercentage((completedFields / totalFields) * 100);

    const notCompletedFields = Object.keys(progress).filter(
      (field) => !progress[field]
    );
    setNotCompleted(notCompletedFields);
  }, [progress]);

  return (
    <div
      className="card w-96 h-full p-6 flex flex-col items-center justify-center text-center rounded-md"
      style={{
        backgroundImage: "url(/complete-profile.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "550px",
      }}
    >
      <div
        className="flex flex-col w-full h-full justify-center items-center rounded-md p-4"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.55)" }}
      >
        <h2 className="text-4xl text-black mb-4">Complete your profile</h2>
        {notCompleted.map((field, index) => {
          return (
            <p className="text-red-600 text-sm my-1" key={index}>
              {field[0].toUpperCase().concat(field.slice(1))} is not added
            </p>
          );
        })}
        <div
          className="radial-progress text-yellow-500 text-xl mt-12"
          style={{ "--value": progressPercentage }}
          role="progressbar"
        >
          {progressPercentage}%
        </div>
        <Link to={`/profile/${uid}`}>
          <button className="btn btn-md btn-warning text-black mt-12">
            Update your profile
          </button>
        </Link>
      </div>
    </div>
  );
}

CompleteProfile.propTypes = {
  uid: PropTypes.string.isRequired,
};
