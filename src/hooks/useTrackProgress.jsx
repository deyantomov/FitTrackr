import { useState, useEffect, useRef } from "react";
import { getUserById } from "../api/api";

export default function useTrackProgress(app, trackParam, triggerFetch) {
  const [progress, setProgress] = useState({});
  const trackParamRef = useRef(trackParam);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    const fetchProgress = async () => {
      const currentUser = app.currentUser;

      if (currentUser) {
        const user = await getUserById(currentUser.id);

        if (user[trackParam] && trackParam === "exercise") {
          const sortedDates = user[trackParam].sort((a, b) => new Date(b) - new Date(a));
          let streak = 0;
        
          //  if there's only one date, set the streak to 1
          if (sortedDates.length === 1) {
            streak = 1;
          } else if (sortedDates.length !== 0) {
            //  set the streak to 1 if the array is not empty
            streak = 1;

            //  increment the streak
            for (let i = 0; i < sortedDates.length - 1; i++) {
              //  calculate the difference in days between the current date and the previous activity date
              const difference = Math.round((new Date(sortedDates[i]) - new Date(sortedDates[i + 1])) / 86400000);
        
              if (difference > 1) {
                break;
              }
        
              streak++;
            }
          }
        
          setProgress({ weekly: streak });
          return;
        }

        if (user[trackParam]) {
          setProgress(user[trackParam]);
        }
      }
    };

    fetchProgress();
  }, [app.currentUser, trackParam, triggerFetch]);

  useEffect(() => {
    trackParamRef.current = trackParam;
  }, [trackParam]);

  //  real time listener tracking user progress
  useEffect(() => {
    if (progress) {
      isCancelledRef.current = false;
      const getTrackParam = () => trackParamRef.current;
      // console.log(getTrackParam());
  
      const listenForChanges = async () => {  
        const mongoClient = app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongoClient.db("sample_data").collection("users");
        const changeStream = collection.watch();
  
        const cleanup = () => {
          changeStream.close();
        };
        
        //  listen for changes
        for await (const change of changeStream) {
          //  stop listening for changes if the effect has been cleaned up
          if (isCancelledRef.current) {
            return; 
          }
  
          if (change.operationType === "update" || change.operationType === "replace") {
  
            const updatedFields = change.updateDescription.updatedFields;
            const [obj, field] = Object.keys(updatedFields)[0].split(".");
            const value = Object.values(updatedFields)[0];
  
            setProgress((prev) => {
              if (obj === getTrackParam()) {
                return { ...prev, [field]: value };
              }
  
              return prev;
            });
          }
        }
        return cleanup;
      };
  
      listenForChanges().catch(err => console.log(err));
  
      //  set the flag to true when the effect is cleaned up
      return () => {
        isCancelledRef.current = true; 
      };
    }

  }, [app.currentUser, progress]);

  return progress;
}
