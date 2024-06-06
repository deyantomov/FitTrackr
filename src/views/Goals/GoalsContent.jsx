import GoalsCard from "../../components/Goals/GoalsCard";
import { Card, Button, Modal, Input } from "react-daisyui";
import { useApp } from "../../hooks/useApp";
import api from "../../api/api";
import { useEffect, useState, useRef } from "react";
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

  const periodToShowRef = useRef(periodToShow);

  useEffect(() => {
    periodToShowRef.current = periodToShow;
  }, [periodToShow]);

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
        userGoals.filter((eachGoal) => eachGoal.period === periodToShowRef.current)
      );
    };

    // const deleteGoal = async () => {
    //   const result = await removeGoal(app, '665c4e30f7dfa1ba59a7118a');
    //   console.log(result);
    // }

    getGoals();

    // deleteGoal();
  }, [periodToShowRef]);

  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      const listenForChanges = async () => {
        const collection = app.currentUser.mongoClient("mongodb-atlas")
          .db("sample_data")
          .collection("goals");
          
        const changeStream = collection.watch();

        const cleanup = () => {
          changeStream.close();
        };

        try {
          for await (const change of changeStream) {
            if (!change.fullDocument) {
              continue; 
            }

            if (change.fullDocument.period === periodToShowRef.current) {
              setUserGoals([...userGoals, change.fullDocument]);
            }
          }
        } catch (err) {
          console.error("Error listening to change stream:", err);
        } finally {
          cleanup();
        }
  
        return cleanup;
      };
    
      listenForChanges();
    }

    return () => {
      isMounted = false;
    };
  }, [app, periodToShowRef]);

  useEffect(() => {
    const getUser = async () => {
      setCurrentUser(await getUserById(app.currentUser.id));
    };
    getUser();
  }, [app]);

  function goalSetFunction(metric) {
    const filteredByPeriod = userGoals.filter((goal) => goal.period === periodToShowRef.current);

    switch(metric) {
    case "steps":
      return filteredByPeriod.length > 0 ? filteredByPeriod[0].target.steps : null;
    case "distance":
      return filteredByPeriod.length > 0 ? filteredByPeriod[0].target.distance : null;
    case "calories":
      return filteredByPeriod.length > 0 ? filteredByPeriod[0].target.calories : null;
    }
  }
  function goalName() {
    const result =
      userGoals.length > 0
        ? userGoals.filter((eachGoal) => eachGoal.period === periodToShowRef.current)
          .length > 0
          ? userGoals.filter((eachGoal) => eachGoal.period === periodToShowRef.current)[0]
            .title
          : "No goal set for this time period"
        : "No goal set for this time period";

    return result;
  }

  function currentProgressFunction(metric) {
    const result =
      Object.keys(currentUser).length > 0
        ? currentUser[metric][periodToShowRef.current]
        : 0;
    return result;
  }

  return (
    <div className="flex flex-col justify-center align-center items-center h-full">
      <h1 className="font-thin">
        <b>Title:</b> {goalName()}
      </h1>

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
        {goalSetFunction("steps") && (
          <GoalsCard
            key={1}
            metricTitle="STEPS"
            currentProgress={currentProgressFunction("steps")}
            goalSet={goalSetFunction("steps")}
            metricString="steps"
          ></GoalsCard>
        )}
        {goalSetFunction("steps") && (
          <GoalsCard
            metricTitle="DISTANCE"
            currentProgress={currentProgressFunction("distance")}
            goalSet={goalSetFunction("distance")}
            metricString="meters"
          ></GoalsCard>
        )}
        {goalSetFunction("steps") && (
          <GoalsCard
            metricTitle="CALORIES"
            currentProgress={currentProgressFunction("calories")}
            goalSet={goalSetFunction("calories")}
            metricString="calories"
          ></GoalsCard>
        )}
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
