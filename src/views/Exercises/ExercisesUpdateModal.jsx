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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-80 transition-opacity" aria-hidden="true"></div>
      <Modal open={isOpen} onClose={onClose} className=" z-60 border border-gray-400 rounded-lg overflow-hidden bg-white shadow-lg w-96">
        <Modal.Header className="text-2xl font-bold text-center text-blue-500 bg-gray-200 py-4">Update Exercise</Modal.Header>
        <Modal.Body className="p-6">
          <div className="form-control mb-6">
            <label className="label text-lg font-semibold">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-lg border border-gray-400 rounded-lg px-3 py-2 w-full" />
          </div>
          <div className="form-control mb-6">
            <label className="label text-lg font-semibold">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="text-lg border border-gray-400 rounded-lg px-3 py-2 w-full" />
          </div>
          <div className="form-control mb-6">
            <label className="label text-lg font-semibold">Level</label>
            <Select value={level} onChange={(e) => setLevel(e.target.value)} className="text-lg border border-gray-400 rounded-lg px-3 py-2 w-full">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="pro">Pro</option>
            </Select>
          </div>
          <div className="form-control mb-6">
            <label className="label text-lg font-semibold">Duration (minutes)</label>
            <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="text-lg border border-gray-400 rounded-lg px-3 py-2 w-full"/>
          </div>
          <div className="form-control mb-6">
            <label className="label text-lg font-semibold">Privacy</label>
            <Select value={isPrivate} onChange={(e) => setIsPrivate(e.target.value === "true")} className="text-lg border border-gray-400 rounded-lg px-3 py-2 w-full">
              <option value="false">Public</option>
              <option value="true">Private</option>
            </Select>
          </div>
        </Modal.Body>
        <Modal.Actions className="bg-gray-200 py-4 px-6 flex justify-end">
          <Button onClick={handleUpdate} className="btn-primary text-lg font-semibold mr-4">Update</Button>
          <Button onClick={onClose} className="btn-secondary text-lg font-semibold">Cancel</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
  
};

export default UpdateExerciseModal;
