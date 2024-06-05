import { useEffect, useState } from "react";
import {
  getAllExercises,
  getExerciseImage,
  removeExercise,
  updateExercise,
} from "../../api/api";
import { Card, Button, Loading } from "react-daisyui";
import {
  FireIcon,
  LockClosedIcon,
  ClockIcon,
  ChartBarIcon,
  PencilIcon,
  CalendarIcon,
  StarIcon,
  UserCircleIcon,
} from "@heroicons/react/16/solid";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import SearchBar from "../../components/SearchBar/SearchBar";
import { likeExercise } from "../../api/api";
import { useApp } from "../../hooks/useApp";
import ExerciseModal from "./ExercisesModal";

const Exercises = () => {
  const app = useApp();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState("all-exercises");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await getAllExercises(page);

        //  use one to one relationships to avoid exercise documents and application responses exceeding 16MB
        const updatedExercises = await Promise.all(
          response.data.map(async (exercise) => {
            if (exercise.img) {
              const imgData = await getExerciseImage(exercise.img);
              return { ...exercise, img: imgData["img"] };
            } else {
              return exercise;
            }
          })
        );

        setExercises(updatedExercises);
        setTotalPages(response.totalPages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [page]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleLikeExercise = async (id, owner) => {
    try {
      const result = await likeExercise(app, id, owner);

      return result;
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateExercise = async (id) => {
    try {
      const exercise = {
        id,
        title: "Test",
        description: "Test update exercise",
        level: "pro",
        duration: 19,
        isPrivate: false,
      };

      const result = await updateExercise(app, exercise);

      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveExercise = async (id) => {
    try {
      const result = await removeExercise(app, id);

      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  //  Create a realtime listener for the exercises collection (to track likes in real-time)
  useEffect(() => {
    const listenForChanges = async () => {
      const mongoClient = app.currentUser.mongoClient("mongodb-atlas");
      const collection = mongoClient.db("sample_data").collection("exercises");
      const changeStream = collection.watch([], {
        fullDocument: "updateLookup",
      });

      const cleanup = () => {
        changeStream.close();
      };

      // Listen for changes
      try {
        for await (const change of changeStream) {
          switch (change.operationType) {
          case "insert":
            setExercises((prevExercises) => [
              ...prevExercises,
              change.fullDocument,
            ]);
            break;
          case "update":
          case "replace":
            setExercises((prevExercises) =>
              prevExercises.map((exercise) => {
                if (exercise) {
                  return exercise["_id"] === change.fullDocument["_id"].toHexString()
                    ? { ...change.fullDocument, img: exercise.img }
                    : exercise;
                }
              })
            );
            break;
          case "delete":
            setExercises((prevExercises) =>
              prevExercises.filter(
                (exercise) => exercise._id !== change.documentKey._id
              )
            );
            break;
          default:
            console.log("Unhandled change event:", change);
          }
        }
      } catch (err) {
        console.error("Error listening for changes:", err);
      }

      //  clean up;
      return cleanup;
    };

    listenForChanges().catch(console.error);
  }, [app.currentUser]);

  const openModal = (exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedExercise(null);
    setIsModalOpen(false);
  };

  const filteredExercises = exercises.filter((exercise) => {
    if (exercise) {
      const matchesSearchTerm =
        exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (filter === "all-exercises") {
        return matchesSearchTerm;
      } else if (filter === "my-exercises") {
        return matchesSearchTerm && exercise.owner === app.currentUser.id;
      } else if (filter === "liked-exercises") {
        return (
          matchesSearchTerm &&
          exercise.likedBy &&
          exercise.likedBy.includes(app.currentUser.id)
        );
      }
      return false;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full h-full p-12">
      <div className="w-1/2 mx-auto mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="all-exercises">All Exercises</option>
          <option value="my-exercises">My Exercises</option>
          <option value="liked-exercises">Liked Exercises</option>
        </select>
      </div>
      <div className="w-1/2 mx-auto mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="grid grid-cols-1 gap-4 p-0 pb-12 sm:grid-cols-2 lg:grid-cols-3 justify-center align-center items-center place-items-center w-full h-full">
        {filteredExercises && filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            <Card
              key={exercise._id}
              className="w-96 bg-base-100 shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/50 text-black"
            >
              <Card.Body
                className="text-lg mb-2 bg-cover bg-center"
                style={{
                  backgroundImage: exercise.img
                    ? `url(${exercise.img})`
                    : "url(/public/add-first-exercise-2.jpg)",
                }}
              >
                <div className="flex flex-col w-full h-full justify-center p-4 rounded-md bg-white bg-opacity-55">
                  <Card.Title className="flex items-center justify-center border p-2 bg-yellow-500 rounded bg-opacity-55 mb-4">
                    <FireIcon className="h-5 w-5 mr-2 text-orange-500" />
                    <strong className="text-center text-2xl">
                      {exercise.title}
                    </strong>
                    {exercise.owner ===
                      (app.currentUser ? app.currentUser.id : null) && (
                      <span className="ml-4 flex">
                        <PencilIcon
                          className="h-6 w-6 text-blue-500 hover:text-blue-700 transform transition-all duration-200 ease-in-out hover:scale-125"
                          onClick={() => handleUpdateExercise(exercise["_id"])}
                        />
                        <TrashIcon
                          className="h-6 w-6 text-red-500 hover:text-red-700 transform transition-all duration-200 ease-in-out hover:scale-125 ml-2"
                          onClick={() => handleRemoveExercise(exercise["_id"])}
                        />
                      </span>
                    )}
                  </Card.Title>
                  <div className="space-y-4">
                    <p className="flex items-center">
                      <PencilIcon className="h-5 w-5 mr-2" />
                      {exercise.description}
                    </p>
                    <p className="flex items-center">
                      <ChartBarIcon className="h-5 w-5 mr-2" />
                      <strong className="mr-2">Level:</strong> {exercise.level}
                    </p>
                    <p className="flex items-center">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      <strong className="mr-2">Duration:</strong>{" "}
                      {exercise.duration} minutes
                    </p>
                    <p className="flex items-center">
                      <StarIcon className="h-5 w-5 mr-2" />
                      <strong className="mr-2">Rating:</strong>{" "}
                      {exercise.rating}
                    </p>
                    <p className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <strong className="mr-2">Created On:</strong>{" "}
                      {new Date(exercise.createdOn).toLocaleDateString()}
                    </p>
                    <p className="flex items-center">
                      <UserCircleIcon className="h-5 w-5 mr-2" />
                      <strong className="mr-2">Owner:</strong>{" "}
                      {exercise.ownerHandle}
                    </p>
                    <p className="flex items-center">
                      <LockClosedIcon className="h-5 w-5 mr-2" />
                      <strong className="mr-2">Is Private:</strong>{" "}
                      {exercise.isPrivate ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
                <Card.Actions>
                  <div className="flex w-full justify-center align-center gap-8 mt-6">
                    <Button
                      className="btn-md btn-warning rounded"
                      onClick={() =>
                        handleLikeExercise(exercise["_id"], exercise.owner)
                      }
                    >
                      {exercise.likedBy &&
                      app.currentUser &&
                      exercise.likedBy.includes(app.currentUser.id) ? (
                          <HeartSolidIcon className="h-5 w-5 mr-2" />
                        ) : (
                          <HeartOutlineIcon className="h-5 w-5 mr-2" />
                        )}
                      {exercise.likedBy ? exercise.likedBy.length : 0}
                    </Button>
                    <Button className="btn-md btn-warning rounded"
                      onClick={() => openModal(exercise)}
                    >
                      Start Workout
                      <ChevronRightIcon className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </Card.Actions>
              </Card.Body>
            </Card>
          ))
        ) : (
          <div className="flex w-full h-full justify-center align-center items-center col-span-full">
            <p>No exercises found.</p>
          </div>
        )}
        <div className="flex w-full justify-center align-center items-center col-span-full gap-4 mb-12">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`btn-warning ${page !== i + 1 && "btn-outline"}`}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>
      <ExerciseModal
        exercise={selectedExercise}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default Exercises;
