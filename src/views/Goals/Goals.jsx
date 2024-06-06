import { useState } from "react";
import { TrophyIcon } from "@heroicons/react/24/outline";
import GoalsContent from "./GoalsContent";

export default function Goals() {
  const [timePeriod, setTimePeriod] = useState("daily");

  return (
    <div className="flex flex-col justify-center align-center items-center h-full p-8"style={{ textAlign: "center" }}>
      <h2 className="font-thin text-6xl mb-4">Select a time period</h2>
      <select
        className="select select-warning w-full max-w-xs mb-8"
        style={{ margin: "20px" }}
        onChange={(e) => setTimePeriod(e.target.value.toLowerCase())}
      >
        <option>Daily</option>
        <option>Weekly</option>
        <option>Monthly</option>
      </select>
      <GoalsContent periodToShow={timePeriod}></GoalsContent>
    </div>
  );
}

