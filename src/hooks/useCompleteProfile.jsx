import api from "../api/api";
import { useState, useEffect } from "react";
import { useApp } from "../hooks/useApp";

const { getUserById } = api;

export function useCompleteProfile() {
  const app = useApp();
  const [progress, setProgress] = useState({});
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      if (app.currentUser) {
        const user = await getUserById(app.currentUser.id);
        setCurrentUser(user);
      }
    }

    fetchUser();
  }, [app.currentUser]);

  useEffect(() => {
    const trackData = async () => {
      currentUser?.age ? setProgress(prev => ({ ...prev, age: true })) : setProgress(prev => ({ ...prev, age: false }));
      currentUser?.phoneNumber ? setProgress(prev => ({ ...prev, phoneNumber: true })) : setProgress(prev => ({ ...prev, phoneNumber: false }));
      currentUser?.weight ? setProgress(prev => ({ ...prev, weight: true })) : setProgress(prev => ({ ...prev, weight: false }));
      currentUser?.height ? setProgress(prev => ({ ...prev, height: true })) : setProgress(prev => ({ ...prev, height: false }));
      currentUser?.profilePic ? setProgress(prev => ({ ...prev, profilePic: true })) : setProgress(prev => ({ ...prev, profilePic: false }));
    }

    trackData();
  }, [currentUser]);
  
  return progress;
}