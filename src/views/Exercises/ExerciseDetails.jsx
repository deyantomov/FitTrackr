import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getExerciseById } from "../../api/exercise/exercise";
import { useApp } from "../../hooks/useApp";
import { Card, Button } from "react-daisyui";

const ExerciseDetails = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState("");
  const app = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await getExerciseById(app, id);
        const exerciseData = response.exercise;
        // console.log("Exercise Data:", exerciseData);
        setExercise(exerciseData);
      } catch (error) {
        console.error("Failed to fetch exercise:", error);
      }
    };
    fetchExercise();
  }, [app, id]);

  const handleGoBack = () => {
    navigate("/exercises");
  };

  const handleLikeExercise = () => {
  //TODO: Edit
  };

  //if (!exercise) {
  //return (
  //<div className="flex justify-center items-center h-screen">
  //<Loading />
  //</div>
  //);
  //}
  
  return (
    <div className="exercise-details w-full h-full p-12">
      {exercise ? (
        <Card className="exercise-card bg-base-100 shadow-xl transform transition-transform duration-300">
          <Card.Body className="p-4">
            <Card.Title className="text-2xl mb-4">{exercise.title}</Card.Title>
            <p className="text-gray-700 flex items-center mb-2">
              <strong className="mr-2">Description:</strong>{" "}
              {exercise.description}
            </p>
            <p className="text-gray-700 flex items-center mb-2">
              <strong className="mr-2">Level:</strong> {exercise.level}
            </p>
            <p className="text-gray-700 flex items-center mb-2">
              <strong className="mr-2">Duration:</strong>{" "}
              {exercise.duration} minutes
            </p>
            <p className="text-gray-700 flex items-center mb-2">
              <strong className="mr-2">Rating:</strong> {exercise.rating}
            </p>
            <p className="text-gray-700 flex items-center mb-2">
              <strong className="mr-2">Created On:</strong>{" "}
              {new Date(exercise.createdOn).toLocaleDateString()}
            </p>
            <p className="text-gray-700 flex items-center mb-2">
              <strong className="mr-2">Owner:</strong> {exercise.ownerHandle}
            </p>
            <p className="text-gray-700 flex items-center mb-2">
              <strong className="mr-2">Visibility:</strong>{" "}
              {exercise.isPrivate ? "Private" : "Public"}
            </p>
            <div className="flex justify-between">
              <Button
                className="btn-md btn-warning rounded"
                onClick={() => handleLikeExercise(exercise._id)}
              >
                Like
              </Button>
              <Button
                className="btn-md btn-warning rounded"
                onClick={handleGoBack}
              >
                Go Back
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <div className="flex w-full h-full justify-center items-center">
          <p>No exercise found.</p>
        </div>
      )}
    </div>
  );
};

export default ExerciseDetails;