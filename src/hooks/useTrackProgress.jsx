import { useState, useEffect } from 'react';
import { getUserById } from '../api/api';

export default function useTrackProgress(app, trackParam) {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const fetchProgress = async () => {
      const currentUser = app.currentUser;

      if (currentUser) {
        const user = await getUserById(currentUser.id);

        if (user[trackParam] && trackParam === "exercise") {
          setProgress({weekly: user[trackParam].length});
          return;
        }

        if (user[trackParam]) {
          setProgress(user[trackParam]);
        }
      }
    };

    fetchProgress();
  }, [app, trackParam]);

  return progress;
}