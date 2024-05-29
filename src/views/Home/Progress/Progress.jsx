import ProgressCard from "./ProgressCard/ProgressCard";

export default function Activities() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-32 p-12 justify-center align-center place-items-center">
      <ProgressCard key="steps" trackParam="steps" imgName="steps" title="Steps" />
      <ProgressCard key="distance" trackParam="distance" imgName="distance" title="Distance" />
      <ProgressCard key="calories" trackParam="calories" imgName="energy-burned" title="Energy Burned" />
      <ProgressCard key="exercise" trackParam="exercise" imgName="exercise-days" title="Exercise Streak" />
    </div>
  );
}