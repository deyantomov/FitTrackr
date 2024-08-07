export const toastTypes = {
  SUCCESS: "success",
  ERROR: "error",
};

export const toastMessages = {
  updatedProgress: "Progress updated",
  failedToUpdateProgress: "Failed to update progress",
  unableToLogin: "Unable to log in",
  successfulLogin: "Successful login",
  unableToGetFriendList: "Unable to retrieve friend list",
  unableToGetUserData: "Unable to retrieve user data",
  successfulFriendRequest: "Friend request sent successfully",
  unsuccessfulFriendRequest: "Failed to send friend request",
  goalTitleTooShort: "Goal title must be between 4 and 30 characters",
  goalCreated: "Goal created successfully!",
  goalError1: "Failed to create goal. Please try again.",
  goalError2: "You must be logged in to create a goal.",
  goalDeleted: "Goal removed successfully!",
  unableToDeleteGoal: "Failed to remove goal",
  unableToGetGoals: "Failed to fetch goals",
  changeStreamError: "Error listening to change stream"
};

export const progressMetrics = {
  steps: "steps",
  distance: "distance",
  calories: "calories",
  weeklyStreak: "weeklyStreak",
};

export const progressUnits = {
  steps: "steps",
  distance: "m",
  calories: "kcal",
  day: "day",
  days: "days",
};

export const progressCardTitles = {
  steps: "Steps",
  distance: "Distance",
  calories: "Energy Burned",
  weeklyStreak: "Exercise Streak"
};

export const numpad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "C"];

export const featureCards = [
  {
    img: "exercises.jpg",
    title: "Track your daily activity and exercises",
    text: "Take control of your fitness journey by tracking your daily exercises and activities. Watch your progress and achieve your milestones with ease.",
  },
  {
    img: "fitbit.jpg",
    title: "Connect with your Fitbit device or profile",
    text:"Stay ahead of the game by linking your Fitbit profile. Track your fitness progress seamlessly with data from your Fitbit device."
  },
  {
    img: "goals.jpg",
    title: "Set and achieve your fitness goals",
    text: "Transform your aspirations into reality by tracking your goals. Reach new heights and celebrate every milestone on your fitness journey."
  }
];

export const mongoCfg = {
  mongoClient: "mongodb-atlas",
  db: "fitDB",
  collections: {
    users: "users",
    online_users: "online_users",
    exercises: "exercises",
    goals: "goals",
    exercise_images: "exercise_images",
    profile_pics: "profile_pics"
  }
};

export const fitbitCfg = {
  authUri: "https://www.fitbit.com/oauth2/authorize",
  tokenUri: "https://api.fitbit.com/oauth2/token",
  client: "23PJ8N",
  scopes: ["activity", "cardio_fitness"],
  redirectUrl: "https://fittrackr-rnylmjz.mongodbstitch.com"
};

export const GOAL_TITLE_MIN_LENGTH = 4;
export const GOAL_TITLE_MAX_LENGTH = 30;

export const periods = {
  daily: "daily",
  weekly: "weekly",
  monthly: "monthly"
};
