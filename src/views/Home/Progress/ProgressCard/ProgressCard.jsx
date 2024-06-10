import { Card, Button, Modal, Input } from "react-daisyui";
import { useRef, useCallback, useState, useEffect } from "react";
import { useApp } from "../../../../hooks/useApp";
import useTrackProgress from "../../../../hooks/useTrackProgress";
import api from "../../../../api/api";
import PropTypes from "prop-types";
import { useToast } from "../../../../hooks/useToast";
import {
  toastTypes,
  toastMessages,
  progressMetrics,
  progressUnits,
  numpad,
} from "../../../../common/constants";

const { updateCalories, updateDistance, updateSteps } = api;

/**
 * @param {{trackParam: string, imgName: string, title: string}} props
 * @returns {React.FC}
 */
export default function ProgressCard({ trackParam, imgName, title }) {
  const app = useApp();
  const ref = useRef();
  const { setToast } = useToast();
  const [triggerFetch, setTriggerFetch] = useState(false);
  const progressHook = useTrackProgress(app, trackParam, triggerFetch);
  const [progress, setProgress] = useState(progressHook);
  const [inputValue, setInputValue] = useState("");

  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  const handleClose = useCallback(() => {
    ref.current?.close();
  }, [ref]);

  const handleNumpadClick = (value) => {
    if (value === "C") {
      setInputValue("");
    } else {
      setInputValue(inputValue + value);
    }
  };

  const handleUpdate = async () => {
    try {
      switch (trackParam) {
      case progressMetrics.steps:
        await updateSteps(app, Number(inputValue));
        setInputValue("");
        setTriggerFetch(!triggerFetch);

        handleClose();

        break;
      case progressMetrics.distance:
        await updateDistance(app, Number(inputValue));
        setInputValue("");
        setTriggerFetch(!triggerFetch);

        handleClose();

        break;
      case progressMetrics.calories:
        await updateCalories(app, Number(inputValue));
        setInputValue("");
        setTriggerFetch(!triggerFetch);

        handleClose();

        break;
      }

      setToast({
        type: toastTypes.SUCCESS,
        message: toastMessages.updatedProgress,
      });
    } catch (err) {
      setToast({
        type: toastTypes.ERROR,
        message: toastMessages.failedToUpdateProgress,
      });
    }
  };

  useEffect(() => {
    setProgress(progressHook);
    setInputValue("");
  }, [progressHook, triggerFetch]);

  return (
    <Card
      className="w-80 flex flex-col justify-center align-center items-center text-center p-6 rounded-md"
      style={{
        backgroundImage: `url(/${imgName}.jpg)`,
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
              {trackParam !== progressMetrics.weeklyStreak && (
                <p>
                  <b className="text-xl">Daily:</b> {progress.daily || 0}{" "}
                  {trackParam === progressMetrics.calories &&
                    progressUnits.calories}
                  {trackParam === progressMetrics.distance &&
                    progressUnits.distance}
                </p>
              )}
              <p>
                <b className="text-xl">Weekly:</b> {progress.weekly || 0}{" "}
                {trackParam === progressMetrics.calories &&
                  progressUnits.calories}
                {trackParam === progressMetrics.distance &&
                  progressUnits.distance}
                {trackParam === progressMetrics.weeklyStreak &&
                  (progress.weekly === 1
                    ? progressUnits.day
                    : progressUnits.days)}
              </p>
              {trackParam !== progressMetrics.weeklyStreak && (
                <p>
                  <b className="text-xl">Monthly:</b> {progress.monthly || 0}{" "}
                  {trackParam === progressMetrics.calories &&
                    progressUnits.calories}
                  {trackParam === progressMetrics.distance &&
                    progressUnits.distance}
                </p>
              )}
            </>
          ) : (
            <h2>No data available</h2>
          )}
        </Card.Body>
        {trackParam !== progressMetrics.weeklyStreak && (
          <Button
            className="border-0 mt-4 text-black rounded-lg"
            style={{ backgroundColor: "rgb(250, 204, 21)" }}
            onClick={handleShow}
          >
            Log
          </Button>
        )}
        <Modal ref={ref} className="p-12 bg-white text-black">
          <Modal.Header className="text-5xl md:text-6xl lg:text-7xl mb-8">
            Log
          </Modal.Header>
          <Modal.Body className="w-full flex flex-col rounded-lg">
            <Input
              type="number"
              bordered={false}
              className="w-full bg-white border border-3 border-black"
              value={inputValue}
              readOnly
            />
            <div className="grid grid-cols-3 gap-0 mt-6">
              {numpad.map(
                (value) => (
                  <Button
                    key={value}
                    className={`numpad-btn bg-white text-black ${
                      value === "C" && "btn-warning"
                    } ${value === "C" && "col-span-2"}`}
                    onClick={() => handleNumpadClick(value)}
                  >
                    {value}
                  </Button>
                )
              )}
            </div>
          </Modal.Body>
          <Modal.Actions className="flex flex-row justify-center align-center items-center gap-8">
            <Button
              className="btn-success mt-6 w-24"
              onClick={async () => await handleUpdate()}
            >
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

ProgressCard.propTypes = {
  trackParam: PropTypes.string.isRequired,
  imgName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
