import { Link } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * @param {uid: string} props
 * @returns {React.FC}
 */
export default function AddFirstExercise({ uid }) {
  return (
    <div
      className="card w-96 h-full p-6 flex flex-col items-center justify-center rounded-md"
      style={{
        backgroundImage: "url(/public/add-first-exercise-2.jpg)",
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
          Add your first exercise
        </h2>
        <Link to={`/new-exercise`}>
          <button className="btn btn-md btn-warning text-black mt-12">
            Add an exercise
          </button>
        </Link>
      </div>
    </div>
  );
}

AddFirstExercise.propTypes = {
  uid: PropTypes.string.isRequired,
};