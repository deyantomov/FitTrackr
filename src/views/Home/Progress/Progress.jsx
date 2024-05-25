import ProgressCard from "./ProgressCard/ProgressCard";

export default function Activities() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-32 p-12 justify-center align-center place-items-center">
      <ProgressCard trackParam="steps" imgName="steps" title="Steps" />
      <ProgressCard trackParam="distance" imgName="distance" title="Distance" />
      <ProgressCard trackParam="energyBurned" imgName="energy-burned" title="Energy Burned" />
      <ProgressCard trackParam="exerciseDays" imgName="exercise-days" title="Exercise Streak" />
    </div>
  );
}