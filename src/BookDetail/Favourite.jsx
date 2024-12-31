import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

function WishlistToggle({ bookData, onWishlistUpdate }) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [userId, setUserId] = useState(null);
  const [favoriteId, setFavoriteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Prevent multiple clicks

  // Fetch user data from localStorage and initialize wishlist state
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      console.error("User not logged in.");
      return;
    }
    setUserId(storedUserId);

    // Fetch wishlist_data from user_data API
    fetch(`https://pustakam.pythonanywhere.com/user_data/${storedUserId}/`)
      .then((res) => res.json())
      .then((data) => {
        const wishlist = data.data.wishlist_data || [];
        const favoriteEntry = wishlist.find((book) => book.id === bookData.id);

        if (favoriteEntry) {
          setIsInWishlist(true);
          setFavoriteId(favoriteEntry.id); // Save the ID for future DELETE operations
        } else {
          setIsInWishlist(false);
          setFavoriteId(null);
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [bookData.id]);

  // Toggle wishlist state and update the API
  const toggleWishlist = async () => {
    if (!userId) {
      alert("User not logged in.");
      return;
    }

    if (isLoading) {
      return; // Prevent multiple clicks while request is in progress
    }

    setIsLoading(true); // Set loading to true

    try {
      if (isInWishlist) {
        // Remove book from favorites
        if (favoriteId) {
          await fetch(
            `https://pustakam.pythonanywhere.com/favourite/user_id/${userId}/book_id/${favoriteId}/`,
            {
              method: "DELETE",
            }
          );
          setIsInWishlist(false);
          setFavoriteId(null);

          if (onWishlistUpdate) {
            onWishlistUpdate();
          }
        }
      } else {
        // Add book to favorites
        const res = await fetch(`https://pustakam.pythonanywhere.com/favourite/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_data: userId,
            book_data: bookData.id,
          }),
        });
        const newFavorite = await res.json();
        setIsInWishlist(true);
        setFavoriteId(newFavorite.id); // Save the new entry's ID for future DELETE operations

        if (onWishlistUpdate) {
          onWishlistUpdate();
        }
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div
      onClick={!isLoading ? toggleWishlist : undefined} // Disable click while loading
      className={`cursor-pointer ${isLoading ? "opacity-50" : ""}`}
    >
      {isInWishlist ? (
        <FaStar className="text-yellow-500 text-3xl" />
      ) : (
        <FaRegStar className="text-gray-400 text-3xl" />
      )}
    </div>
  );
}

export default WishlistToggle;
