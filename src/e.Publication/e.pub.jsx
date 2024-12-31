import React, { useEffect, useRef, useState, useContext } from "react";
import { ReactReader, ReactReaderStyle } from "react-reader";
import { ImCross } from "react-icons/im";
import { IoSettingsSharp } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../components/ThemeProvider/themeprovider.jsx"; // Import ThemeContext
import EbookNavbar from "./E.bookNavbar.jsx";
import PDFViewer from "./pdfFile.jsx";
import "./e.pub.css";

const ElectronicPublication = () => {
  const { isDarkMode, selectedLanguage } = useContext(ThemeContext); // Consume ThemeContext
  const [selections, setSelections] = useState([]);
  const [size, setSize] = useState(100);
  const [page, setPage] = useState("");
  const [location, setLocation] = useState(null);
  const [firstRenderDone, setFirstRenderDone] = useState(false);
  const [highlightColor, setHighlightColor] = useState("yellow");
  const [fontColor, setFontColor] = useState('');
  const toRef = useRef(null);
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const renditionRef = useRef(null);
  const [brightness, setBrightness] = useState(100);

  // Fetch the book data based on the given ID
  const fetchEpubBook = async () => {
    try {
      const res = await fetch(
        `https://pustakam.pythonanywhere.com/books/${id}/`
      );
      const data = await res.json();
      setBook(data.data);
    } catch (error) {
      console.error("Error fetching book:", error);
    }
  };

  useEffect(() => {
    fetchEpubBook();
  }, [id]);

  const locationChanged = (epubcifi) => {
    if (renditionRef.current && toRef.current) {
      const { displayed, href } = renditionRef.current.location.start;
      const chapter = toRef.current.find((item) => item.href === href);
      setPage(
        `Page ${displayed.page} of ${displayed.total} in chapter ${
          chapter ? chapter.label : "n/a"
        }`
      );
    }

    if (!firstRenderDone) {
      setLocation(localStorage.getItem("book-progress"));
      setFirstRenderDone(true);
      return;
    }
    localStorage.setItem("book-progress", epubcifi); // Save the current position
    setLocation(epubcifi);
  };

  const changeSize = (newSize) => {
    setSize(newSize);
  };

  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${size}%`);
    }
  }, [size]);

  useEffect(() => {
    if (renditionRef.current) {
      const setRenderSelection = (cfiRange, contents) => {
        const newSelection = {
          text: renditionRef.current.getRange(cfiRange).toString(),
          cfiRange,
          color: highlightColor,
        };

        const updatedSelections = [...selections, newSelection];
        setSelections(updatedSelections);
        localStorage.setItem("highlights", JSON.stringify(updatedSelections));

        if (renditionRef.current && renditionRef.current.annotations) {
          renditionRef.current.annotations.add(
            "highlight",
            cfiRange,
            {},
            null,
            "h1",
            {
              fill: highlightColor,
              "fill-opacity": "0.5",
              "mix-blend-mode": "multiply",
            }
          );
        }

        contents.window.getSelection().removeAllRanges();
      };

      renditionRef.current.on("selected", setRenderSelection);
      return () => {
        renditionRef.current.off("selected", setRenderSelection);
      };
    }
  }, [selections, highlightColor]);

  const handleColorChange = (color) => {
    setHighlightColor(color);
  };

  const handleFontColor = (color) => {
    setFontColor(color)
  }

  const handleBrightnessChange = (event) => {
    setBrightness(event.target.value); // Update brightness
  };

  const highlightOptions = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
  ];

  const colorOptions = [
    "red",
    "orange",
    "yellow",
    "white",
    "black"
  ];

  const handleRemoveHighlight = (cfiRange) => {
    const updatedSelections = selections.filter(
      (selection) => selection.cfiRange !== cfiRange
    );
    setSelections(updatedSelections);
    localStorage.setItem("highlights", JSON.stringify(updatedSelections));
    if (renditionRef.current && renditionRef.current.annotations) {
      renditionRef.current.annotations.remove(cfiRange, "highlight");
    }
  };

  const handleShowHighlight = (cfiRange) => {
    if (renditionRef.current) {
      // Use the `goTo` function to navigate to the specific CFI (Canonical Fragment Identifier)
      renditionRef.current.display(cfiRange); // This will navigate to the highlight location
    }
  };

  useEffect(() => {
    // Load highlights from localStorage if available
    const savedHighlights =
      JSON.parse(localStorage.getItem("highlights")) || [];
    if (Array.isArray(savedHighlights)) {
      savedHighlights.forEach((highlight) => {
        if (renditionRef.current && renditionRef.current.annotations) {
          renditionRef.current.annotations.add(
            "highlight",
            highlight.cfiRange,
            {},
            null,
            "h1",
            {
              fill: highlight.color,
              "fill-opacity": "0.5",
              "mix-blend-mode": "multiply",
            }
          );
        }
      });
      setSelections(savedHighlights);
    }
  }, []);

  useEffect(() => {
    if (renditionRef.current) {
      // Update theme whenever `isDarkMode` changes
      renditionRef.current.themes.select(isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const highlights = JSON.parse(localStorage.getItem("highlights")) || [];
    if (Array.isArray(highlights)) {
      highlights.forEach((highlight) => {
        if (renditionRef.current && renditionRef.current.annotations) {
          renditionRef.current.annotations.add(
            "highlight",
            highlight.cfiRange,
            {},
            null,
            "h1",
            {
              fill: highlight.color,
              "fill-opacity": "0.5",
              "mix-blend-mode": "multiply",
            }
          );
        }
      });
      setSelections(highlights);
    }
  }, []);

  // Define themes
  const lightTheme = {
    body: {
      background: "white",
      color: 'black',
    },
  };

  const darkTheme = {
    body: {
      background: "black",
      color: 'white',
    },
  };

  // Set up the theme for ReactReader
  const setupRendition = (rendition) => {
    renditionRef.current = rendition;

    // Register light and dark themes
    rendition.themes.register("light", lightTheme);
    rendition.themes.register("dark", darkTheme);

    // Select the correct theme based on the current `isDarkMode`
    rendition.themes.select(isDarkMode ? "dark" : "light");
  };

  const lightReaderTheme = {
    ...ReactReaderStyle,
    readerArea: {
      ...ReactReaderStyle.readerArea,
      transition: undefined,
    },
  };

  const darkReaderTheme = {
    ...ReactReaderStyle,
    arrow: {
      ...ReactReaderStyle.arrow,
      color: "white",
    },
    arrowHover: {
      ...ReactReaderStyle.arrowHover,
      color: "#ccc",
    },
    readerArea: {
      ...ReactReaderStyle.readerArea,
      backgroundColor: "#000",
      transition: undefined,
    },
    titleArea: {
      ...ReactReaderStyle.titleArea,
      color: "#ccc",
    },
    tocArea: {
      ...ReactReaderStyle.tocArea,
      background: "#111",
    },
    tocButtonExpanded: {
      ...ReactReaderStyle.tocButtonExpanded,
      background: "#222",
    },
    tocButtonBar: {
      ...ReactReaderStyle.tocButtonBar,
      background: "#fff",
    },
    tocButton: {
      ...ReactReaderStyle.tocButton,
      color: "white",
    },
  };

  if (!book)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1
          className={`text-4xl ${
            isDarkMode ? "text-lightModeColor" : "text-darkModeColor"
          }`}
        >
          Loading...
        </h1>
      </div>
    );

  const fileName = book.book_file;

  const brightnessStyle = {
    filter: `brightness(${brightness}%)`,
  };

  if (fileName.endsWith(".epub")) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode
            ? "bg-darkModeColor text-lightModeColor"
            : "bg-lightModeColor text-darkModeColor"
        }`}
        style={brightnessStyle}
      >
        <EbookNavbar />

        <div className="flex justify-center space-x-4 py-4">
          <span className="text-xl">{`Adjust Brightness: ${brightness}%`}</span>
          <input
            type="range"
            min="0"
            max="200"
            value={brightness}
            onChange={handleBrightnessChange}
            className="px-4 py-2 bg-gray-300 rounded-md"
          />
        </div>

        {/* Font Size Controls */}
        <div className="flex justify-center space-x-4 py-4">
          <button
            onClick={() => changeSize(Math.max(80, size - 10))}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            -
          </button>
          <span className="text-xl">{`Current size: ${size}%`}</span>
          <button
            onClick={() => changeSize(Math.min(130, size + 10))}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            +
          </button>
        </div>

        <div
          className={`highlights-container p-6 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
          } rounded-lg shadow-lg`}
        >
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            } mb-4`}
          >
            Highlights
          </h2>
          {selections.length > 0 ? (
            selections.map((highlight, index) => (
              <div
                key={index}
                className={`highlight-item flex items-center justify-between p-4 mb-4 ${
                  isDarkMode ? "bg-gray-700" : "bg-white"
                } rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200`}
              >
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  {highlight.text}
                </span>
                <div className="flex space-x-3">
                  <button
                    className={`px-4 py-2 ${
                      isDarkMode ? "bg-red-600" : "bg-red-500"
                    } text-white rounded-md text-sm font-medium transition-colors hover:${
                      isDarkMode ? "bg-red-700" : "bg-red-600"
                    } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50`}
                    onClick={() => handleRemoveHighlight(highlight.cfiRange)}
                  >
                    Remove
                  </button>
                  <button
                    className={`px-4 py-2 ${
                      isDarkMode ? "bg-blue-600" : "bg-blue-500"
                    } text-white rounded-md text-sm font-medium transition-colors hover:${
                      isDarkMode ? "bg-blue-700" : "bg-blue-600"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                    onClick={() => handleShowHighlight(highlight.cfiRange)}
                  >
                    Show
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No highlights available.
            </p>
          )}
        </div>

        {/* Highlight Color Options */}
        <div className="flex justify-center space-x-4 py-4">
          <h2>select color of highlight</h2>
          {highlightOptions.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              style={{
                backgroundColor: color,
                width: "40px", // Circle diameter
                height: "40px", // Circle diameter
                borderRadius: "50%", // Makes the shape circular
                border: highlightColor === color ? "3px solid black" : "none", // Border when selected
                margin: "5px",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        {/* <div className="flex justify-center space-x-4 py-4">
          <h2>select color of font</h2>
          {colorOptions.map((color) => (
            <button
              key={color}
              onClick={() => handleFontColor(color)}
              style={{
                backgroundColor: color,
                width: "40px", // Circle diameter
                height: "40px", // Circle diameter
                borderRadius: "50%", // Makes the shape circular
                border: fontColor === color ? "3px solid black" : "none", // Border when selected
                margin: "5px",
                cursor: "pointer",
              }}
            />
          ))}
        </div> */}

        {/* ReactReader */}
        <div style={{ height: "calc(100vh - 150px)" }}>
          <ReactReader
            title={book[`book_name_${selectedLanguage}`]}
            url={`https://pustakam.pythonanywhere.com/${book.book_file}`}
            location={location}
            locationChanged={locationChanged}
            readerStyles={isDarkMode ? darkReaderTheme : lightReaderTheme}
            getRendition={(rendition) => {
              setupRendition(rendition);
              const highlights =
                JSON.parse(localStorage.getItem("highlights")) || [];
              if (Array.isArray(highlights)) {
                highlights.forEach((highlight) => {
                  if (
                    renditionRef.current &&
                    renditionRef.current.annotations
                  ) {
                    renditionRef.current.annotations.add(
                      "highlight",
                      highlight.cfiRange,
                      {},
                      null,
                      "h1",
                      {
                        fill: highlight.color,
                        "fill-opacity": "0.5",
                        "mix-blend-mode": "multiply",
                      }
                    );
                  }
                });
                setSelections(highlights);
              }
            }}
            tocChanged={(toc) => (toRef.current = toc)}
            epubOptions={{
              flow: "scrolled",
              manager: "continuous",
            }}
          />
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center h-16 px-4 bg-gray-800 text-white">
          <div className="flex space-x-14">
            <ImCross className="text-3xl cursor-pointer hover:text-red-500" />
            <IoSettingsSharp className="text-3xl cursor-pointer" />
          </div>
          <div className="flex space-x-14">
            <FaChevronLeft className="text-3xl cursor-pointer" />
            <FaChevronRight className="text-3xl cursor-pointer" />
          </div>
        </div>
      </div>
    );
  } else if (fileName.endsWith(".pdf")) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode
            ? "bg-darkModeColor text-lightModeColor"
            : "bg-lightModeColor text-darkModeColor"
        }`}
      >
        <EbookNavbar />
        <PDFViewer id={id} />
      </div>
    );
  }
};

export default ElectronicPublication;
