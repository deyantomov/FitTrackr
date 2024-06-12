/* eslint-disable no-prototype-builtins */
import { useEffect, useState } from "react";
import api from "../../api/api";
import { Card, Button, Loading } from "react-daisyui";
import {
  PencilIcon,
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
  completeExercise,
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
  const [exerciseImg, setExerciseImg] = useState("");
  const { setToast } = useToast();

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);

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
    setLoading(true);

    try {

      const exerciseBefore = exercises.find((exercise) => exercise["_id"] === id);
      const isLiked =
        exerciseBefore.likedBy &&
        exerciseBefore.likedBy.includes(app.currentUser.id);

      const result = await Promise.all(await likeExercise(app, id, owner));
      const exerciseAfter = (await getExerciseById(app, id))["exercise"];

      if (exerciseAfter.img) {
        exerciseAfter.img = (await getExerciseImage(exerciseAfter.img))["img"];
      }

      setExercises((prevExercises) => {
        return prevExercises.map((exercise) => {
          return exercise["_id"] === id ? exerciseAfter : exercise;
        });
      });

      if (!isLiked) {
        setToast({
          type: toastTypes.SUCCESS,
          message: "Exercise liked successfully",
        });
      }

      return result;
    } catch (err) {
      setToast({ type: toastTypes.ERROR, message: "Failed to like exercise" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExercise = async (updatedExercise) => {
    setLoading(true);

    try {
      await updateExercise(app, updatedExercise);

      setToast({
        type: toastTypes.SUCCESS,
        message: "Exercise updated successfully",
      });
    } catch (err) {
      setToast({
        type: toastTypes.ERROR,
        message: "Failed to update exercise",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveExercise = async (id) => {
    setLoading(true);

    try {
      await removeExercise(app, id);

      setToast({
        type: toastTypes.SUCCESS,
        message: "Exercise deleted successfully",
      });
    } catch (err) {
      setToast({
        type: toastTypes.ERROR,
        message: "Failed to delete exercise",
      });
    } finally {
      setLoading(false);
    }
  };

  //  Realtime listener for the exercises collection
  useEffect(() => {
    const listenForChanges = async () => {
      const mongoClient = app.currentUser.mongoClient(mongoCfg.mongoClient);
      const collection = mongoClient
        .db(mongoCfg.db)
        .collection(mongoCfg.collections.exercises);

      const changeStream = collection.watch();

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
                  img: updatedExercises[index]["img"],
                };

                setExerciseImg((prev) => ({
                  ...prev,
                  [exerciseId]: updatedExercises[index]["img"],
                }));
              }

              return updatedExercises;
            });
            break;
          case "delete":
            setExercises((prevExercises) => {
              return prevExercises.filter(
                (exercise) =>
                  exercise["_id"] !== change.documentKey["_id"].toHexString()
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

      return changeStream;
    };

    listenForChanges();
  }, []);

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
        !exercise.isPrivate ||
        (app.currentUser && exercise.owner === app.currentUser.id);

      if (filter === "all-exercises") {
        return matchesSearchTerm && isVisibleToUser;
      } else if (filter === "my-exercises") {
        return (
          matchesSearchTerm &&
          app.currentUser &&
          exercise.owner === app.currentUser.id
        );
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
    <div className="flex flex-col justify-center align-center items-center p-10 px-12 w-full h-full">
      <div className="flex justify-between align-center items-center mb-6 gap-8 w-5/6 h-auto pb-8">
        <div className="w-full">
          <SearchBar onSearch={handleSearch} />
        </div>
        {app.currentUser && (
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-100 text-gray-900 rounded-md shadow-sm focus:outline-none sm:text-sm"
            >
              <option value="all-exercises">All</option>
              <option value="my-exercises">Mine</option>
              <option value="liked-exercises">Liked</option>
            </select>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
                    ? `url(${
                      exerciseImg && exerciseImg[exercise["_id"]]
                        ? exerciseImg[exercise["_id"]]
                        : exercise.img
                    })`
                    : "url(/add-first-exercise-2.jpg)",
                }}
              />
              <Card.Body className="relative">
                <div className="p-4 bg-white bg-opacity-90 rounded-lg">
                  <Card.Title className="font-bold text-2xl mb-2">
                    Title: {exercise.title}
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
                  <p className="text-sm text-gray-600 mb-4">
                    Description: {exercise.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <Button
                      className="btn-warning flex items-center"
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
      {filter === "all-exercises" && (
        <div className="flex justify-center mt-8 gap-4">
          {!searchTerm && Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`btn-warning ${page !== i + 1 && "btn-outline"}`}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
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
