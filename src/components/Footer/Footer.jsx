import { Footer } from "react-daisyui";

export default function FooterNav() {
  return (
    <>
      <Footer className="px-12 py-6 mt-8 text-neutral-content border-t border-t-2 border-t-warning relative">
        {/* <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-4xl">
          <Footer.Title>FitTrackr</Footer.Title>
        </div> */}
        <div className="flex justify-center items-center gap-36 text-lg px-32">
          <div className="my-2">
            <p>Home</p>
            <p>Exercises</p>
            <p>About us</p>
          </div>
          <div className="my-2">
            <p>Social media</p>
            <p>Contact us</p>
          </div>
        </div>
      </Footer>
    </>
  );
}