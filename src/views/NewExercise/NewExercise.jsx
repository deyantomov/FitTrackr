import { useState } from "react";
import { createNewExercise } from "../../api/api";
import { useApp } from "../../hooks/useApp";
import {
  LockClosedIcon,
  ClockIcon,
  ChartBarIcon,
  PencilIcon,
  DocumentTextIcon,
} from "@heroicons/react/16/solid";
import { Input } from "react-daisyui";
import { imageToBase64 } from "../../common/utils";

const NewExerciseForm = () => {
  const app = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("beginner");
  const [duration, setDuration] = useState(0);
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [img, setImage] = useState(); //  use an Input of type "file" to get e.target.files[0]
  const [imageURL, setImageURL] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    //  converting the image to base64 for storage
    let base64 = img;
    if (img) {
      const b64 = await imageToBase64(img);
      if (b64) {
        base64 = b64;
      }
    }

    if (app.currentUser) {
      const exercise = {
        title,
        description,
        img: base64,
        level,
        duration,
        isPrivate,
      };
      try {
        await createNewExercise(app, exercise);
        setSuccess("Exercise created successfully!");
        resetForm();
      } catch (error) {
        setError("Failed to create exercise. Please try again.");
        console.error("Error creating new exercise:", error);
      }
    } else {
      setError("You must be logged in to create an exercise.");
    }
  };

  const validateForm = () => {
    if (!title || title.length < 4 || title.length > 30) {
      setError("Title must be between 4 and 30 characters.");
      return false;
    }
    if (!description) {
      setError("Description is required.");
      return false;
    }
    if (!level) {
      setError("Level is required.");
      return false;
    }
    if (isNaN(duration) || duration < 0) {
      setError("Duration must be a non-negative number.");
      return false;
    }
    setError("");
    return true;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLevel("beginner");
    setDuration(0);
    setIsPrivate(false);
    setImage(null);
  };

  return (
    <div className="flex justify-center align-center items-center p-6">
      <div className="form-control w-auto md:w-1/2 lg:w-1/3 mx-auto p-4 bg-base-200 rounded-box">
        <form onSubmit={handleSubmit}>
          <span>Title:</span>
          <label className="label mb-4 w-full">
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full"
            />
          </label>
          <span>Description:</span>
          <label className="label mb-4 w-full">
            <PencilIcon className="h-5 w-5 mr-2" />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full"
            />
          </label>
          <span>Level:</span>
          <label className="label mb-4 w-full">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="pro">Pro</option>
            </select>
          </label>
          <span>Duration (in minutes):</span>
          <label className="label mb-4 w-full">
            <ClockIcon className="h-5 w-5 mr-2" />
            <input
              type="number"
              min="0"
              placeholder="Duration"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="input input-bordered w-full"
            />
          </label>
          <span>Private:</span>
          <label className="flex items-center space-x-2">
            <LockClosedIcon className="h-5 w-5 mr-2" />
            <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="checkbox checkbox-accent text-accent h-6 w-6"
            />
            <span className="text-sm text-gray-500">Tick the box to make private</span>
            </label>
            <label className="btn bg-transparent px-4 py-2 mx-auto text-black-500 border border-yellow-500 hover:bg-yellow-500 hover:text-white">
              <span>Upload Image</span>
              <input
              type="file"
              className="hidden"
              onChange={e => {
                setImage(e.target.files[0]);
                setImageURL(URL.createObjectURL(e.target.files[0]));
              }}
              />
              </label>
              {imageURL && (
              <div className="flex items-center space-x-2">
                <img src={imageURL} alt="Preview" className="mt-4 w-32 h-32 object-cover"/>
                <span className="text-sm text-gray-500">← Current image uploaded</span>
                </div>
              )}
          <button
            type="submit"
            className="btn bg-yellow-500 px-8 py-4 w-full md:auto rounded"
          >
            Add Exercise
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default NewExerciseForm;
