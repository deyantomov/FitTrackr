import { useApp } from "../../hooks/useApp";
import AuthButtons from "../AuthButtons/AuthButtons";
import FeatureCard from "./FeatureCard/FeatureCard";

export default function Home() {
  const app = useApp();

  return (
    <>
      {app.currentUser ? (
        <h2 className="text-3xl">Home page</h2>
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
                  <p className="text-6xl md:text-7xl lg:text-8xl text-white mb-8 font-light">
                    FitTrackr
                  </p>
                  <AuthButtons></AuthButtons>
                </div>
              </div>
            </div>
            <h2 className="mt-8 md:mt-10 lg:mt-12 mb-0 md:mb-2 lg:mb-6 font-light text-5xl md:text-6xl lg:text-7xl">Features</h2>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-12 w-full my-6">
              <FeatureCard
                img="exercises.jpg"
                title="Track your daily activity"
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
