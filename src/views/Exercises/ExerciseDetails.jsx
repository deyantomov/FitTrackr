import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getExerciseById, likeExercise, getExerciseImage } from "../../api/exercise/exercise";
import { useApp } from "../../hooks/useApp";
import { Card, Button, Loading } from "react-daisyui";
import {
  LockClosedIcon,
  ClockIcon,
  ChartBarIcon,
  PencilIcon,
  CalendarIcon,
  StarIcon,
  UserCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/16/solid";
import { HeartIcon as HeartOutlineIcon, HeartIcon as HeartSolidIcon } from "@heroicons/react/24/outline";
import ExerciseModal from "./ExercisesModal";
import { useToast } from "../../hooks/useToast";
import { toastTypes, toastMessages, mongoCfg } from "../../common/constants";

const ExerciseDetails = () => {
  const { id } = useParams();
  const app = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [exercise, setExercise] = useState("");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setToast } = useToast(); 

  useEffect(() => {
    const fetchExercise = async () => {
      setLoading(true);

      if (!app.currentUser || !app.currentUser.id) {
        navigate("/login");
        return;
      }

      try {
        const response = await getExerciseById(app, id);
        const exerciseData = response.exercise || response;

        if (exerciseData.img) {
          const imgData = await getExerciseImage(exerciseData.img);
          exerciseData.img = imgData["img"];
        }
        setExercise(exerciseData);
      } catch (error) {
        setToast({ type: toastTypes.ERROR, message: "Failed to fetch exercise:" });
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [app, id, navigate]);

  const handleGoBack = () => {
    navigate("/exercises");
  };

  const handleLikeExercise = async (exerciseId, ownerId) => {
    if (!exercise) {
      return;
    }

    setLoading(true);

    try {
      const isLiked = exercise.likedBy && exercise.likedBy.includes(app.currentUser.id);
      await likeExercise(app, exerciseId, ownerId);

      const response = await getExerciseById(app, exerciseId);
      const updatedExercise = response.exercise || response;

      updatedExercise.img = (await getExerciseImage(updatedExercise.img))["img"];

      setExercise(updatedExercise);

      if (!isLiked) {
        setToast({ type: toastTypes.SUCCESS, message: "Exercise liked successfully" });
      } else {
        setToast({ type: toastTypes.SUCCESS, message: "Exercise unliked successfully" });
      }
      
    } catch (err) {
      setToast({ type: toastTypes.ERROR, message: "Failed to like exercise" });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (exercise) => {
    if (!app.currentUser) {
      navigate("/login");
      return;
    }
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedExercise(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex justify-center align-center items-center exercise-details w-full h-full p-12 text-black">
      <Card className="exercise-card bg-base-100 shadow-xl transform transition-transform duration-300 w-full md:w-3/4 lg:w-2/3 mx-auto relative overflow-hidden p-8">
        <div
          className="absolute inset-0 bg-cover bg-center rounded opacity-75"
          style={{
            backgroundImage: exercise.img
              ? `url(${exercise.img})`
              : "url(/add-first-exercise-2.jpg)",
          }}
        ></div>
        <div className="relative z-10 p-4 bg-white bg-opacity-80 rounded-md">
          <Card.Title className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-8">{exercise.title}</Card.Title>
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
          {/* <p className="text-base sm:text-lg md:text-xl lg:text-2xl flex items-center mb-2">
            <StarIcon className="h-6 w-6 mr-2 text-yellow-500" />
            <strong className="mr-2">Rating:</strong> {exercise.rating}
          </p> */}
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
          <div className="flex justify-between mt-8">
            <Button
              className="btn-warning flex items-center"
              onClick={() => handleLikeExercise(exercise["_id"], exercise.owner)}
            >
              {exercise.likedBy &&
              app.currentUser &&
              exercise.likedBy.includes(app.currentUser.id) ? (
                  <HeartSolidIcon className="h-5 w-5 mr-2 text-red-500" />
                ) : (
                  <HeartOutlineIcon className="h-5 w-5 mr-2" />
                )}
              {exercise.likedBy ? exercise.likedBy.length : 0}
            </Button>
            <Button
              className="btn-md bg-red-500 text-white rounded absolute top-0 right-0 m-4 p-2 rounded-full"
              onClick={handleGoBack}
            >
              Go Back
              <ChevronLeftIcon className="h-5 w-5 ml-2" />
            </Button>
            <Button
              className="btn-md btn-warning rounded text-center "
              onClick={() => openModal(exercise)}
            >
              Start Workout
              <ChevronRightIcon className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
      <ExerciseModal
        exercise={selectedExercise}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};
export default ExerciseDetails;
