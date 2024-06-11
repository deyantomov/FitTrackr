import {
  createUser,
  getAllUsers,
  getUserByHandle,
  getUserByEmail,
  getUserById,
  updateUserProfile,
  getProfilePic,
  setUserOnlineStatus,
  getFriendList,
  storeAccessTokens
} from "./user/user";

import {
  createNewExercise,
  updateExercise,
  removeExercise,
  getAllExercises,
  getExerciseById,
  getExercisesByUserId,
  getExercisesByDifficulty,
  sortExercisesByRating,
  getExerciseImage,
  likeExercise,
  completeExercise,
  getAllExercisesNoPagination,
} from "./exercise/exercise";

import {
  createNewGoal,
  getAllGoals,
  removeGoal,
} from "./goal/goal";

import {
  updateWeeklyStreak,
  updateSteps,
  updateCalories,
  updateDistance,
} from "./activity/activity";

import {
  sendFriendRequest,
  acceptFriendRequest,
  markNotificationAsRead,
} from "./notification/notification";

import {
  reportABug
} from "./report/report";

export default {
  createUser,
  getAllUsers,
  getUserByHandle,
  getUserByEmail,
  getUserById,
  updateUserProfile,
  getProfilePic,
  setUserOnlineStatus,
  createNewExercise,
  updateExercise,
  removeExercise,
  getAllExercises,
  getExercisesByUserId,
  getExercisesByDifficulty,
  sortExercisesByRating,
  getExerciseImage,
  likeExercise,
  createNewGoal,
  getAllGoals,
  removeGoal,
  updateWeeklyStreak,
  updateSteps,
  updateCalories,
  updateDistance,
  sendFriendRequest,
  acceptFriendRequest,
  markNotificationAsRead,
  getFriendList,
  getExerciseById,
  completeExercise,
  storeAccessTokens,
  getAllExercisesNoPagination,
  reportABug
};