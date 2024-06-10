import ProgressCard from "./ProgressCard/ProgressCard";
import { progressMetrics, progressCardTitles } from "../../../common/constants";

export default function Activities() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-32 p-12 justify-center align-center place-items-center">
      <ProgressCard key={progressMetrics.steps} trackParam={progressMetrics.steps} imgName={progressMetrics.steps} title={progressCardTitles.steps} />
      <ProgressCard key={progressMetrics.distance} trackParam={progressMetrics.distance} imgName={progressMetrics.distance} title={progressCardTitles.distance} />
      <ProgressCard key={progressMetrics.calories} trackParam={progressMetrics.calories} imgName="energy-burned" title={progressCardTitles.calories} />
      <ProgressCard key={progressMetrics.weeklyStreak} trackParam={progressMetrics.weeklyStreak} imgName="exercise-days" title={progressCardTitles.weeklyStreak} />
    </div>
  );
}