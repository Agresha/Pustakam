import {
  FaSearch,
  FaEllipsisV,
  FaVolumeUp,
  FaCrown,
  FaChevronLeft,
} from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { ThemeContext } from "../components/ThemeProvider/themeprovider.jsx"; // Import ThemeContext

function EbookNavbar() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext); // Consume ThemeContext

  return (
    <nav
      className={`w-full h-[10vh] flex items-center justify-between px-8 ${
        isDarkMode ? "bg-darkModeColor text-lightModeColor" : "bg-lightModeColor text-darkModeColor"
      }`}
    >
      {/* Back button */}
      <FaChevronLeft
        className="text-3xl cursor-pointer"
        onClick={() => navigate(-1)}
      />
      
      {/* Action icons */}
      <div className="flex items-center space-x-6">
        <FaCrown
          className={`text-3xl cursor-pointer ${
            isDarkMode ? "text-yellow-400" : "text-yellow-500"
          }`}
        />
        <FaVolumeUp className="text-3xl cursor-pointer" />
        <FaSearch className="text-3xl cursor-pointer" />
        <RxHamburgerMenu className="text-3xl cursor-pointer" />
        <IoMdSettings className="text-3xl cursor-pointer" />
        <FaEllipsisV className="text-3xl cursor-pointer" />
      </div>
    </nav>
  );
}

export default EbookNavbar;
