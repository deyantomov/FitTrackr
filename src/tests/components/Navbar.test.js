import Navbar from "../../components/Navbar/Navbar";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastProvider } from "../../providers/ToastProvider";

let isOpen = false;
const setIsOpen = jest.fn().mockImplementation(newState => {
  isOpen = newState;
});

const toggleDrawer = () => {
  setIsOpen(!isOpen);
}

describe("Renderer", () => {
  test("should render the navbar", () => {
    render(
      <Router>
        <ToastProvider>
          <Navbar toggleDrawer={toggleDrawer} />
        </ToastProvider>
      </Router>
    );
  });
});