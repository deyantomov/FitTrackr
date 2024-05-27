import GoalsCard from "../../components/Goals/GoalsCard";
import { useApp } from "../../hooks/useApp";
import { createNewGoal, getAllGoals } from "../../api/api";
import { useEffect } from "react";

export default function Goals() {
  const app = useApp();

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
      console.log('h');
      const userGoals = await getAllGoals(app);
      console.log(userGoals);
    };

    getGoals();
  }, [app.currentUser])
  
  return (
    <div className="h-full">
      <h1>Example view:</h1>
      <GoalsCard></GoalsCard>
    </div>
  );
}
