import { useState } from "react";
import { Button, Card, Loading } from "react-daisyui";
import api from "../../api/api";
import { useToast } from "../../hooks/useToast";

const { reportABug } = api;

export default function BugReport() {
  const { setToast } = useToast();
  const [reportView, setReportView] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let report = {};
    
    if (reportView) {
      report.view = reportView;
    } else {
      return setToast({ type: "error", message: "Please select the view in which you encountered the bug" });
    }

    if (reportDescription) {
      report.description = reportDescription;
    } else {
      return setToast({ type: "error", message: "Please provide bug description" });
    }

    try {
      setLoading(true);
      await reportABug(report);

      setReportView("");
      setReportDescription("");

      setToast({ type: "success", message: "Bug reported successfully" });
    } catch (err) {
      setToast({ type: "error", message: "Couldn't report the bug" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full h-full justify-center align-center items-center">
        <Loading />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col w-full h-full justify-center align-center items-center">
      <h2 className="text-5xl text-thin mb-12">
        Report a bug
      </h2>
      <Card className="p-12 bg-base-200 text-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10 items-center">

          <div className="grid grid-cols-2 w-full place-items-between">
            <p>Origin of bug:</p>
            <select value={reportView} onChange={e => setReportView(e.target.value)}>
              <option value="">Select a view</option>
              <option value="home">Home</option>
              <option value="exercises">Exercises</option>
              <option value="aboutUs">About Us</option>
              <option value="createExercise">Create an Exercise</option>
              <option value="goals">Goals</option>
              <option value="friendlist">Friend List</option>
              <option value="notifications">Notifications</option>
              <option value="profiles">Profiles</option>
              <option value="searchResults">Search Results</option>
            </select>
          </div>

          <div className="grid grid-cols-2 w-full place-items-between">
            <p>Description:</p>
            <textarea value={reportDescription} onChange={e => setReportDescription(e.target.value)} className="text-lg" />
          </div>
          <Button type="submit" className="btn-warning w-3/6">Submit</Button>
        </form>
      </Card>
    </div>
  );
}