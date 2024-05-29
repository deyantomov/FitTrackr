import { useEffect, useState } from "react";
import { getAllExercises, getExerciseImage } from "../../api/api";
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
import SearchBar from "../../components/SearchBar/SearchBar";

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getAllExercises();

        const updatedExercises = await Promise.all(
          data.map(async (exercise) => {
            if (exercise.img) {
              const imgData = await getExerciseImage(exercise.img);
              return { ...exercise, img: imgData["img"] };
            } else {
              return exercise;
            }
          })
        );

        setExercises(updatedExercises);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  let filteredExercises;

  if (exercises.length) {
    filteredExercises = exercises.filter(
      (exercise) =>
        (exercise.title &&
          exercise.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (exercise.description &&
          exercise.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  return (
    <div>
      <div className="w-1/2 mx-auto">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  <Card.Title className="flex items-center justify-center border p-2 bg-yellow-500 rounded bg-opacity-55">
                    <FireIcon className="h-5 w-5 mr-2 text-orange-500" />
                    <strong className="text-center text-2xl">
                      {exercise.title}
                    </strong>
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
                      <strong className="mr-2">Owner:</strong> {exercise.owner}
                    </p>
                    <p className="flex items-center">
                      <LockClosedIcon className="h-5 w-5 mr-2" />
                      <strong className="mr-2">Is Private:</strong>{" "}
                      {exercise.isPrivate ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
                <Card.Actions className="justify-end">
                  <Button className="btn btn-md btn-warning rounded">
                    Start Workout
                  </Button>
                </Card.Actions>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No exercises found.</p>
        )}
      </div>
    </div>
  );
};

export default Exercises;
