import { useApp } from "../../hooks/useApp";
import AuthButtons from "../../components/AuthButtons/AuthButtons";
import FeatureCard from "./FeatureCard/FeatureCard";
import CompleteProfile from "./CompleteProfile/CompleteProfile";
import ConnToFb from "./ConnToFb/ConnToFb";
import AddFirstExercise from "./AddFirstExercise/AddFirstExercise";

export default function Home() {
  const app = useApp();

  return (
    <>
      {app.currentUser ? (
        <div className="flex flex-col align-center items-center w-full h-full mt-12">
          <h2 className="text-5xl mb-4">Finish setting up your profile</h2>
          <div className="flex flex-col xl:flex-row gap-12 mt-12">
            <CompleteProfile uid={app.currentUser.id} />
            <ConnToFb uid={app.currentUser.id}/>
            <AddFirstExercise uid={app.currentUser.id} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center align-center w-full">
          <div className="flex flex-col items-center justify-center align-center w-full h-full overflow-auto">
            <div className="w-full">
              <div
                style={{
                  backgroundImage: `url(${"/public/hero-banner.jpeg"})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div
                  className="text-center w-full flex flex-col justify-center align-center items-center p-9"
                  style={{ background: "rgba(0, 0, 0, 0.3)" }}
                >
                  <p className="text-8xl lg:text-9xl text-white mb-8 font-light">
                    FitTrackr
                  </p>
                  <AuthButtons></AuthButtons>
                </div>
              </div>
            </div>
            <h2 className="mt-8 lg:mt-12 mb-2 lg:mb-6 font-light text-6xl lg:text-7xl">Features</h2>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-36 w-full my-6">
              <FeatureCard
                img="exercises.jpg"
                title="Track your daily activity and exercises"
                text="Take control of your fitness journey by tracking your daily
                  exercises and activities. Watch your progress and achieve your
                  milestones with ease."
              />
              <FeatureCard
                img="fitbit.jpg"
                title="Connect with your Fitbit device or profile"
                text="Stay ahead of the game by linking your Fitbit profile. Track
                  your fitness progress seamlessly with data from your Fitbit
                  device."
              />
              <FeatureCard
                img="goals.jpg"
                title="Set and achieve your fitness goals"
                text="Transform your aspirations into reality by tracking your goals. 
                  Reach new heights and celebrate every milestone on your fitness journey."
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
