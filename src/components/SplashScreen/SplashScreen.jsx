// src/components/SplashScreen.js
import React, { useEffect, useState } from "react";
import "./SplashScreen.css"; // Optional: for styling

const SplashScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, props.duration); // Splash screen will be shown for 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [props.duration]);

  if (isLoading) {
    return (
      <>
      <div
        className="splash-screen fixed inset-0 flex flex-col justify-center items-center z-50"
        style={{ backgroundColor: props.bgColor }}
      >
        <img
          src={props.imageUrl}
          alt="Loading"
          className="max-w-full max-h-full object-contain w-auto h-auto"
        />

        <h1 className="text-white text-4xl font-semibold mt-4  font-poppins splash-heading">{props.heading}</h1>
      </div>
        </>
    );
  }

  return null;
};
export default SplashScreen;
