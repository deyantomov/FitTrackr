import { useApp } from "../../hooks/useApp";
import AuthButtons from "../AuthButtons/AuthButtons";

export default function Home() {
  const app = useApp();

  return (
    <>
      {app.currentUser ?
        (<h2 className="text-3xl">Home page</h2>) :
        (
          <div className="flex flex-col items-center justify-center min-h-full">
            <div className="relative h-4/6 w-full">
              <img src="hero-banner-3.jpeg" alt="" className="object-cover h-full w-full" />
              <div className="absolute top-0 left-0 w-full h-full grid place-items-center" style={{background: 'rgba(0, 0, 0, 0.4)'}}>
                <div className="text-center">
                  <p className="text-8xl text-black mb-8 font-light">FitTrackr</p>
                  <AuthButtons></AuthButtons>
                </div>
              </div>
            </div>
            {/* Cards describing app functionalities */}
            
            <div className="w-full">
              
              {/* Your other content */}
            </div>
          </div>
        )
      }
    </>
  )
}