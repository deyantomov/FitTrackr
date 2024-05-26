import { useApp } from "../../hooks/useApp";
import AuthButtons from "../../components/AuthButtons/AuthButtons";
import FeatureCard from "./FeatureCard/FeatureCard";
import CompleteProfile from "./CompleteProfile/CompleteProfile";
import ConnToFb from "./ConnToFb/ConnToFb";
import AddFirstExercise from "./AddFirstExercise/AddFirstExercise";
import { useEffect, useState } from "react";
import { getUserById } from "../../api/api";
import { useCompleteProfile } from "../../hooks/useCompleteProfile";
import Progress from "./Progress/Progress";
import { Link } from "react-router-dom";
import { Button } from "react-daisyui";

export default function Home() {
  const app = useApp();
  const [user, setUser] = useState({});
  const [progress, setProgress] = useState(useCompleteProfile());
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      if (app.currentUser && app.currentUser.id) {
        const user = await getUserById(app.currentUser.id);

        if (user) {
          setUser(user);
        }
      }
    };

    getUser();
  }, [app.currentUser]);

  useEffect(() => {
    const totalFields = Object.keys(progress).length;
    const completedFields = Object.values(progress).filter(
      (field) => field
    ).length;
    setProgressPercentage(((completedFields / totalFields) * 100) || 0);
    console.log();
  });

  return (
    <>
      {app.currentUser ? (
        <>
          <div className="flex flex-col align-center items-center w-full h-full mt-8 p-2">
            <h2 className="text-4xl xl:text-5xl mb-8 mt-6 text-center">
              Finish setting up your profile
            </h2>
            <div className="flex flex-col xl:flex-row gap-12 mt-12 mb-0">
              {progressPercentage < 100 && (
                <CompleteProfile uid={app.currentUser.id} />
              )}
              <ConnToFb uid={app.currentUser.id} />
              {user.exercises && user.exercises.own.length > 0 ? null : (
                <AddFirstExercise uid={app.currentUser.id} />
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center align-center items-center w-full m-0 p-0">
            <hr className="border border-t-1 border-t-gray w-48 mb-12" />
            <h2 className="text-4xl xl:text-5xl my-8 text-center">
              Track your progress
            </h2>
            <Link to="/goals">
              <Button
                className="mt-4 border-0 text-black rounded-lg"
                style={{ backgroundColor: "rgb(255, 255, 255)" }}
              >
                Set goals
              </Button>
            </Link>
            <Progress></Progress>
          </div>
        </>
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
