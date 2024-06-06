import GoalsCard from "../../components/Goals/GoalsCard";
import { Card, Button, Modal, Input } from "react-daisyui";
import { useApp } from "../../hooks/useApp";
import api from "../../api/api";
import { useEffect, useState } from "react";
import {
  ChevronDoubleRightIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/16/solid";

const { createNewGoal, getAllGoals, getUserById, removeGoal } = api;

export default function Goals() {
  const app = useApp();
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);
  // const [type, setType] = useState({ steps, calories, distance });
  const [type, setType] = useState("steps");
  const [target, setTarget] = useState({});
  const [targetNumber, setTargetNumber] = useState(0);

  const [period, setPeriod] = useState("daily");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userGoals, setUserGoals] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  (async function getCurrentUser() {
    const currentUser = await getUserById(app.currentUser.id);
    // console.log(currentUser);
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updatedTarget = { ...target };
    switch (type) {
      case "steps":
        updatedTarget.steps = targetNumber;
        break;
      case "distance":
        updatedTarget.distance = targetNumber;
        break;
      case "calories":
        updatedTarget.calories = targetNumber;
        break;
    }
    console.log(target);

    setError("");
    setSuccess("");

    if (app.currentUser) {
      const goal = {
        title,
        type,
        target: updatedTarget,
        period,
      };

      console.log("goal log: ", goal);
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
    setType("steps");
    setSteps(0);
    setCalories(0);
    setDistance(0);
    // setWeeklyStreak(0);
    setPeriod("daily");
    setTarget({});
    setTargetNumber(0);
  };

  useEffect(() => {
    const getGoals = async () => {
      setUserGoals(await getAllGoals(app));
    };

    // const deleteGoal = async () => {
    //   const result = await removeGoal(app, '665c4e30f7dfa1ba59a7118a');
    //   console.log(result);
    // }

    getGoals();
    // deleteGoal();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      setCurrentUser(await getUserById(app.currentUser.id));
    };
    getUser();
  }, []);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   switch (name) {
  //     case "type":
  //       setType(value);
  //     case "steps":
  //       setSteps(value);
  //     case "calories":
  //       setCalories(value);
  //     case "distance":
  //       setDistance(value);
  //     default:
  //       throw new Error("Incorrect form filling!");
  //   }
  // };
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "type") {
  //     setType(value);
  //   } else {
  //     if (name === "steps") {
  //       setSteps(parseInt(value));
  //     } else if (name === "calories") {
  //       setCalories(parseInt(value));
  //     } else if (name === "distance") {
  //       setDistance(parseInt(value));
  //     }
  //     // setType({ steps: steps, calories: calories, distance: distance });
  //   }

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
                // onChange={(e) => setType(e.target.value)}
                onChange={(e) => setType(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="steps">Steps</option>
                <option value="calories">Calories</option>
                <option value="distance">Distance</option>
              </select>
            </label>
            <span>Target:</span>
            <label className="label mb-4 w-full">
              <ChevronDoubleRightIcon className="h-5 w-5 mr-2" />
              <input
                type="number"
                placeholder="Goal target:"
                value={targetNumber}
                onChange={(e) => setTargetNumber(e.target.value)}
                className="input input-bordered w-full"
              />
            </label>
            {/* <label className="label mb-4 w-full">
              <ChevronDoubleRightIcon className="h-5 w-5 mr-2" />
              <input
                type="number"
                placeholder="Goal target:"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="input input-bordered w-full"
              />
            </label>
            <label className="label mb-4 w-full">
              <ChevronDoubleRightIcon className="h-5 w-5 mr-2" />
              <input
                type="number"
                placeholder="Goal target:"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="input input-bordered w-full"
              />
            </label> */}

            <span>Period:</span>
            <label className="label mb-4 w-full">
              <ChevronDoubleRightIcon className="h-5 w-5 mr-2" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
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
      <div
        className="card-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          gap: "30px",
        }}
      >
        <GoalsCard
          key={1}
          metricTitle="STEPS"
          currentProgress={
            Object.keys(currentUser).length > 0 ? currentUser.steps.daily : 0
          }
          goalSet={userGoals.length > 0 ? userGoals[0].steps : 0}
          metricString="steps"
        ></GoalsCard>
        <GoalsCard
          metricTitle="DISTANCE"
          currentProgress={
            Object.keys(currentUser).length > 0 ? currentUser.distance.daily : 0
          }
          goalSet={userGoals.length > 0 ? userGoals[0].distance : 0}
          metricString="meters"
        ></GoalsCard>
        <GoalsCard
          metricTitle="CALORIES"
          currentProgress={
            Object.keys(currentUser).length > 0 ? currentUser.calories.daily : 0
          }
          goalSet={userGoals.length > 0 ? userGoals[0].calories : 0}
          metricString="calories"
        ></GoalsCard>
        {/* <GoalsCard
          metricTitle="WORKOUT PERIOD"
          currentProgress="22"
          goalSet={userGoals.length > 0 ? userGoals[0].duration : 0}
          metricString="minutes"
        ></GoalsCard> */}
      </div>
    </div>
  );
}
