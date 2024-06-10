import { useState, useEffect } from "react";
import { Modal, Button, Input, Textarea, Select } from "react-daisyui";
import { useApp } from "../../hooks/useApp";

const UpdateExerciseModal = ({ exercise, isOpen, onClose, onUpdate }) => {
  const app = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [exerciseId, setExerciseId] = useState("");
  
  useEffect(() => {
    if (exercise) {
      setTitle(exercise.title || "");
      setDescription(exercise.description || "");
      setLevel(exercise.level || "beginner");
      setDuration(exercise.duration || 0);
      setIsPrivate(exercise.isPrivate || false);
      setExerciseId(exercise["_id"] || "");
    }
  }, [exercise]);
  
  const handleUpdate = async () => {
    const updatedExercise = {
      ...exercise,
      id: exerciseId,
      title,
      description,
      level,
      duration,
      isPrivate,
    };
    await onUpdate(updatedExercise);
    onClose();
  };
  
  if (!exercise) {
    return null;
  }

  return (
    <Modal open={isOpen} onClose={onClose} className="z-50">
      <Modal.Header>Update Exercise</Modal.Header>
      <Modal.Body>
        <div className="form-control">
          <label className="label">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-control">
          <label className="label">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">Level</label>
          <Select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="pro">Pro</option>
          </Select>
        </div>
        <div className="form-control">
          <label className="label">Duration (minutes)</label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">Privacy</label>
          <Select value={isPrivate} onChange={(e) => setIsPrivate(e.target.value === "true")}>
            <option value="false">Public</option>
            <option value="true">Private</option>
          </Select>
        </div>
      </Modal.Body>
      <Modal.Actions>
        <Button onClick={handleUpdate} className="btn-primary">Update</Button>
        <Button onClick={onClose} className="btn-secondary">Cancel</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default UpdateExerciseModal;
