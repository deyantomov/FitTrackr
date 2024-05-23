import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function GoalsCard() {
  const [percentage, setPercentage] = useState(0);
  const [steps, setSteps] = useState(2000);
  const [targetSteps, setTargetSteps] = useState(8000);

  useEffect(() => {
    setTimeout(() => {
      if (percentage < 100) {
        setPercentage(percentage + 1);
      }
    }, 10);
  }, [percentage]);

  const progress = () => {
    const result = (steps * 100) / targetSteps;
    return result;
  };

  return (
    <>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
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
                  value={progress()}
                  text={`${progress()}%`}
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
            value="25"
            max="100"
          ></progress>

          <div className="card-body">
            <h2
              className="card-title"
              style={{ display: "flex", justifyContent: "center" }}
            >
              Steps
            </h2>
            <p style={{ textAlign: "center" }}>2000 steps out of 8000 target</p>
          </div>
        </div>

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
                  value={progress()}
                  text={`${progress()}%`}
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
            value="25"
            max="100"
          ></progress>

          <div className="card-body">
            <h2
              className="card-title"
              style={{ display: "flex", justifyContent: "center" }}
            >
              Steps
            </h2>
            <p style={{ textAlign: "center" }}>2000 steps out of 8000 target</p>
          </div>
        </div>

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
                  value={progress()}
                  text={`${progress()}%`}
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
            value="25"
            max="100"
          ></progress>

          <div className="card-body">
            <h2
              className="card-title"
              style={{ display: "flex", justifyContent: "center" }}
            >
              Steps
            </h2>
            <p style={{ textAlign: "center" }}>2000 steps out of 8000 target</p>
          </div>
        </div>
      </div>

      {/* another layout
      <div
        className="stats stats-vertical lg:stats-horizontal shadow"
        style={{ border: "4px solid #ff2ec5" }}
      >
        <div className="stat">
          <div className="stat-title">Steps</div>
          <div className="stat-value">2000</div>
         </div>
        <div className="stat">
          <div className="stat-title">Steps Target</div>
          <div className="stat-value">8000</div>
         </div>
        <div className="stat">
          <div className="stat-title">Progress</div>
         <div style={{ width: "150px", textAlign: "center" }}>
            <div style={{ width: 120, margin: 10 }}>
              <CircularProgressbar value={progress()} text={`${progress()}%`} />
            </div>
          </div>
        </div>
      </div>
      <br /> */}

      {/* <div className="card w-96 bg-base-100 shadow-xl">
        <progress
          style={{ width: "100%" }}
          className="progress progress-warning w-56"
          value="70"
          max="100"
        ></progress>
        <div className="card-body items-center text-center">
          <h2>Steps:</h2>
          <br />
          <p>7000 out of 10000 target</p>
          <br />
          <p>Keep going!</p>
        </div>
      </div> */}
    </>
  );
}
