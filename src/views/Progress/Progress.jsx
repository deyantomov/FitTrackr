import StepsProgress from "./StepsProgress/StepsProgress";

export default function Activities() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12 p-12 justify-center align-center place-items-center">
      <StepsProgress />
    </div>
  );
}