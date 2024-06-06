import { useState } from "react";
import { TrophyIcon } from "@heroicons/react/24/outline";
import GoalsContent from "./GoalsContent";

export default function Goals() {
  const [timePeriod, setTimePeriod] = useState("daily");

  return (
    <div style={{ textAlign: "center" }}>
      <select
        className="select select-warning w-full max-w-xs"
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

