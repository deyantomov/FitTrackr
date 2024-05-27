import GoalsCard from "../../components/Goals/GoalsCard";
import { Card, Button, Modal, Input } from "react-daisyui";
import { useApp } from "../../hooks/useApp";
import { createNewGoal, getAllGoals } from "../../api/api";
import { useEffect, useState } from "react";
import {
  ChevronDoubleRightIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/16/solid";

export default function Goals() {
  const app = useApp();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);
  const [weeklyStreak, setWeeklyStreak] = useState(0);
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (app.currentUser) {
      const goal = {
        title,
        type,
        steps,
        calories,
        distance,
        weeklyStreak,
        duration,
      };
      try {
        await createNewGoal(app, goal);
        setSuccess("Goal created successfully!");
        resetForm();
      } catch (error) {
        setError("Failed to create goal. Please try again.");
        console.error("Error creating new goal:", error);
      }
    } else {
      setError("You must be logged in to create a goal.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setType("");
    setSteps(0);
    setCalories(0);
    setDistance(0);
    setWeeklyStreak(0);
    setDuration(0);
  };

  // useEffect(() => {
  //   const createGoal = async () => {
  //     const goalObj = {
  //       title: 'Test',
  //       type: 'Activity',
  //       steps: 10000,
  //       calories: null,
  //       distance: null,
  //       weeklyStreak: null,
  //       duration: 'Daily'
  //     }

  //     const res = await createNewGoal(app, goalObj);

  //     console.log(res);
  //   }

  //   createGoal();
  // }, [])

  useEffect(() => {
    const getGoals = async () => {
      console.log("h");
      const userGoals = await getAllGoals(app);
      console.log(userGoals);
    };

    getGoals();
  }, [app.currentUser]);

  return (
    <div className="h-full">
      <h1>Example view:</h1>
      <Button
        className="btn btn-warning"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        Set new goal
      </Button>
      <dialog id="my_modal_1" className="modal">
        <div
          className="form-control w-auto md:w-1/2 lg:w-1/3 mx-auto p-4 bg-base-200 rounded-box"
          style={{
            border: "2px solid white",
            maxHeight: "500px",
            overflowY: "auto",
            scrollbarWidth: "thin",
          }}
        >
          <form onSubmit={handleSubmit}>
            <span>Goal title:</span>
            <label className="label mb-4 w-full">
              <ChevronDoubleRightIcon className="h-5 w-5 mr-2" />
              <input
                type="text"
                placeholder="Goal title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
              />
            </label>
            <span>Goal type:</span>
            <label className="label mb-4 w-full">
              <ChevronDoubleRightIcon className="h-5 w-5 mr-2" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="activity">Activity</option>
                <option value="health">Health</option>
              </select>
            </label>
            <span>Steps:</span>
            <label className="label mb-4 w-full">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
              <input
                type="number"
                placeholder="Number of steps"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                className="input input-bordered w-full"
              />
            </label>
            <span>Calories:</span>
            <label className="label mb-4 w-full">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
              <input
                type="number"
                placeholder="Calories burned"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="input input-bordered w-full"
              />
            </label>
            <span>Distance:</span>
            <label className="label mb-4 w-full">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
              <input
                type="number"
                placeholder="Distance passed"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="input input-bordered w-full"
              />
            </label>
            <span>Weekly streak:</span>
            <label className="label mb-4 w-full">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
              <input
                type="number"
                placeholder="Weekly streak"
                value={weeklyStreak}
                onChange={(e) => setWeeklyStreak(e.target.value)}
                className="input input-bordered w-full"
              />
            </label>
            <span>Duration:</span>
            <label className="label mb-4 w-full">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
              <input
                type="string"
                placeholder="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="input input-bordered w-full"
              />
            </label>
            <button
              type="submit"
              className="btn bg-yellow-500 px-8 py-4 w-full md:auto rounded"
            >
              Set Goal
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm mt-2">{success}</p>
            )}
            <form
              method="dialog"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button className="btn-error mt-3 w-24">Close</Button>
            </form>
          </form>
        </div>
      </dialog>
      <GoalsCard></GoalsCard>
    </div>
  );
}
