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
      // before
      const exerciseBefore = exercises.find(exercise => exercise["_id"] === id);
      const isLiked = exerciseBefore.likedBy && exerciseBefore.likedBy.includes(app.currentUser.id);
      // after
      const result = await Promise.all(await likeExercise(app, id, owner));
      const exerciseAfter = (await getExerciseById(app, id))["exercise"];
  
      setExercises((prevExercises) => {
        return prevExercises.map((exercise) => {
          return exercise["_id"] === id ? exerciseAfter : exercise;
        });
      });
  
      if (!isLiked) {
        setToast({ type: toastTypes.SUCCESS, message: "Exercise liked successfully" });
      }
  
      return result;
    } catch (err) {
      setToast({ type: toastTypes.ERROR, message: "Failed to like exercise" });
    }
  };

  const handleUpdateExercise = async (updatedExercise) => {
    try {
      const result = await updateExercise(app, updatedExercise);
      console.log(result);
      setToast({ type: toastTypes.SUCCESS, message: "Exercise updated successfully" });
    } catch (err) {
      console.error(err);
      setToast({ type: toastTypes.ERROR, message: "Failed to update exercise" });
    }
  };

  const handleRemoveExercise = async (id) => {
    try {
      const result = await removeExercise(app, id);
      console.log(result);
      setToast({ type: toastTypes.SUCCESS, message: "Exercise deleted successfully" });
    } catch (err) {
      console.error(err);
      setToast({ type: toastTypes.ERROR, message: "Failed to delete exercise" });
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
  }, [app, setToast]);

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
    navigate(`/exercises/${exercise["_id"]}`);
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
    <div className="container mx-auto p-6 relative">
      <div className="flex justify-between items-center mb-6">
        {app.currentUser && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select select-bordered w-1/4 p-1 text-lg"
          >
            <option value="all-exercises">All</option>
            <option value="my-exercises">Mine</option>
            <option value="liked-exercises">Liked</option>
          </select>
        )}
        <div className="w-3/4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises && filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            <Card
              key={exercise._id}
              className="w-full bg-base-100 shadow-xl rounded-lg overflow-hidden relative transition-transform duration-300 hover:shadow-2xl hover:transform hover:scale-105"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: exercise.img
                    ? `url(${exercise.img})`
                    : "url(/add-first-exercise-2.jpg)",
                }}
              />
              <Card.Body className="relative">
                <div className="p-4 bg-white bg-opacity-90 rounded-lg">
                  <Card.Title className="font-bold text-2xl mb-2">
                  Title: {exercise.title}
                    {exercise.owner === (app.currentUser ? app.currentUser.id : null) && (
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
                  <p className="text-sm text-gray-600 mb-4">Description: {exercise.description}</p>
                  <div className="flex justify-between items-center">
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
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <div className="flex w-full h-full justify-center align-center items-center col-span-full">
            <p>No exercises found.</p>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-6">
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
