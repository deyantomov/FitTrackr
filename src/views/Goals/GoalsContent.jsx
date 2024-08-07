import GoalsCard from "../../components/Goals/GoalsCard";
import { Button, Loading } from "react-daisyui";
import { useApp } from "../../hooks/useApp";
import api from "../../api/api";
import { useEffect, useState, useRef } from "react";
import CreateNewGoal from "./CreateNewGoal";
import { mongoCfg } from "../../common/constants";
import { useToast } from "../../hooks/useToast";
import { toastTypes, toastMessages } from "../../common/constants";
import PropTypes from "prop-types";
import { TrashIcon } from "@heroicons/react/24/outline";

import { progressMetrics, periods, GOAL_TITLE_MIN_LENGTH, GOAL_TITLE_MAX_LENGTH } from "../../common/constants";

const { createNewGoal, getAllGoals, getUserById, removeGoal } = api;

/**
 * 
 * @param {{periodToShow: string}} props 
 * @returns {React.FC}
 */
export default function GoalsContent({ periodToShow }) {
  const app = useApp();
  const { setToast } = useToast();
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [distance, setDistance] = useState(0);
  const [type, setType] = useState(progressMetrics.steps);
  const [target, setTarget] = useState({});
  const [targetNumber, setTargetNumber] = useState(0);

  const [period, setPeriod] = useState(periods.daily);
  const [userGoals, setUserGoals] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  const [loading, setLoading] = useState(false);

  const periodToShowRef = useRef(periodToShow);

  useEffect(() => {
    periodToShowRef.current = periodToShow;
  }, [periodToShow]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    let updatedTarget = { ...target };
    switch (type) {
    case progressMetrics.steps:
      updatedTarget.steps = targetNumber;
      break;
    case progressMetrics.distance:
      updatedTarget.distance = targetNumber;
      break;
    case progressMetrics.calories:
      updatedTarget.calories = targetNumber;
      break;
    }

    if (app.currentUser) {
      if (title.length < GOAL_TITLE_MIN_LENGTH || title.length > GOAL_TITLE_MAX_LENGTH) {
        setToast({
          type: toastTypes.ERROR,
          message: toastMessages.goalTitleTooShort
        });

        return setLoading(false);
      }
      
      const goal = {
        title,
        type,
        target: updatedTarget,
        period,
      };

      try {
        await createNewGoal(app, goal);
        setToast({ type: toastTypes.SUCCESS, message: toastMessages.goalCreated });
        resetForm();
      } catch (error) {
        setToast({ type: toastTypes.ERROR, message: toastMessages.goalError1 });
      } finally {
        setLoading(false);
      }
    } else {
      setToast({ type: toastTypes.ERROR, message: toastMessages.goalError2 });
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setType(progressMetrics.steps);
    setSteps(0);
    setCalories(0);
    setDistance(0);
    setPeriod(periods.daily);
    setTarget({});
    setTargetNumber(0);
  };

  useEffect(() => {
    setLoading(true);

    const getGoals = async () => {
      try {
        setUserGoals(await getAllGoals(app));
      } catch (err) {
        setToast({ type: toastTypes.ERROR, message: toastMessages.unableToGetGoals });
      } finally {
        setLoading(false);
      }
    };

    getGoals();
  }, [periodToShow, app, setToast]);

  useEffect(() => {    
    const listenForChanges = async () => {      
      const collection = app.currentUser.mongoClient(mongoCfg.mongoClient)
        .db(mongoCfg.db)
        .collection(mongoCfg.collections.goals);
        
      const changeStream = collection.watch();

      try {
        for await (const change of changeStream) {
          setLoading(true);
          
          if (!change.fullDocument) {
            break; 
          }
  
          if (change.fullDocument.period === periodToShowRef.current) {
            try {
              setUserGoals([...userGoals, change.fullDocument]);
            } catch (err) {
              setToast({ type: toastTypes.ERROR, message: toastMessages.goalError1 });
            }
          }

        
        }
      } catch (err) {
        setToast({ type: toastTypes.ERROR, message: toastMessages.changeStreamError });
      } finally {
        setLoading(false);
      }
    };
  
    listenForChanges();
  }, [app, mongoCfg, periodToShowRef]);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);

      try {
        setCurrentUser(await getUserById(app.currentUser.id));
      } catch (err) {
        setToast({ type: toastTypes.ERROR, message: toastMessages.unableToGetUserData });
      } finally {
        setLoading(false);
      }
      
    };
    getUser();
  }, [app, setToast]);

  function goalSetFunction(metric) {
    const filteredByPeriod = userGoals.length > 0 && 
      userGoals.filter((goal) => goal.period === periodToShowRef.current);

    switch(metric) {
    case progressMetrics.steps:
      return filteredByPeriod.length > 0 ? filteredByPeriod[0].target.steps : null;
    case progressMetrics.distance:
      return filteredByPeriod.length > 0 ? filteredByPeriod[0].target.distance : null;
    case progressMetrics.calories:
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
        ? currentUser[metric] && (currentUser[metric][periodToShowRef.current])
        : 0;
        
    return result;
  }

  const handleRemoveGoal = async () => {
    setLoading(true);

    try {
      const filteredByPeriod = userGoals.length > 0 &&
        userGoals.filter((goal) => goal.period === periodToShowRef.current);
      const currentGoal = filteredByPeriod[0];

      await removeGoal(app, currentGoal["_id"]);
      setUserGoals(goals => goals.filter(goal => goal["_id"] !== currentGoal["_id"]));
      setToast({ type: toastTypes.SUCCESS, message: toastMessages.goalDeleted });
    } catch (error) {
      setToast({ type: toastTypes.ERROR, message: toastMessages.unableToDeleteGoal });
    } finally {
      setLoading(false);
    }
  };

  function hasCurrentPeriodGoals() {
    const filteredByPeriod = userGoals.length> 0 &&
      userGoals.filter((goal) => goal.period === periodToShowRef.current);

    if (filteredByPeriod.length > 0) {
      return filteredByPeriod[0]["_id"] ? true : false;
    } else {
      return false;
    }
  }

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center align-center items-center">
        <Loading/>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center align-center items-center h-full">
      <div className="flex flex-row w-full h-full gap-6 items-center">
        {hasCurrentPeriodGoals() && (
          <TrashIcon onClick={handleRemoveGoal} style={{ maxWidth: "28px" }}  className="text-red-600" />
        )}
        <h1 className="font-thin">
          <b>Title:</b> {goalName()}
        </h1>
      </div>

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
        {goalSetFunction(progressMetrics.steps) && (
          <GoalsCard
            key={1}
            metricTitle="STEPS"
            currentProgress={currentProgressFunction(progressMetrics.steps)}
            goalSet={goalSetFunction(progressMetrics.steps)}
            metricString={progressMetrics.steps}
          ></GoalsCard>
        )}
        {goalSetFunction(progressMetrics.distance) && (
          <GoalsCard
            metricTitle="DISTANCE"
            currentProgress={currentProgressFunction(progressMetrics.distance)}
            goalSet={goalSetFunction(progressMetrics.distance)}
            metricString={progressMetrics.distance}
          ></GoalsCard>
        )}
        {goalSetFunction(progressMetrics.calories) && (
          <GoalsCard
            metricTitle="CALORIES"
            currentProgress={currentProgressFunction(progressMetrics.calories)}
            goalSet={goalSetFunction(progressMetrics.calories)}
            metricString={progressMetrics.calories}
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
        setToast={setToast}
      ></CreateNewGoal>
    </div>
  );
}

GoalsContent.propTypes = {
  periodToShow: PropTypes.string,
};
