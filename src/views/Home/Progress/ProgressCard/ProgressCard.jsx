import { Card, Button, Modal, Input } from "react-daisyui";
import { useRef, useCallback, useState, useEffect } from "react";
import { useApp } from "../../../../hooks/useApp";
// import { getUserById, updateSteps } from "../../../../api/api";
import useTrackProgress from "../../../../hooks/useTrackProgress";
import { Link } from "react-router-dom";
import {
  updateCalories,
  updateDistance,
  updateSteps,
} from "../../../../api/api";

export default function ProgressCard({ trackParam, imgName, title }) {
  const app = useApp();
  const ref = useRef();
  const progressHook = useTrackProgress(app, trackParam);
  const [inputValue, setInputValue] = useState("");
  const [progress, setProgress] = useState(progressHook);
  const [triggerFetch, setTriggerFetch] = useState(false);

  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  const handleNumpadClick = (value) => {
    if (value === "C") {
      setInputValue("");
    } else {
      setInputValue(inputValue + value);
    }
  };

  const handleUpdate = async () => {
    switch (trackParam) {
      case "steps":
        const stepsRes = await updateSteps(app, Number(inputValue));
        setInputValue("");
        setTriggerFetch(!triggerFetch);

        return stepsRes;
      case "distance":
        const distanceRes = await updateDistance(app, Number(inputValue));
        setInputValue("");
        setTriggerFetch(!triggerFetch);

        return distanceRes;
      case "calories":
        const caloriesRes = await updateCalories(app, Number(inputValue));
        setInputValue("");
        setTriggerFetch(!triggerFetch);

        return caloriesRes;
      default:
        throw new Error("Invalid parameter!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setProgress(progressHook);
    };

    fetchData();
  }, [triggerFetch, progressHook]);

  return (
    <Card
      className="w-80 flex flex-col justify-center align-center items-center text-center p-6 rounded-md"
      style={{
        backgroundImage: `url(/public/${imgName}.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "500px",
      }}
    >
      <div
        className="flex flex-col align-center items-center w-full min-h-full text-black font-thin p-6 rounded-md"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
      >
        <Card.Title className="text-6xl mb-8  ">{title}</Card.Title>
        <Card.Body
          className="text-xl p-6 flex flex-col gap-0 rounded-md justify-start align-start items-start"
          style={{ backgroundColor: "rgb(250, 204, 21)" }}
        >
          {Object.keys(progress).length > 0 ? (
            <>
              {trackParam !== "exercise" && (
                <p>
                  Daily: {progress.daily || 0}{" "}
                  {trackParam === "calories" && "kcal"}
                  {trackParam === "distance" && "m"}
                  {trackParam === "exercise" && "days"}
                </p>
              )}
              <p>
                Weekly: {progress.weekly || 0}{" "}
                {trackParam === "calories" && "kcal"}
                {trackParam === "distance" && "m"}
                {trackParam === "exercise" && "days"}
              </p>
              {trackParam !== "exercise" && (
                <p>
                  Monthly: {progress.monthly || 0}{" "}
                  {trackParam === "calories" && "kcal"}
                  {trackParam === "distance" && "m"}
                  {trackParam === "exercise" && "days"}
                </p>
              )}
            </>
          ) : (
            <h2>No data available</h2>
          )}
        </Card.Body>
        {trackParam !== "exercise" && (
          <Button
            className="border-0 mt-4 text-black rounded-lg"
            style={{ backgroundColor: "rgb(250, 204, 21)" }}
            onClick={handleShow}
          >
            Log
          </Button>
        )}
        <Modal ref={ref} className="p-12">
          <Modal.Header className="text-5xl md:text-6xl lg:text-7xl mb-8">
            Log
          </Modal.Header>
          <Modal.Body className="w-full flex flex-col">
            <Input
              type="number"
              bordered={false}
              className="w-full"
              value={inputValue}
              readOnly
            />
            <div className="grid grid-cols-3 gap-0 mt-6">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "C"].map(
                (value) => (
                  <Button
                    key={value}
                    className={`numpad-btn ${value === "C" && "btn-warning"} ${
                      value === "C" && "col-span-2"
                    }`}
                    onClick={() => handleNumpadClick(value)}
                  >
                    {value}
                  </Button>
                )
              )}
            </div>
          </Modal.Body>
          <Modal.Actions className="flex flex-row justify-center align-center items-center gap-8">
            <Button className="btn-success mt-6 w-24" onClick={handleUpdate}>
              Update
            </Button>
            <form method="dialog">
              <Button className="btn-error mt-6 w-24">Close</Button>
            </form>
          </Modal.Actions>
        </Modal>
      </div>
    </Card>
  );
}
