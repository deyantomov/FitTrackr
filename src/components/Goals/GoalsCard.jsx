import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PropTypes from "prop-types";


/**
 * @param {{metricTitle: string, currentProgress: number, goalSet: string, metricString: string}} props
 * @returns {React.FC}
 */
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
      const newProgress = (currentProgress * 100) / goalSet || 0;
      setProgress(newProgress);
    }, 10);
  }, [percentage, currentProgress, goalSet]);

  return (
    <>
      <div className="card w-96 glass">
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
                text={
                  progress >= 100
                    ? `${(100.0).toFixed(2)}%`
                    : `${progress.toFixed(2)}%`
                }
                styles={buildStyles({
                  pathColor: "#f7c000",
                  textColor: "#f7c000",
                })}
              />
            </div>
          </div>
        </div>
        <hr />

        <div className="card-body">
          <h2
            className="card-title"
            style={{ display: "flex", justifyContent: "center" }}
          >
            {metricTitle.toUpperCase()}
          </h2>
          <p style={{ textAlign: "center" }}>
            {currentProgress || 0}/{goalSet} {metricString}
          </p>
        </div>
      </div>
    </>
  );
}

GoalsCard.propTypes = {
  metricTitle: PropTypes.string,
  currentProgress: PropTypes.number,
  goalSet: PropTypes.string,
  metricString: PropTypes.string,
};