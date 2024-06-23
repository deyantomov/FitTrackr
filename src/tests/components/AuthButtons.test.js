import AuthButtons from "../../components/AuthButtons/AuthButtons";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { useApp } from "../../hooks/useApp";

jest.mock("../../hooks/useApp");

describe("AuthButtons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Log out button when user is logged in", () => {
    useApp.mockReturnValue({ currentUser: { name: "John Doe" } });
    render(
      <Router>
        <AuthButtons />
      </Router>
    );
    
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  test("renders Sign in and Sign up buttons when user is logged out", () => {
    useApp.mockReturnValue({ currentUser: null });
    render(
      <Router>
        <AuthButtons />
      </Router>
    );
    
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });
});