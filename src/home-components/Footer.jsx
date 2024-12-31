import React, { useState, useEffect, useContext } from "react";
import { FaHome, FaCrown, FaBookOpen,FaUser} from "react-icons/fa";
import { IoBookSharp, IoStarSharp } from "react-icons/io5";
import { CiMenuBurger } from "react-icons/ci";
import { Link } from "react-router-dom";
import {
  FiFileText,
  FiGrid,
  FiHelpCircle,
  FiInfo,
  FiGlobe,
  FiEye,
  FiSettings,
  FiDownload,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import LanguageSelector from "../components/LanguageSelector/LanguageSelector";
import { ThemeContext } from "../components/ThemeProvider/themeprovider";
import { getTranslation } from "../components/TranslationHelper/translation"; // Import translation helper

const Footer = () => {
  const { isDarkMode, toggleTheme, selectedLanguage } = useContext(ThemeContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {id} = useParams();
  const [image, setImage] = useState(null)


    // Fetch data only if id is present in params
    useEffect(() => {
      if (!id) return; // Exit early if id is not present
      const fetchData = async () => {
        try {
          const response = await fetch(`https://pustakam.pythonanywhere.com/books/${id}/`);
          const result = await response.json();
          setImage(result.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, [id]);

  // Load user token and determine login state
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  let user;
  let data=JSON.parse(localStorage.getItem("userToken"))
  if(data){
    user=data.name
  }
  const toggleDarkMode = () => {
    toggleTheme();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen((prev) => !prev);
  };
  const handleLanguageChange = (language) => {
    // Handle language change logic here
    console.log(`Language changed to: ${language}`);
    setIsLanguageDropdownOpen(false); // Close dropdown after selection
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { text: user, icon: <FaUser /> },
    { text: getTranslation(<Link to="/Subscription">PurchasePremium</Link>, selectedLanguage), icon: <FaCrown />},
    { text: getTranslation("note", selectedLanguage), icon: <FiFileText /> },
    { text: getTranslation("combination", selectedLanguage), icon: <FiGrid /> },
    { text: getTranslation("helpSupport", selectedLanguage), icon: <FiHelpCircle /> },
    { text: getTranslation("information", selectedLanguage), icon: <FiInfo /> },
    { text: (<div onClick={() => navigate("/freebookpage")}>{getTranslation("freeBook", selectedLanguage)}</div>
      ), icon: <FaBookOpen  onClick={() => navigate("/freebookpage")}/> },
    {
      text: (
        <div
          className="relative flex items-center cursor-pointer"
          onClick={toggleLanguageDropdown} // Click handler for toggling the dropdown
        >
          {getTranslation("languageSettings", selectedLanguage)}
          {isLanguageDropdownOpen && (
            <div className={`absolute top-full  left-0 mt-2 ${isDarkMode ? "bg-white" : "bg-black"} dark:bg-black p-2 rounded-md shadow-lg z-50`}>
              <LanguageSelector onSelectLanguage={handleLanguageChange} />
            </div>
          )}
        </div>
      ),
      icon: <FiGlobe />, // Keep the icon static and non-clickable
    },
    
    { text: getTranslation("readingMode", selectedLanguage), icon: <FiEye /> },
    {
      text: getTranslation("darkMode", selectedLanguage),
      toggle: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleDarkMode}
            className="sr-only peer border-mainColor"
          />
          <div className="w-11 h-6 bg-gray-400 rounded-full peer-checked:bg-mainColor peer-focus:ring-2 peer-focus:ring-blue-500 transition-all"></div>
          <div className="absolute left-1 top-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-all"></div>
        </label>
      ),
    },
    {
      text: getTranslation("accountSettings", selectedLanguage),
      icon: <FiSettings />,
    },
    {
      text: getTranslation("downloadBook", selectedLanguage),
      icon: <FiDownload />,
    },
    // Conditionally add logout only if the user is logged in
  ...(isLoggedIn
    ? [
        {
          text: getTranslation("logout", selectedLanguage),
          icon: <FiLogOut />,
          action: handleLogout,
        },
      ]
    : []),
  ];

  return (
    <div
      className={`w-full flex justify-around items-center fixed bottom-0 z-10 bg-mainColor text-white`}
    >
    {console.log('took image from here:',image)}
      {/* Home Section */}
      <div className="flex flex-col items-center hover:cursor-pointer">
        <FaHome className="text-3xl"
        onClick={() => navigate("/homepage")} />
        <p className="text-sm">{getTranslation("home", selectedLanguage)}</p>
      </div>

      {/* Library Section */}
      <div className="flex flex-col items-center py-3 hover:cursor-pointer">
        <IoBookSharp
          className="text-3xl"
          onClick={() => navigate("/booksbytopic")}
        />
        <p className="text-sm">{getTranslation("library", selectedLanguage)}</p>
      </div>

      {/* Center Logo */}
      <div className="flex flex-col items-center">
        <img
          src={image ? `https://pustakam.pythonanywhere.com/${image.book_front_image}` : "https://th.bing.com/th/id/OIP.8UeCqoVUCxU8U1oVbN7PqgHaLH?w=208&h=305&c=7&r=0&o=5&dpr=1.3&pid=1.7"}
          alt="Logo"
          className="h-22 w-12 -mt-12"
        />
      </div>

      {/* Favourite Section */}
      <div className="flex flex-col items-center py-3 hover:cursor-pointer">
        <IoStarSharp className="text-3xl" onClick={() => navigate("/favouritepage")} />
        <p className="text-sm">{getTranslation("favourite", selectedLanguage)}</p>
      </div>

      {/* More Section */}
      <div className="flex flex-col items-center py-3 hover:cursor-pointer">
        <CiMenuBurger className="text-3xl" onClick={toggleSidebar} />
        <p className="text-sm">{getTranslation("more", selectedLanguage)}</p>

        {/* {/ Sidebar /} */}
        <div
          className={`fixed top-0 right-0 h-full w-80 shadow-lg transform transition-transform z-50 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}
        >
          <button
            onClick={toggleSidebar}
            className="text-xl self-end text-gray-600 dark:text-gray-400"
          >
            ✖
          </button>
          <div className="flex flex-col items-start px-4 py-6 space-y-6 h-full overflow-y-scroll scrollbar-hide">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`w-full flex items-center justify-between px-4 py-2 border-b cursor-pointer rounded-md ${
                  isDarkMode
                    ? "border-gray-700 hover:bg-gray-700"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
                onClick={item.action || null}
              >
                <span className="text-xl font-bold">{item.text}</span>
                {item.toggle || <div className="text-3xl">{item.icon}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={toggleSidebar}
          ></div>
        )}
      </div>

      {/* Language Selector Popup */}
      {isLanguagePopupOpen && (
        <LanguageSelector
          closePopup={() => setIsLanguagePopupOpen(false)}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
};

export default Footer;