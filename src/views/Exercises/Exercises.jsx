/* eslint-disable no-prototype-builtins */
import { useEffect, useState } from "react";
import api from "../../api/api";
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
  InformationCircleIcon,
} from "@heroicons/react/16/solid";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useApp } from "../../hooks/useApp";
import ExerciseModal from "./ExercisesModal";
import UpdateExerciseModal from "./ExercisesUpdateModal";
import { useToast } from "../../hooks/useToast";
import { toastTypes, toastMessages, mongoCfg } from "../../common/constants";
import ExerciseDetails from "./ExerciseDetails";
import { useNavigate } from "react-router-dom";

const {
  getAllExercises,
  getExerciseImage,
  removeExercise,
  updateExercise,
  likeExercise,
  getExerciseById,
  completeExercise
} = api;

const Exercises = () => {
  const app = useApp();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState("all-exercises");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const { setToast } = useToast(); 

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
  }, [page, app.currentUser]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleLikeExercise = async (id, owner) => {
    try {
      const result = await Promise.all(await likeExercise(app, id, owner));

      const exercise = (await getExerciseById(app, id))["exercise"];

      if (exercise.likedBy && exercise.likedBy.includes(app.currentUser.id)) {
        setToast({ type: "success", message: "Exercise liked successfully" });
      }

      return result;
    } catch (err) {
      setToast({ type: "success", message: "Failed to like exercise" });
    }
  };

  const handleUpdateExercise = async (updatedExercise) => {
    try {
      const result = await updateExercise(app, updatedExercise);
      console.log(result);
      setToast({ type: "success", message: "Exercise updated successfully" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Failed to update exercise" });
    }
  };

  const handleRemoveExercise = async (id) => {
    try {
      const result = await removeExercise(app, id);
      console.log(result);
      setToast({ type: "success", message: "Exercise deleted successfully" });
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Failed to delete exercise" });
    }
  };

  // useEffect(() => {
  //   const test = async () => {
  //     const result = await completeExercise(app, "66586bf026fc273a018efc82", "66588dd87df6d7eac8acad1f");

  //     console.log(result);
  //     return result;
  //   };

  //   test();
  // }, []);

  //  Realtime listener for the exercises collection
  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      const listenForChanges = async () => {
        const mongoClient = app.currentUser.mongoClient(mongoCfg.mongoClient);
        const collection = mongoClient.db(mongoCfg.db).collection(mongoCfg.collections.exercises);
        const changeStream = collection.watch();
  
        //  Listen for changes
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
              setExercises((prevExercises) => {
                const updatedExercises = [...prevExercises];
                const exerciseId = change.fullDocument["_id"].toHexString();
                const index = updatedExercises.findIndex((exercise) => {
                  if (exercise["_id"]) {
                    return exercise["_id"].toString() === exerciseId;
                  } else {
                    return false;
                  }
                });
  
                if (index !== -1) {
                  updatedExercises[index] = {
                    ...change.fullDocument,
                    _id: exerciseId,
                    owner: change.fullDocument.owner.toHexString(),
                    img: updatedExercises[index].img,
                  };
                }

                return updatedExercises;
              });
              break;
            case "delete":
              setExercises((prevExercises) => {
                return prevExercises.filter(
                  (exercise) => exercise["_id"] !== change.documentKey["_id"].toHexString()
                );
              });

              break;
            default:
              throw new Error("Unhandled change event");
            }
          }
        } catch (err) {
          setToast({ type: toastTypes.ERROR, message: err.message });
        }
      };
  
      listenForChanges();
    }
    

    return () => {
      isMounted = false;
    };
  });

  const openModal = (exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedExercise(null);
    setIsModalOpen(false);
  };

  const openUpdateModal = (exercise) => {
    setSelectedExercise(exercise);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedExercise(null);
    setIsUpdateModalOpen(false);
  };

  const openViewDetails = (exercise) => {
    navigate(`/exercises/${exercise.id}`);
  };

  const filteredExercises = exercises.filter((exercise) => {
    if (exercise) {
      const matchesSearchTerm =
        exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
  
      const isVisibleToUser =
        !exercise.isPrivate || (app.currentUser && exercise.owner === app.currentUser.id);
  
      if (filter === "all-exercises") {
        return matchesSearchTerm && isVisibleToUser;
      } else if (filter === "my-exercises") {
        return matchesSearchTerm && app.currentUser && exercise.owner === app.currentUser.id;
      } else if (filter === "liked-exercises") {
        return (
          matchesSearchTerm &&
          exercise.likedBy &&
          exercise.likedBy.includes(app.currentUser && app.currentUser.id) &&
          isVisibleToUser
        );
      }
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
      <div className="w-full flex justify-between items-center mb-6">
        {app.currentUser && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select select-bordered w-1/6 p-1 text-lg"
          >
            <option value="all-exercises">All</option>
            <option value="my-exercises">Mine</option>
            <option value="liked-exercises">Liked</option>
          </select>
        )}
        <div className="w-full">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 p-0 pb-12 md:grid-cols-2 xl:grid-cols-3 justify-center align-center items-center place-items-center w-full h-full">
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
                    : "url(/add-first-exercise-2.jpg)",
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
                          onClick={() => openUpdateModal(exercise)}
                        />
                        <TrashIcon
                          className="h-6 w-6 text-red-500 hover:text-red-700 transform transition-all duration-200 ease-in-out hover:scale-125 ml-2"
                          onClick={() => handleRemoveExercise(exercise["_id"])}
                        />
                      </span>
                    )}
                  </Card.Title>
                  <div className="space-y-4">
                    <p className="text-gray-700 flex items-center mb-2">
                      <PencilIcon className="h-6 w-6 mr-2 text-green-300" />
                      {exercise.description}
                    </p>
                    <p className="text-gray-700 flex items-center mb-2">
                      <ChartBarIcon className="h-6 w-6 mr-2 text-purple-500" />
                      <strong className="mr-2">Level:</strong> {exercise.level}
                    </p>
                    <p className="text-gray-700 flex items-center mb-2">
                      <ClockIcon className="h-6 w-6 mr-2 text-pink-500" />
                      <strong className="mr-2">Duration:</strong>{" "}
                      {exercise.duration} minutes
                    </p>
                    <p className="text-gray-700 flex items-center mb-2">
                      <StarIcon className="h-6 w-6 mr-2 text-yellow-500" />
                      <strong className="mr-2">Rating:</strong>{" "}
                      {exercise.rating}
                    </p>
                    <p className="text-gray-700 flex items-center mb-2">
                      <CalendarIcon className="h-6 w-6 mr-2 text-blue-500" />
                      <strong className="mr-2">Created On:</strong>{" "}
                      {new Date(exercise.createdOn).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 flex items-center mb-2">
                      <UserCircleIcon className="h-6 w-6 mr-2 text-white" />
                      <strong className="mr-2">Owner:</strong>{" "}
                      {exercise.ownerHandle}
                    </p>
                    <p className="text-gray-700 flex items-center mb-2">
                      <LockClosedIcon
                        className={`h-6 w-6 mr-2 ${exercise.isPrivate ? "text-red-500" : "text-green-500"
                        }`}
                      />
                      <strong>
                        <span className="text-lg">
                          {exercise.isPrivate ? "Private" : "Public"}
                        </span>
                      </strong>
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
                          <HeartSolidIcon className="h-5 w-5 mr-2 text-red-500" />
                        ) : (
                          <HeartOutlineIcon className="h-5 w-5 mr-2" />
                        )}
                      {exercise.likedBy ? exercise.likedBy.length : 0}
                    </Button>
                    <Button
                      className="btn-md btn-warning rounded"
                      onClick={() => openModal(exercise)}
                    >
                      Start Workout
                      <ChevronRightIcon className="h-5 w-5 ml-2" />
                    </Button>
                    <Button
                      className="btn-md btn-warning rounded"
                      onClick={() => openViewDetails(exercise)}
                    >
                          Details
                      <InformationCircleIcon className="h-5 w-5 ml-2 text-blue-200" />
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
        <div className="flex w-full justify-center align-center items-center col-span-full gap-4 pb-12 mb-12">
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
      <UpdateExerciseModal
        exercise={selectedExercise}
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        onUpdate={handleUpdateExercise}
      />
    </div>
  );
};

export default Exercises;
