import { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import { GiOpenBook } from "react-icons/gi";
import { FaRupeeSign } from "react-icons/fa";
import WishlistStar from "./Favourite"
import {
  FaSearch,
  FaBookmark,
  FaMicrophone,
  FaEllipsisV,
  FaChevronLeft,
} from "react-icons/fa";
import { ThemeContext } from "../components/ThemeProvider/themeprovider.jsx"; // Import ThemeContext
import { getTranslation } from "../components/TranslationHelper/translation"; // Import translation helper
import Footer from "../home-components/Footer.jsx";

function Detailpage() {
  const { isDarkMode, selectedLanguage } = useContext(ThemeContext); // Use ThemeContext
  const { id } = useParams();
  const [bookData, setBookData] = useState();
  const navigate = useNavigate();



 const [user, setUser] = useState({
    name: "",
    email: "",
    contact: "",
  });

  // Load Razorpay SDK dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay SDK Loaded');
    };
    document.body.appendChild(script);

    // Simulate fetching user details (replace with actual API call)
    const fetchUserDetails = async () => {
      const loggedInUser = {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9876543210",
      };
      setUser(loggedInUser);
    };

    fetchUserDetails();
  }, []);

  const handlePayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK is not loaded yet!");
      return;
    }

    const options = {
      key: "rzp_test_Ie5WFjNmrwbK72", 
      amount: 50000, 
      currency: "INR",
      name: "pustakam",
      description: "Test Transaction",
      image: "https://pustakam.pythonanywhere.com//image/finalLogo_EsgIfwU.jpeg",
      handler: (response) => {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.contact,
      },
      notes: {
        address: "Customer's address",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };





  async function fetchBookData() {
    const res = await fetch(`https://pustakam.pythonanywhere.com/books/${id}/`);
    const data = await res.json();
    setBookData(await data.data);
  }

  useEffect(() => {
    fetchBookData();
  }, []);

  if (!bookData)
    return (
      <div
        className={`min-h-screen flex justify-center items-center ${
          isDarkMode
            ? "bg-darkModeColor text-lightModeColor"
            : "bg-lightModeColor text-darkModeColor"
        }`}
      >
        <h1 className="text-4xl">
          {getTranslation("Loading...", selectedLanguage)}
        </h1>
      </div>
    );

  return (
    <>
      <div
        className={
          isDarkMode
            ? "bg-darkModeColor text-lightModeColor"
            : "bg-lightModeColor text-darkModeColor"
        }
      >
        {/* Navigation Bar */}
        <nav
          className={`w-full h-[10vh] flex items-center justify-between px-8 space-x-16 ${
            isDarkMode
              ? "bg-darkModeColor text-lightModeColor"
              : "bg-lightModeColor text-darkModeColor"
          }`}
        >
          <FaChevronLeft
            className="text-3xl cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <div className="flex items-center space-x-4 md:space-x-8">
            <WishlistStar bookData={bookData} />
            <FaSearch className="text-3xl cursor-pointer" />
            <FaBookmark className="text-3xl cursor-pointer" />
            <FaMicrophone className="text-3xl cursor-pointer" />
            <FaEllipsisV className="text-3xl cursor-pointer" />
          </div>
        </nav>

        {/* Book & Title Section */}
        <div
          className={`flex w-full h-[45vh] pb-5 border-b-2 justify-center md:justify-evenly items-center flex-col md:flex-row ${
            isDarkMode
              ? "bg-darkModeColor border-b-gray-700"
              : "bg-lightModeColor border-b-darkModeColor"
          }`}
        >
          <NavLink to={`/electronicPublication/${id}`} className="mb-4 md:mb-0">
            <div className="h-[240px] w-[190px] sm:w-[190px] sm:h-[270px] object-center">
              <img
                src={`https://pustakam.pythonanywhere.com/${bookData.book_front_image}`}
                alt={bookData.title || "Book Cover"}
                className={`h-[100%] w-[100%] sm:w-[100%] sm:h-[100%] object-center shadow-[0_2px_4px_rgba(0,0,0,0.2)] mx-auto ${
                  isDarkMode
                    ? "border-l-mainColor border-l-[7px]"
                    : "border-l-red-700 border-l-[7px]"
                }`}
              />
            </div>
          </NavLink>
          <div className="flex flex-col items-center md:items-start">
            <p
              className={`text-4xl md:text-8xl font-bold ${
                isDarkMode ? "text-lightModeColor" : "text-darkModeColor"
              }`}
            >
              {bookData[`book_name_${selectedLanguage}`]}
            </p>
            <p
              className={`text-lg md:text-2xl font-semibold mt-2 text-right w-full ${
                isDarkMode ? "text-lightModeColor" : "text-darkModeColor"
              }`}
            >
              {bookData.author_data && bookData.author_data.length > 0 ? (
                bookData.author_data.map((author, index) => {
                  const authorName =
                    selectedLanguage === "hindi"
                      ? author.author_hindi
                      : author.author_english;

                  return (
                    <span key={author.id}>
                      {authorName}
                      {index < bookData.author_data.length - 1 && ", "}
                    </span>
                  );
                })
              ) : (
                <span></span>
              )}
            </p>
          </div>
        </div>

        {/* Icon & Price Section */}
        <div
          className={`w-full h-[45vh] flex flex-col md:flex-row py-8 border-b-2 ${
            isDarkMode
              ? "bg-darkModeColor border-b-gray-700 text-lightModeColor"
              : "bg-lightModeColor border-b-darkModeColor text-darkModeColor"
          }`}
        >
          {/* Left Part */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center md:border-r-2 md:border-r-gray-700 md:border-b-0">
            <GiOpenBook
              className={`w-24 h-24 md:w-32 md:h-32 ${
                isDarkMode ? "text-mainColor" : "text-darkModeColor"
              }`}
            />
            <p className="text-2xl md:text-4xl font-bold mt-4">
              {getTranslation("E-book", selectedLanguage)}
            </p>
          </div>
          {/* Right Part */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center md:text-left">
            <p className="text-lg md:text-4xl font-bold">
              {getTranslation("Language", selectedLanguage)}
            </p>
            <p className="text-base md:text-2xl font-bold mt-2">
              {bookData.language_data && bookData.language_data.length > 0 ? (
                bookData.language_data
                  .map((language, index) => language.languages)
                  .join(" | ")
              ) : (
                <span></span>
              )}
            </p>
            <button
              className={`mt-6 px-16 py-2 text-white font-bold shadow text-xl pointer-events-none md:text-2xl ${
                isDarkMode ? "bg-mainColor" : "standard-bg-color"
              }`}
            >
              {bookData.book_price > 0 ? (
                <span className="flex items-center font-bold pointer-events-auto" onClick={handlePayment}>
                  <FaRupeeSign className="mr-1" />
                  {bookData.book_price}
                </span>
              ) : (
                <span className="font-bold ">
                  {getTranslation("Free", selectedLanguage)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Description Section */}
        <div
          className={`w-full h-[35vh] py-7 ${
            isDarkMode
              ? "bg-darkModeColor text-lightModeColor"
              : "bg-lightModeColor text-darkModeColor"
          }`}
        >
          <h1 className="text-xl md:text-2xl font-bold mb-4 pl-4">
            {getTranslation("Information of e-book:", selectedLanguage)}
          </h1>
          <p className="text-sm md:text-lg font-semibold px-4 md:px-14">
            {bookData[`book_details_${selectedLanguage}`]}
          </p>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Detailpage;