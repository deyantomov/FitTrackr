import App from "../App";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

const headings = {
  FITTRACKR: "FitTrackr",
  FEATURES: "Features",
};

const titles = [
  "Track your daily activity and exercises",
  "Connect with your Fitbit device or profile",
  "Set and achieve your fitness goals"
]

describe("Renderer", () => {
  test("should render the landing page", () => {
    render(
      <Router>
        <App />
      </Router>
    );
  });
});

describe("Headings", () => {
  test("should display the application's name", () => {
    render(
      <Router>
        <App />
      </Router>
    );
    
    const allMatchingElements = screen.getAllByText(headings.FITTRACKR); 
    allMatchingElements.forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });

  test("should display 'Features'", () => {
    render(
      <Router>
        <App />
      </Router>
    );

    const allMatchingElements = screen.getAllByText(headings.FEATURES);
    allMatchingElements.forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });
});

describe("Features", () => {
  test("should display the first feature card's title", () => {
    render(
      <Router>
        <App />
      </Router>
    );

    const allMatchingElements = screen.getAllByText(titles[0]);
    allMatchingElements.forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });
  
  test("should display the second feature card's title", () => {
    render(
      <Router>
        <App />
      </Router>
    );

    const allMatchingElements = screen.getAllByText(titles[1]);
    allMatchingElements.forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });
  
  test("should display the third feature card's title", () => {
    render(
      <Router>
        <App />
      </Router>
    );

    const allMatchingElements = screen.getAllByText(titles[2]);
    allMatchingElements.forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });

  test("at least three images should be displayed on the landing page", () => {
    render(
      <Router>
        <App />
      </Router>
    );

    const allMatchingElements = screen.getAllByAltText("img");
    allMatchingElements.forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });
});