import { useEffect, useState } from "react";
import { Modal, Button } from "react-daisyui";
import { completeExercise, updateExercise } from "../../api/exercise/exercise";
import { useApp } from "../../hooks/useApp";

const ExerciseModal = ({ exercise, isOpen, onClose }) => {
  const app = useApp();
  const [timer, setTimer] = useState(0);
  const [isTiming, setIsTiming] = useState(false);
  const [exerciseState, setExerciseState] = useState({});

  useEffect(() => {
    let interval = null;
    if (isTiming) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (!isTiming && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTiming, timer]);

  useEffect(() => {
    if (!isOpen) {
      setIsTiming(false);
      setTimer(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (exercise) {
      const state = exerciseState[exercise._id] || { completed: false, completionTime: null };
      setIsTiming(false);
      setTimer(0);
      setExerciseState((prev) => ({
        ...prev,
        [exercise._id]: state,
      }));
    }
  }, [exercise]);

  const handleCompleteExercise = async () => {
    try {
      await completeExercise(app, exercise._id, exercise.owner);
      const completionTime = new Date();
      setExerciseState((prev) => ({
        ...prev,
        [exercise._id]: { completed: true, completionTime },
      }));
      setIsTiming(false);
    } catch (error) {
      console.error("Failed to complete exercise:", error);
    }
  };

  const handleResetCompletion = async () => {
    try {
      const updatedExercise = {
        ...exercise,
        completedBy: (exercise.completedBy || []).filter((ownerId) => ownerId !== app.currentUser.id),
      };
      await updateExercise(app, updatedExercise);
      setExerciseState((prev) => ({
        ...prev,
        [exercise._id]: { completed: false, completionTime: null },
      }));
    } catch (error) {
      console.error("Failed to reset completion:", error);
    }
  };

  const currentExerciseState = exerciseState[exercise?._id] || { completed: false, completionTime: null };

  return (
    <Modal open={isOpen} onClose={onClose} className="max-w-lg mx-auto p-4">
      {exercise && (
        <Modal.Body className="bg-white p-6 rounded-lg shadow-md">
          <div className="bg-blue-200 p-4 rounded-lg shadow-lg text-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-800">{exercise.title}</h3>
          </div>
          {currentExerciseState.completed ? (
            <div className="text-center mb-4">
              <p className="text-green-500 text-lg font-medium">Completed on: {new Date(currentExerciseState.completionTime).toLocaleString()}</p>
            </div>
          ) : (
            <div className="flex justify-center items-center mb-4">
              <div className="relative w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}</span>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      )}
      <Modal.Actions className="flex justify-end space-x-4">
        {currentExerciseState.completed ? (
          <Button onClick={handleResetCompletion} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg">
            Reset Exercise
          </Button>
        ) : (
          <Button onClick={handleCompleteExercise} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
            Complete Exercise
          </Button>
        )}
        <Button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg">
          Close
        </Button>
        {!currentExerciseState.completed && (
          <Button color="primary" onClick={() => setIsTiming(!isTiming)} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg">
            {isTiming ? "Pause Timer" : "Start Timer"}
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
};

export default ExerciseModal;