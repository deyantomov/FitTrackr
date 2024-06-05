import { useEffect, useState } from "react";
import { Modal, Button } from "react-daisyui";

const ExerciseModal = ({ exercise, isOpen, onClose }) => {
  const [timer, setTimer] = useState(0);
  const [isTiming, setIsTiming] = useState(false);

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

  return (
    <Modal open={isOpen} onClickBackdrop={onClose}>
      {exercise && (
        <Modal.Body>
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold">{exercise.title}</h3>
          </div>
          <div className="text-center mb-4 bg-yellow-500 text-white p-2 rounded">
            <span>{timer}s</span>
          </div>
        </Modal.Body>
      )}
      <Modal.Actions>
        <Button onClick={onClose}>Close</Button>
        <Button color="primary" onClick={() => setIsTiming(!isTiming)}>
          {isTiming ? "Pause Timer" : "Start Timer"}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ExerciseModal;