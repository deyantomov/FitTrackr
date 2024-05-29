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
          setProgress({ weekly: user[trackParam].length });
          return;
        }

        if (user[trackParam]) {
          setProgress(user[trackParam]);
        }
      }
    };

    fetchProgress();
  }, [triggerFetch])

  useEffect(() => {
    trackParamRef.current = trackParam;
  }, [trackParam]);

  useEffect(() => {
    if (progress) {
      isCancelledRef.current = false;
      const getTrackParam = () => trackParamRef.current;
      console.log(getTrackParam());
  
      const listenForChanges = async () => {  
        const mongoClient = app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongoClient.db("sample_data").collection("users");
        const changeStream = collection.watch();
  
        const cleanup = () => {
          changeStream.close();
        };
        
        // Listen for changes
        for await (const change of changeStream) {
          if (isCancelledRef.current) {
            return; // Stop listening for changes if the effect has been cleaned up
          }
  
          if (change.operationType === 'update' || change.operationType === 'replace') {
  
            const updatedFields = change.updateDescription.updatedFields;
            const [obj, field] = Object.keys(updatedFields)[0].split(".");
            const value = Object.values(updatedFields)[0];
  
            setProgress((prev) => {
              if (obj === getTrackParam()) {
                return { ...prev, [field]: value }
              }
  
              return prev;
            })
          }
        }
        return cleanup;
      }
  
      listenForChanges().catch(err => console.log(err));
  
      return () => {
        isCancelledRef.current = true; // Set the flag to true when the effect is cleaned up
      };
    }

  }, [progress])

  return progress;
}
