import { Card, Button, Modal, Input } from "react-daisyui";
import { useRef, useCallback, useState, useEffect } from "react";
import { useApp } from "../../../hooks/useApp";
import { getUserById, updateSteps } from "../../../api/api";

export default function StepsActivity() {
  const ref = useRef();
  const [inputValue, setInputValue] = useState("");
  const app = useApp();
  const [steps, setSteps] = useState({});
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

  const handleUpdateSteps = async () => {
    const res = await updateSteps(app, Number(inputValue));
    
    setInputValue("");
    setTriggerFetch(!triggerFetch);
    
    return res;
  };

  useEffect(() => {
    const fetchSteps = async () => {
      const currentUser = app.currentUser;

      if (currentUser) {
        const user = await getUserById(currentUser.id);
        
        if(user.steps) {
          setSteps(user.steps);
        }
      }
    }

    fetchSteps();
  }, [triggerFetch])

  return (
    <Card
      className="w-80 flex flex-col justify-center align-center items-center text-center p-6 rounded-md"
      style={{
        backgroundImage: "url(/public/steps.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "450px",
      }}
    >
      <div
        className="flex flex-col align-center items-center w-full h-full text-black font-thin p-6 rounded-md"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
      >
        <Card.Title className="text-6xl mb-8">Steps</Card.Title>
        <Card.Body
          className="text-xl p-6 flex flex-col gap-0 rounded-md justify-start align-start items-start"
          style={{ backgroundColor: "rgb(250, 204, 21)" }}
        >
          <p>Daily: {steps.daily || 0}</p>
          <p>Weekly: {steps.weekly || 0}</p>
          <p>Monthly: {steps.monthly || 0}</p>
        </Card.Body>
        <Button
          className="border-0 mt-10 text-black rounded-lg"
          style={{ backgroundColor: "rgb(250, 204, 21)" }}
          onClick={handleShow}
        >
          Log steps
        </Button>
        <Modal ref={ref} className="p-12">
          <Modal.Header className="text-5xl md:text-6xl lg:text-7xl mb-8">Add steps</Modal.Header>
          <Modal.Body className="w-full flex flex-col">
            <Input
              type="number"
              bordered={false}
              className="w-full"
              value={inputValue}
              readOnly
            />
            <div className="grid grid-cols-3 gap-0 mt-6">
              {[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "0",
                "C",
              ].map((value) => (
                <Button
                  key={value}
                  className={`numpad-btn ${value === "C" && "btn-warning"} ${value === "C" && "col-span-2"}`}
                  onClick={() => handleNumpadClick(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
          </Modal.Body>
          <Modal.Actions className="flex flex-row justify-center align-center items-center gap-8">
            <Button
              className="btn-success mt-6 w-24"
              onClick={handleUpdateSteps}
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
