import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../ThemeProvider/themeprovider"; // Import ThemeContext
import { getTranslation } from "../TranslationHelper/translation"; // Import translation helper
import { MdKeyboardArrowDown } from "react-icons/md"; // Import the down arrow icon
import { NavLink } from "react-router-dom";
import Footer from '../../home-components/Footer.jsx'


const BooksByTopic = () => {
  const { isDarkMode,selectedLanguage } = useContext(ThemeContext); // Use selected language from ThemeContext
  const [topics, setTopics] = useState([]);
  const [booksByTopic, setBooksByTopic] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const topicsApiUrl = "https://pustakam.pythonanywhere.com/topic/";
  const booksApiUrl = "https://pustakam.pythonanywhere.com/books/";

  useEffect(() => {
    const fetchTopicsAndBooks = async () => {
      setIsLoading(true); // Start loading
      try {
        const topicsResponse = await fetch(topicsApiUrl);
        const topicsData = await topicsResponse.json();

        if (topicsData.data && Array.isArray(topicsData.data)) {
          const topics = topicsData.data;
          setTopics(topics);

          const booksResponse = await fetch(booksApiUrl);
          const booksData = await booksResponse.json();

          if (booksData.data && Array.isArray(booksData.data)) {
            const books = booksData.data;

            const booksByTopicData = {};
            topics.forEach((topic) => {
              const booksForTopic = books.filter(
                (book) =>
                  Array.isArray(book.topic_data) &&
                  book.topic_data.some((bookTopic) => bookTopic.id === topic.id)&&
                  book.book_price === 0 // Filter only books with a price of 0
              );

              if (booksForTopic.length > 0) {
                booksByTopicData[topic.id] = booksForTopic;
              }
            });
            setBooksByTopic(booksByTopicData);
          } else {
            console.error("Unexpected books API response format:", booksData);
          }
        } else {
          console.error("Unexpected topics API response format:", topicsData);
        }
      } catch (error) {
        console.error("Error fetching topics and books:", error);
      }
      finally {
        setIsLoading(false); // Stop loading
      }
    };
    fetchTopicsAndBooks();
  }, []);
  if (isLoading) {
    // Display loader while data is being fetched
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-mainColor border-solid"></div>
      </div>
    );
  }
  return (
    <div>
        
        <div className="max-w-[1350px] mx-auto p-5 mb-8">
        <div className={`rounded-md p-3 mb-8 ${isDarkMode ? "bg-gray-800 text-white" : "bg-mainColor text-white"}`}>
          <h2 className="text-xl font-bold">{`${getTranslation('Free Books', selectedLanguage)}`}</h2>
        </div>
        {topics
          .filter((topic) => booksByTopic[topic.id]?.length > 0) // Filter topics with books
          .map((topic) => (
            <div key={topic.id} className="mb-8">
              {/* Topic Title */}
              <div className="bg-mainColor text-white rounded-md p-3 relative">
                <h2 className="text-lg sm:text-xl font-bold">
                  {getTranslation(topic[`topic_${selectedLanguage}`], selectedLanguage)}
                </h2>
                <button className="absolute bottom-3 right-3 text-white text-sm sm:text-base">
                  <MdKeyboardArrowDown size={24} />
                </button>
              </div>
              {/* Books Carousel */}
              <div className="relative overflow-x-auto whitespace-nowrap scrollbar-hide mt-4">
                <div className="inline-flex space-x-4">
                  {booksByTopic[topic.id].map((book) => (
                    <NavLink to={`/detailpage/${book.id}`} key={book.id}>
                      <div className="bg-white border-2 border-customBlue shadow-md rounded-lg p-4 w-[150px] sm:w-[200px] flex-shrink-0">
                        <div className="h-[160px] w-[120px] sm:w-[140px] sm:h-[190px] lg:w-[160px] lg:h-[220px] mx-auto object-center">
                          <img
                            src={`https://pustakam.pythonanywhere.com/${book.book_front_image}`}
                            alt={book.title || "Book Cover"}
                            className={`h-full w-full object-cover shadow-md ${
                              isDarkMode ? "filter brightness-90" : ""
                            }`}
                          />
                        </div>
                        <div className="h-14 mt-2">
                          <h3
                            className="text-sm sm:text-base font-semibold truncate text-center"
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              wordWrap: "break-word",
                            }}
                          >
                            {book[`book_name_${selectedLanguage}`]}
                          </h3>
                        </div>
                        {/* <div className="mt-2 text-center">
                          <span className="text-red-500 line-through font-bold text-sm sm:text-base">
                            Rs. {book.book_price}
                          </span>
                        </div> */}
                        <button 
                          className="bg-mainColor text-white px-3 py-1 sm:px-4 sm:py-2 mt-2 rounded-md w-full text-sm sm:text-base"
                        >
                          {book.book_price_discount === 0 ? `${getTranslation('Read', selectedLanguage)}`: `Rs. ${book.book_price_discount}`}
                        </button>
                      </div>
                    </NavLink>
                ))}
          </div>
        </div>
      </div>
    ))}
</div>

        <Footer/>
    </div> 
  );
};
export default BooksByTopic;