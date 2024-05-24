import { getAllExercises } from "../../api/api";
import { useEffect, useState } from "react";
import { Card, Button, Loading } from "react-daisyui";
import { FireIcon, LockClosedIcon, ClockIcon, ChartBarIcon, PencilIcon, CalendarIcon, StarIcon, UserCircleIcon } from '@heroicons/react/16/solid';

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

if (loading) return (
    <div className="flex justify-center items-center h-screen">
    <Loading/>
    </div>
);

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
            <div className="flex flex-col w-full h-full justify-center p-4 rounded-md bg-white bg-opacity-55">
                <Card.Title className="flex items-center justify-center border p-2 bg-yellow-500 rounded bg-opacity-55">
                <FireIcon className="h-5 w-5 mr-2 text-orange-500"/>
                <strong className="text-center text-2xl">{exercise.title}</strong>
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
                <strong className="mr-2">Duration:</strong> {exercise.duration} minutes
                </p>
                <p className="flex items-center">
                <StarIcon className="h-5 w-5 mr-2" />
                <strong className="mr-2">Rating:</strong> {exercise.rating}
                </p>
                <p className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <strong className="mr-2">Created On:</strong> {new Date(exercise.createdOn).toLocaleDateString()}
                </p>
                <p className="flex items-center">
                <UserCircleIcon className="h-5 w-5 mr-2" />
                <strong className="mr-2">Owner:</strong> {exercise.owner}
                </p>
                <p className="flex items-center">
                <LockClosedIcon className="h-5 w-5 mr-2" />
                <strong className="mr-2">Is Private:</strong> {exercise.isPrivate ? 'Yes' : 'No'}
                </p>
                </div>
            </div>
            <Card.Actions className="justify-end">
                <Button className="btn btn-md btn-warning rounded">Start Workout</Button>
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