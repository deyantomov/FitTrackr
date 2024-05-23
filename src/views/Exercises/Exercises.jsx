import { getAllExercises } from "../../api/api";
import { useEffect, useState } from "react";
import { Card, Button } from "react-daisyui";
import { FireIcon } from "@heroicons/react/16/solid";

const Exercises = () => {
const [exercises, setExercises] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const fetchExercises = async () => {
    try {
        const data = await getAllExercises();
        setExercises(data);
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
    };

    fetchExercises();
}, []);

if (loading) return <p>Loading exercises...</p>;
if (error) return <p>Error loading exercises: {error}</p>;

return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
    {exercises.length > 0 ? (
        exercises.map((exercise) => (
        <Card
            key={exercise._id}
            className="w-96 bg-base-100 shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/50"
        >
            <Card.Body
            className="text-lg mb-2 bg-cover bg-center"
            style={{ backgroundImage: "url(/public/add-first-exercise-2.jpg)" }}
            >
            <div className="flex flex-col w-full h-full justify-center p-4 rounded-md bg-white bg-opacity-55 text-wrap">
                <Card.Title>
                <FireIcon className="h-5 w-5 mr-2 inline-block text-orange-500" />
                <strong className="text-center text-2xl">{exercise.title}</strong>
                </Card.Title>
                <p>{exercise.description}</p>
                <p>
                <strong>Level:</strong> {exercise.level}
                </p>
                <p>
                <strong>Duration:</strong> {exercise.duration} minutes
                </p>
                <p>
                <strong>Rating:</strong> {exercise.rating}
                </p>
                <p>
                <strong>Created On:</strong> {new Date(exercise.createdOn).toLocaleDateString()}
                </p>
                <p>
                <strong>Owner:</strong> {exercise.owner}
                </p>
                <p>
                <strong>Is Private:</strong> {exercise.isPrivate ? 'Yes' : 'No'}
                </p>
            </div>
            <Card.Actions className="justify-end">
                <Button className="btn btn-md btn-warning">Start Workout</Button>
            </Card.Actions>
            </Card.Body>
        </Card>
        ))
    ) : (
        <p>No exercises found.</p>
    )}
    </div>
);
};

export default Exercises;