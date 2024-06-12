import { Button } from "react-daisyui";
import { ChevronDoubleRightIcon } from "@heroicons/react/16/solid";
import PropTypes from "prop-types";

/**
 *
 * @param {{handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void, title: string, setTitle: (title: string) => void, type: string, setType: (type: string) => void, targetNumber: string, setTargetNumber: (targetNumber: string) => void, period: string, setPeriod: (period: string) => void }} props
 * @returns {React.FC}
 */
export default function CreateNewGoal({
  handleSubmit,
  title,
  setTitle,
  type,
  setType,
  targetNumber,
  setTargetNumber,
  period,
  setPeriod,
}) {
  return (
    <dialog id="my_modal_1" className="modal">
      <div
        className="form-control w-auto md:w-1/2 lg:w-1/3 mx-auto p-4 bg-base-200 rounded-box"
        style={{
          border: "2px solid white",
          maxHeight: "500px",
          overflowY: "auto",
          scrollbarWidth: "thin",
        }}
      >
        <form onSubmit={(e) => handleSubmit(e)}>
          <span>Goal title:</span>
          <label className="label mb-4 w-full">
            <ChevronDoubleRightIcon className="h-5 w-5 mr-2" />
            <input
              type="text"
              placeholder="Goal title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full"
            />
          </label>
          <span>Goal type:</span>
          <label className="label mb-4 w-full">
            <ChevronDoubleRightIcon className="h-5 w-5 mr-2" />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="steps">Steps</option>
              <option value="calories">Calories</option>
              <option value="distance">Distance</option>
            </select>
          </label>
          <span>Target:</span>
          <label className="label mb-4 w-full">
            <ChevronDoubleRightIcon className="h-5 w-5 mr-2" />
            <input
              type="number"
              placeholder="Goal target:"
              value={targetNumber}
              onChange={(e) => setTargetNumber(e.target.value)}
              className="input input-bordered w-full"
            />
          </label>

          <span>Period:</span>
          <label className="label mb-4 w-full">
            <ChevronDoubleRightIcon className="h-5 w-5 mr-2" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>

          <button
            type="submit"
            className="btn bg-yellow-500 px-8 py-4 w-full md:auto rounded"
          >
            Set Goal
          </button>
          <form
            method="dialog"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button className="btn-error mt-3 w-24">Close</Button>
          </form>
        </form>
      </div>
    </dialog>
  );
}

CreateNewGoal.propTypes = {
  handleSubmit: PropTypes.func,
  title: PropTypes.string,
  setTitle: PropTypes.func,
  type: PropTypes.string,
  setType: PropTypes.func,
  targetNumber: PropTypes.string,
  setTargetNumber: PropTypes.func,
  period: PropTypes.string,
  setPeriod: PropTypes.func,
};
