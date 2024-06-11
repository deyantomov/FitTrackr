import { Card, Carousel } from "react-daisyui";
import reactSVG from "../../assets/react.svg";
import tailwindSVG from "../../assets/tailwind.svg";

export default function About() {
  return (
    <div className="flex flex-col w-full h-full items-center py-12 px-8">
      <h2 className="pb-12 md:text-5xl lg:text-6xl">About FitTrackr</h2>
      <Card className="isolate aspect-video rounded-xl bg-white/20 shadow-lg ring-1 ring-black/5 p-6 w-full lg:w-3/6">
        <Card.Title className="flex w-full justify-start items-center text-2xl md:text-4xl px-8 mt-4">
          Welcome
        </Card.Title>
        <Card.Body>
          <p className="text-xl md:text-2xl">
            Welcome to FitTrackr, your ultimate companion on the path to a more
            active lifestyle. Whether you&apos;re a fitness enthusiast or just
            starting your journey, FitTrackr is designed to help you achieve
            your goals with ease and simplicity.
          </p>
        </Card.Body>
        <Card.Title className="flex w-full justify-start items-center text-2xl md:text-4xl px-8">
          Our Mission
        </Card.Title>
        <Card.Body>
          <p className="text-xl md:text-2xl">
            At FitTrackr, our mission is to empower individuals to take control
            of their health and fitness through intuitive and seamless tracking
            solutions. We believe that achieving your fitness goals should be
            straightforward, and our platform is built to reflect that.
          </p>
        </Card.Body>
        <div className="flex w-full py-8 justify-center items-center">
          <h2 className="text-3xl md:text-4xl">Key feautres</h2>
        </div>
        <Carousel className="rounded-box flex flex-row justify-center align-center items-center w-full p-8 text-base md:text-lg">
          <Carousel.Item className="max-w-96 min-h-16 border-s-2 border-s-red-600 px-2">
            Ease of Use and User Interface Simplicity
          </Carousel.Item>
          <Carousel.Item className="max-w-96 border-s-2 border-s-green-600 px-2">
            Seamless Fitbit Integration
          </Carousel.Item>
          <Carousel.Item className="max-w-96 border-s-2 border-s-blue-600 px-2">
            Goal Setting and Exercise Tracking
          </Carousel.Item>
        </Carousel>
        <Card.Title className="flex w-full justify-start items-center text-2xl md:text-4xl px-8 mt-8">Join Us</Card.Title>
        <Card.Body>
          <p className="text-xl md:text-2xl">
            Embark on your fitness journey with FitTrackr and experience the power
            of simple, effective tracking. Whether you&apos;re syncing your Fitbit
            device or setting new fitness goals, FitTrackr is here to support you
            every step of the way. Thank you for choosing FitTrackr. Together, we
            can achieve greatness, one step at a time.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}
