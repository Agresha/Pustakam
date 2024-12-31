import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ThemeContext } from "../components/ThemeProvider/themeprovider.jsx"; // Import the ThemeContext
import "./Advertice.css"
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Advertisment() {
  const { isDarkMode } = useContext(ThemeContext); // Consume the ThemeContext
  const [AdData, SetAdData] = useState([]);

  // Fetch Advertisement Data
  async function fetchAdData() {
    try {
      const res = await fetch('https://pustakam.pythonanywhere.com/advertisement/');
      const data = await res.json();
      SetAdData(data.data || []); // Fallback to empty array
    } catch (error) {
      console.error("Error fetching ads:", error);
      SetAdData([]);
    }
  }

  useEffect(() => {
    fetchAdData();
  }, []);

  return (
    <div
      className={`Advertice relative overflow-hidden container mx-auto z-0 ${
        isDarkMode ? "bg-darkModeColor text-lightModeColor" : "bg-lightModeColor text-darkModeColor"
      }`}
    >
      {AdData.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          spaceBetween={30}
          slidesPerView={1}
        >
          {AdData.map((currEle, index) => (
            <SwiperSlide key={index}>
              <a
                href={currEle.url || '#'}
                rel="noopener noreferrer"
                className="object-cover"
              >
              <div className="w-[100%] mx-auto">
                <img
                  src={`https://pustakam.pythonanywhere.com/${currEle.file}`}
                  alt={currEle.title || "Advertisement"}
                  className={`w-[100%] h-[100%] shadow-[0_4px_4px_rgba(0,0,0,0.5)]${
                    isDarkMode ? "filter brightness-90" : ""
                  }`}
                />                 
              </div>

              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

export default Advertisment;
