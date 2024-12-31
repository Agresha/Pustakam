import { useEffect, useState, useRef, useContext } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { NavLink } from "react-router";
import { ThemeContext } from "../components/ThemeProvider/themeprovider.jsx"; // Import ThemeContext
import { getTranslation } from "../components/TranslationHelper/translation"; // Import translation helper

function MostDownloadedBooks() {
  const { isDarkMode, selectedLanguage} = useContext(ThemeContext); // Consume ThemeContext
  const [books, setBooks] = useState([]);
  const scrollContainerRef = useRef(null); // Ref for the scrollable container  

  async function fetchData() {
    const res = await fetch('https://pustakam.pythonanywhere.com/books/');
    const data = await res.json();
    setBooks(await data.data);
  }

  useEffect(() => {
    fetchData();
  }, [selectedLanguage]);

  const mostDownloadedBooks = [...books]
    .sort((a, b) => b.download_count - a.download_count)
    .slice(0, 10);

  // Function to handle right arrow click and scroll to the end
  const scrollToEnd = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.scrollWidth,
        behavior: 'smooth', // Smooth scroll
      });
    }
  };

  if (!books) return <h1>loading...</h1>;

  return (
    <div
      className={`max-w-[1300px] mx-auto my-0 p-5 ${
        isDarkMode ? "bg-darkModeColor text-lightModeColor" : "bg-lightModeColor text-darkModeColor"
      }`}
    >
      {/* Flex container for header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl">{getTranslation("Most Downloaded Books", selectedLanguage)}</h2>

        {/* Language change icon with click functionality */}
        <FaArrowRightLong
          style={{ fontSize: '22px', cursor: 'pointer' }}
          onClick={scrollToEnd} // Trigger scroll on click
        />
      </div>

      <div className="h-0.5 bg-mainColor mt-0 mb-5 mx-auto"></div>

      <div
        ref={scrollContainerRef} // Attach the ref here
        className={`flex overflow-x-scroll sm:space-x-20 p-3 space-x-0 ${
          isDarkMode ? "scrollbar-dark" : "scrollbar-light"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {mostDownloadedBooks.map((currEle, index) => (
          <div
            className="flex-[0_0_auto] text-center min-w-[180px]"
            key={index}
          >
            <NavLink to={`/detailpage/${currEle.id}`}>
            <div className="h-[190px] w-[140px] sm:w-[160px] sm:h-[220px] object-center">      
              <img
                src={`https://pustakam.pythonanywhere.com/${currEle.book_front_image}`}
                alt={currEle.title || "Book Cover"}
                className={`h-[100%] w-[100%] sm:w-[100%] sm:h-[100%] object-center shadow-[0_2px_4px_rgba(0,0,0,0.2)] mx-auto ${
                  isDarkMode ? "filter brightness-90" : ""
                }`}
              />
              </div>
            </NavLink>
            <p
              title={currEle[`book_name_${selectedLanguage}`]}
              className={`text-base w-[160px] mt-2.5 truncate mx-auto ${
                isDarkMode ? "text-lightModeColor" : "text-darkModeColor"
              }`}
            >
              <b>{currEle[`book_name_${selectedLanguage}`]}</b>
            </p>
          </div>
        ))}
      </div>

      {/* Add custom scrollbar-hide CSS */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default MostDownloadedBooks;
