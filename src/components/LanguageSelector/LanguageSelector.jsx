import React, { useContext } from "react";
import { ThemeContext } from "../ThemeProvider/themeprovider";

const LanguageSelector = () => {
  const { selectedLanguage, handleLanguageChange } = useContext(ThemeContext);

  const handleSelectLanguage = (language) => {
    handleLanguageChange(language);
  };

  return (
    <div className="flex flex-col space-y-2 mt-2">
      <button
        onClick={() => handleSelectLanguage("english")}
        className={`w-full p-2 text-lg text-left rounded-md ${
          selectedLanguage === "english"
            ? "bg-mainColor text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        English
      </button>
      <button
        onClick={() => handleSelectLanguage("hindi")}
        className={`w-full p-2 text-lg text-left rounded-md ${
          selectedLanguage === "hindi"
            ? "bg-mainColor text-white"
            : "bg-gray-200 text-black"
        }`}
      >
        Hindi
      </button>
    </div>
  );
};

export default LanguageSelector;
