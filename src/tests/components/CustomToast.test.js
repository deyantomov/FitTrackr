import CustomToast from "../../components/CustomToast/CustomToast";
import { render, screen, act } from "@testing-library/react";

let mockOnClose = jest.fn();

describe("Fade out", () => {
  jest.useFakeTimers();

  test("should decrease opacity over time", () => {
    const { container } = render(<CustomToast type="success" message="Fading message" onClose={mockOnClose} />);
    const toast = container.firstChild;
    expect(toast).toHaveStyle("opacity: 1");

    act(() => jest.advanceTimersByTime(800));
    expect(toast).toHaveStyle("opacity: 0.8");
    
    act(() => jest.advanceTimersByTime(800));
    expect(toast).toHaveStyle("opacity: 0.6");
    
    act(() => jest.advanceTimersByTime(800));
    expect(toast).toHaveStyle("opacity: 0.4");
    
    act(() => jest.advanceTimersByTime(800));
    expect(toast).toHaveStyle("opacity: 0.2");
    
    act(() => jest.advanceTimersByTime(800));
    expect(toast).toHaveStyle("opacity: 0");
  });

  test("should call onClose after 4 seconds", () => {
    render(<CustomToast type="success" message="Will close" onClose={mockOnClose} />);
    expect(mockOnClose).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(4000));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllTimers();
    mockOnClose = jest.fn();
  });
});

describe("Display messages", () => {
  test("should display an error message", () => {
    render(<CustomToast type="error" message="Error message" onClose={mockOnClose} />);
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  test("should display a success message", () => {
    render(<CustomToast type="success" message="Success message" onClose={mockOnClose} />);
    expect(screen.getByText("Success message")).toBeInTheDocument();
  });

  afterEach(() => {
    mockOnClose = jest.fn();
  });
});