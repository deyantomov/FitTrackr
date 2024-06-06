import GoalsCard from "../../components/Goals/GoalsCard";
import { Card, Button, Modal, Input } from "react-daisyui";
import { useApp } from "../../hooks/useApp";
import api from "../../api/api";
import { useEffect, useState } from "react";
import {
  ChevronDoubleRightIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/16/solid";
import CreateNewGoal from "./CreateNewGoal";

const { createNewGoal, getAllGoals, getUserById, removeGoal } = api;

export default function GoalsContent({ periodToShow }) {
  console.log("period to show: ", periodToShow);
  const app = useApp();
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);
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
    setPeriod("daily");
    setTarget({});
    setTargetNumber(0);
  };

  useEffect(() => {
    const getGoals = async () => {
      setUserGoals(await getAllGoals(app));

      console.log(
        "userGoals filtered",
        userGoals.filter((eachGoal) => eachGoal.period === periodToShow)
      );
    };

    // const deleteGoal = async () => {
    //   const result = await removeGoal(app, '665c4e30f7dfa1ba59a7118a');
    //   console.log(result);
    // }

    getGoals();

    // deleteGoal();
  }, [periodToShow]);

  useEffect(() => {
    const getUser = async () => {
      setCurrentUser(await getUserById(app.currentUser.id));
    };
    getUser();
  }, []);

  function goalSetFunction(metric) {
    const result =
      userGoals.length > 0
        ? userGoals.filter((eachGoal) => eachGoal.period === periodToShow)
            .length > 0
          ? userGoals.filter((eachGoal) => eachGoal.period === periodToShow)[0]
              .target[metric]
            ? userGoals.filter(
                (eachGoal) => eachGoal.period === periodToShow
              )[0].target[metric]
            : 0
          : 0
        : 0;
    return result;
  }
  function goalName() {
    const result =
      userGoals.length > 0
        ? userGoals.filter((eachGoal) => eachGoal.period === periodToShow)
            .length > 0
          ? userGoals.filter((eachGoal) => eachGoal.period === periodToShow)[0]
              .title
          : "no title"
        : "no title";
    return result;
  }

  return (
    <div className="h-full">
      <h1>*{goalName()}*</h1>

      <div
        className="card-container"
        style={{
          marginTop: "40px",
          marginBottom: "10px",
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
          goalSet={goalSetFunction("steps")}
          metricString="steps"
        ></GoalsCard>
        <GoalsCard
          metricTitle="DISTANCE"
          currentProgress={
            Object.keys(currentUser).length > 0 ? currentUser.distance.daily : 0
          }
          goalSet={goalSetFunction("distance")}
          metricString="meters"
        ></GoalsCard>
        <GoalsCard
          metricTitle="CALORIES"
          currentProgress={
            Object.keys(currentUser).length > 0 ? currentUser.calories.daily : 0
          }
          goalSet={goalSetFunction("calories")}
          metricString="calories"
        ></GoalsCard>
      </div>
      <Button
        className="btn btn-warning"
        onClick={() => document.getElementById("my_modal_1").showModal()}
        style={{ margin: "20px" }}
      >
        Set new goal
      </Button>

      <CreateNewGoal
        handleSubmit={handleSubmit}
        title={title}
        setTitle={setTitle}
        type={type}
        setType={setType}
        targetNumber={targetNumber}
        setTargetNumber={setTargetNumber}
        period={period}
        setPeriod={setPeriod}
        error={error}
        success={success}
      ></CreateNewGoal>
    </div>
  );
}
