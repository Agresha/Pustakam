import React, { useState, useEffect, useContext } from "react";
import WishlistStar from "../../BookDetail/Favourite";
import { ThemeContext } from "../ThemeProvider/themeprovider"; 
import { getTranslation } from "../TranslationHelper/translation";
import { FiShare2 } from "react-icons/fi";
import Footer from '../../home-components/Footer.jsx';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedLanguage, isDarkMode } = useContext(ThemeContext); 

  const fetchWishlist = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in localStorage");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://pustakam.pythonanywhere.com/user_data/${userId}/`);
      const data = await response.json();
      if (data) {
        setWishlist(data.data.wishlist_data || []);
      } else {
        console.error("User data not found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleWishlistUpdate = () => {
    fetchWishlist(); // Re-fetch the wishlist when called
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-mainColor border-solid"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-darkModeColor text-lightModeColor" : "bg-lightModeColor text-darkModeColor"}`}>
  <div className="max-w-[1350px] mx-auto pt-5 max-h-full mb-10">
    <div className={`rounded-md p-3 mb-8 bg-mainColor text-white`}>
      <h2 className="text-xl font-bold">{`${getTranslation('Your Favourites', selectedLanguage)}`}</h2>
    </div>
    <div className="flex flex-wrap gap-5">
      {wishlist.map((book) => (
        <div
          key={book.id}
          className={`w-full sm:w-[50%] lg:w-[49%] shadow-md rounded-lg p-4 flex gap-5 items-start ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"}`}
        >

          
          <img
            src={`https://pustakam.pythonanywhere.com${book.book_front_image}`}
            alt={book.book_name_english}
            className="w-24 h-32 object-cover rounded"
          />
          <div className="flex flex-col flex-1">
            <h2 className="text-lg font-semibold mb-2">{`${getTranslation('Book name', selectedLanguage)}`}: {book[`book_name_${selectedLanguage}`]}</h2>
            <h2 className="text-lg font-semibold mb-2">{`${getTranslation('Author name', selectedLanguage)}`}: {book[0]?.author_data[0]?.author_english}</h2>
            <p className={`font-bold mb-2 ${isDarkMode ? "text-lightModeColor" : "text-darkModeColor"}`}>₹{book.book_price}</p>
            <div className="flex space-x-4">
              <WishlistStar bookData={book} onWishlistUpdate={handleWishlistUpdate} />
              <button><FiShare2 size={20} /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  <Footer />
</div>
  );
};

export default Wishlist;
