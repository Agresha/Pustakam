import React, { useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { ThemeContext } from "../components/ThemeProvider/themeprovider.jsx"; // Import the ThemeContext from Footer
import { getTranslation } from '../components/TranslationHelper/translation.jsx'

const Search = () => {
  const { isDarkMode, selectedLanguage } = useContext(ThemeContext); // Consume the ThemeContext

  return (
    <div
      className={`flex justify-center items-center p-5 ${
        isDarkMode ? "bg-darkModeColor text-lightModeColor" : "bg-lightModeColor text-darkModeColor"
      }`}
    >
      <div className="flex w-4/5 items-center">
        <input
          type="text"
          placeholder={`${getTranslation('Search a book by name or category',selectedLanguage)}`}
          className={`w-full h-10 pl-4 border-2 rounded-lg text-lg focus:outline-none ${
            isDarkMode
              ? "border-lightModeColor bg-darkModeColor text-white"
              : "border-mainColor bg-lightModeColor text-black"
          }`}
        />
        <FaSearch className={`ml-4 text-3xl ${isDarkMode ? "text-white" : "text-black"}`} />
      </div>
    </div>
  );
};

export default Search;
