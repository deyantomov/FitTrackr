import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getExerciseById } from "../../api/exercise/exercise";
import { useApp } from "../../hooks/useApp";
import { Card, Button } from "react-daisyui";
import {
  FireIcon,
  LockClosedIcon,
  ClockIcon,
  ChartBarIcon,
  PencilIcon,
  CalendarIcon,
  StarIcon,
  UserCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/16/solid";
import { HeartIcon as HeartOutlineIcon, HeartIcon as HeartSolidIcon } from "@heroicons/react/24/outline";

const ExerciseDetails = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState("");
  const app = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercise = async () => {
      if (!app.currentUser || !app.currentUser.id) {
        console.error("User is not authenticated or does not have an id");
        navigate("/login");
        return;
      }
      try {
        const response = await getExerciseById(app, id);
        const exerciseData = response.exercise || response;
        console.log("Exercise Data:", exerciseData);
        setExercise(exerciseData);
      } catch (error) {
        console.error("Failed to fetch exercise:", error);
      }
    };
    fetchExercise();
  }, [app, id, navigate]);

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
      <Card className="exercise-card bg-base-100 shadow-xl transform transition-transform duration-300 w-full md:w-3/4 lg:w-2/3 mx-auto relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center rounded opacity-75"
          style={{
            backgroundImage: exercise.img
              ? `url(${exercise.img})`
              : "url(/add-first-exercise-2.jpg)",
          }}
        ></div>
        <div className="relative z-10 p-4 bg-white bg-opacity-80 rounded-md">
          <Card.Title className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4">{exercise.title}</Card.Title>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl flex items-center mb-2">
            <PencilIcon className="h-6 w-6 mr-2 text-green-300" />
            <strong className="mr-2">Description:</strong> {exercise.description}
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl flex items-center mb-2">
            <ChartBarIcon className="h-6 w-6 mr-2 text-purple-500" />
            <strong className="mr-2">Level:</strong> {exercise.level}
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl flex items-center mb-2">
            <ClockIcon className="h-6 w-6 mr-2 text-pink-500" />
            <strong className="mr-2">Duration:</strong> {exercise.duration} minutes
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl flex items-center mb-2">
            <StarIcon className="h-6 w-6 mr-2 text-yellow-500" />
            <strong className="mr-2">Rating:</strong> {exercise.rating}
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl flex items-center mb-2">
            <CalendarIcon className="h-6 w-6 mr-2 text-blue-500" />
            <strong className="mr-2">Created On:</strong>{" "}
            {new Date(exercise.createdOn).toLocaleDateString()}
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl flex items-center mb-2">
            <UserCircleIcon className="h-6 w-6 mr-2 text-blue-300" />
            <strong className="mr-2">Owner:</strong> {exercise.ownerHandle}
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl flex items-center mb-2">
            <LockClosedIcon
              className={`h-6 w-6 mr-2 ${exercise.isPrivate ? "text-red-500" : "text-green-500"
              }`}
            />
            <strong>
              <span className="mr-2">
                {exercise.isPrivate ? "Private" : "Public"}
              </span>
            </strong>
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
        </div>
      </Card>
    </div>
  );
};
export default ExerciseDetails;
