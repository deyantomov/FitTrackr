export default function GoalsCard() {
  return (
    <>
      <div
        className="stats stats-vertical lg:stats-horizontal shadow"
        style={{ border: "4px solid #ff2ec5" }}
      >
        <div className="stat">
          <div className="stat-title">Steps</div>
          <div className="stat-value">2000</div>
          {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
        </div>

        <div className="stat">
          <div className="stat-title">Steps Target</div>
          <div className="stat-value">8000</div>
          {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
        </div>

        <div className="stat">
          <div className="stat-title">Progress</div>
          <div className="stat-value">25%</div>
          {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
        </div>
        <div
          className="radial-progress"
          style={{ "--value": 25 }}
          role="progressbar"
        >
          25%
        </div>
      </div>
      <br />

      <div className="card w-96 bg-base-100 shadow-xl">
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
      </div>
    </>
  );
}
