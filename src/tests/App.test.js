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
  test("should display the feature cards' titles", () => {
    render(
      <Router>
        <App />
      </Router>
    );

    titles.forEach(title => {
      const allMatchingElements = screen.getAllByText(title);
      allMatchingElements.forEach(element => {
        expect(element).toBeInTheDocument();
      });
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