import { Footer } from "react-daisyui";

export default function FooterNav() {
  return (
    <Footer className="p-6 text-neutral-content border-t border-t-2 border-t-warning flex flex-col justify-center align-center items-center text-gray-400">
      {/* <Footer.Title className="text-4xl mt-4">FitTrackr</Footer.Title> */}
      <div className="flex flex-row justify-center align-center items-start gap-36 w-full">
        <div className="text-lg">
          <div className="my-2">
            <p>Home</p>
            <p>Exercises</p>
            <p>About us</p>
          </div>
        </div>
        <div className="text-4xl flex justify-center align-center items-center h-full">
          <Footer.Title>FitTrackr</Footer.Title>
        </div>
        <div className="text-lg">
          <div className="my-2">
            <p>Social media</p>
            <p>Contact us</p>
          </div>
        </div>
      </div>
    </Footer>
  );
}
