import ProfilePic from "../../components/ProfilePic/ProfilePic";
import { render, screen } from "@testing-library/react";

describe("ProfilePic", () => {
  test("should render a profile picture", () => {
    const profilePicUrl = "/pic.jpg";
    render(
      <ProfilePic
        profilePic={profilePicUrl}
        dimensions="100px"
        className="test"
      />
    );
    
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", profilePicUrl);
  });

  test("should render a default picture when profilePic is not provided", () => {
    render(
      <ProfilePic
        dimensions="100px"
        className="test"
      />
    );
    
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/default.jpg");
  });

  test("should apply dimensions and className props", () => {
    const dimensions = "150px";
    const className = "test";
    
    render(
      <ProfilePic
        dimensions={dimensions}
        className={className}
      />
    );
    
    const parent = screen
      .getByRole("img")
      .parentElement;

    expect(parent).toHaveClass(className);
    expect(parent).toHaveStyle(`width: ${dimensions}; height: ${dimensions};`);
  });

  test("should have an alt value of 'pic'", () => {
    render(
      <ProfilePic
        dimensions="150px"
        className="test"
      />
    );

    const image = screen.getByAltText("pic");

    expect(image).toBeInTheDocument();
  });
});