import React, { useState } from "react";
import img1 from "./images/1.png";
import img2 from "./images/2.png";
import img3 from "./images/3.png";
import img4 from "./images/4.png";

const Onboarding = () => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const onboardingData = [
    {
      image: img1,
      title: "अनेक ई-पुस्तकों का संग्रह",
      description:
        "पुस्तकम पर भिन्न भिन्न विषयों की अनेक ई-पुस्तकों को विविध सुविधाओं के साथ पढ़ने का लाभ ले सकते हैं।",
    },
    {
      image: img2,
      title: "आसान नेविगेशन",
      description: "एक क्लिक में अपनी पसंदीदा पुस्तकें खोजें और पढ़ने की शुरुआत करें।",
    },
    {
      image: img3,
      title: "ऑफलाइन पढ़ें",
      description: "डाउलोड करें और कभी भी, कहीं भी पढ़ें।",
    },
    {
      image: img4,
      title: "विविध भाषा समर्थन",
      description: "अपनी भाषा में पढ़ने का अनुभव प्राप्त करें और इसे और आसान बनाएं।",
    },
  ];

  const nextScreen = () => {
    if (currentScreen < onboardingData.length - 1) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const prevScreen = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleSkip = () => {
    // Redirect to the linked page
    window.location.href = "/home"; // Replace "/home" with your desired route
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side - Image */}
      <div className="md:w-1/2 flex items-center justify-center bg-gray-100 h-1/2 md:h-full">
        <img
          src={onboardingData[currentScreen].image}
          alt="Onboarding"
          className="object-contain h-4/5"
        />
      </div>

      {/* Right Side - Text and Controls */}
      <div className="md:w-1/2 flex flex-col justify-center bg-gray-50 p-6 md:p-8 h-1/2 md:h-full">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {onboardingData[currentScreen].title}
          </h2>
          <p className="text-gray-700 text-lg md:text-xl">
            {onboardingData[currentScreen].description}
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {onboardingData.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                currentScreen === index ? "bg-blue-500" : "bg-gray-400"
              }`}
            ></div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-8 space-x-4">
          {/* Skip Button */}
          {currentScreen < onboardingData.length - 1 && (
            <button
              className="text-xl hover:font-bold"
              onClick={handleSkip}
            >
              skip
            </button>
          )}

          {/* Conditional Previous Button */}
          {currentScreen > 0 && (
            <button
              className="bg-gray-200 px-5 py-2 rounded-lg"
              onClick={prevScreen}
            >
              पिछला
            </button>
          )}

          {/* Next/Finish Button */}
          {currentScreen === onboardingData.length - 1 ? (
            <button
              className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow"
              onClick={() => alert("Let's Get Started!")}
            >
              आगे बढ़े
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow"
              onClick={nextScreen}
            >
              अगला
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
