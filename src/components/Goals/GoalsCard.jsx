import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function GoalsCard({
  metricTitle,
  currentProgress,
  goalSet,
  metricString,
}) {
  const [percentage, setPercentage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      if (percentage < 100) {
        setPercentage(percentage + 1);
      }
      const newProgress = ((currentProgress * 100) / goalSet) || 0;
      setProgress(newProgress);
      console.log("progress", progress);
    }, 10);
  }, [percentage, currentProgress, goalSet]);

  return (
    <>
      <div className="card w-96 glass" style={{ color: "#2effd9" }}>
        <div
          className="card-stat"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "200px",
              display: "flex",
              justifyContent: "center",
              color: "#2effd9",
            }}
          >
            <div style={{ width: 120, margin: 10 }}>
              <CircularProgressbar
                value={progress.toFixed(2)}
                text={`${progress.toFixed(2)}%`}
                styles={buildStyles({
                  pathColor: `#f7c000`,
                  textColor: "#f7c000",
                })}
              />
            </div>
          </div>
        </div>
        <progress
          style={{ width: "100%" }}
          className="progress progress-warning w-56"
          value={progress.toFixed(2)}
          max="100"
        ></progress>

        <div className="card-body">
          <h2
            className="card-title"
            style={{ display: "flex", justifyContent: "center" }}
          >
            {metricTitle.toUpperCase()}
          </h2>
          <p style={{ textAlign: "center" }}>
            {currentProgress}/{goalSet} {metricString}
          </p>
        </div>
      </div>
    </>
  );
}
