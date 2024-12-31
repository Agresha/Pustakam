import React, { useEffect, useRef, useState, useContext } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import { ThemeContext } from "../components/ThemeProvider/themeprovider.jsx"; // Import ThemeContext

// Set the worker path to the public directory
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

const PDFViewer = ({ id }) => {
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext for dark mode
  const [pdf, setPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [highlights, setHighlights] = useState([]);
  const [selection, setSelection] = useState(null);
  const canvasRef = useRef(null);
  const highlightLayerRef = useRef(null);
  const renderTaskRef = useRef(null); // Keep track of the current render task

  const [highlightColor, setHighlightColor] = useState("yellow");

  const handleColorChange = (color) => {
    setHighlightColor(color);
  };

  const colorOptions = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
  ];

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(
          `https://pustakam.pythonanywhere.com/books/${id}/`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch the PDF file");
        }

        const data = await response.json();
        const pdfUrl = `https://pustakam.pythonanywhere.com/${data.data.book_file}`;

        // Fetch the PDF as a blob
        const pdfBlob = await fetch(pdfUrl).then((res) => res.blob());

        const pdfData = await pdfBlob.arrayBuffer();
        const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;

        setPdf(pdfDoc);
        setTotalPages(pdfDoc.numPages);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPdf();
  }, [id]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdf) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Cancel the previous render task if it exists
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      try {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        // Start a new render task
        renderTaskRef.current = page.render(renderContext);

        // Wait for the rendering to finish
        await renderTaskRef.current.promise;

        // Create a highlight layer if it doesn't exist
        if (!highlightLayerRef.current) {
          const highlightLayer = document.createElement("div");
          highlightLayer.style.position = "absolute";
          highlightLayer.style.top = `${canvas.offsetTop}px`;
          highlightLayer.style.left = `${canvas.offsetLeft}px`;
          highlightLayer.style.width = `${canvas.width}px`;
          highlightLayer.style.height = `${canvas.height}px`;
          highlightLayer.style.pointerEvents = "none";
          highlightLayer.style.zIndex = 1;

          canvas.parentElement.style.position = "relative";
          canvas.parentElement.appendChild(highlightLayer);
          highlightLayerRef.current = highlightLayer;
        }

        // Clear previous highlights
        highlightLayerRef.current.innerHTML = "";

        // Render existing highlights
        highlights
          .filter((highlight) => highlight.pageIndex === pageNumber)
          .forEach((highlight) =>
            addHighlight(highlight.position, highlight.color)
          );

        console.log("Page rendered");
      } catch (error) {
        if (error.name === "RenderingCancelledException") {
          console.log("Rendering cancelled");
        } else {
          console.error("Error rendering page:", error);
        }
      } finally {
        renderTaskRef.current = null;
      }
    };

    renderPage();
  }, [pdf, pageNumber, highlights]);

  const goToPreviousPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, totalPages));

  const handleMouseDown = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    setSelection({
      startX: offsetX,
      startY: offsetY,
      endX: offsetX,
      endY: offsetY,
    });

    // Create the selection border
    if (highlightLayerRef.current) {
      const selectionBorder = document.createElement("div");
      selectionBorder.id = "selection-border";
      selectionBorder.style.position = "absolute";
      selectionBorder.style.border = "1px dashed black";
      selectionBorder.style.pointerEvents = "none";
      highlightLayerRef.current.appendChild(selectionBorder);
    }
  };

  const handleMouseMove = (event) => {
    if (selection) {
      const { offsetX, offsetY } = event.nativeEvent;
      setSelection({ ...selection, endX: offsetX, endY: offsetY });

      // Update the selection border
      const selectionBorder = document.getElementById("selection-border");
      if (selectionBorder) {
        selectionBorder.style.top = `${Math.min(selection.startY, offsetY)}px`;
        selectionBorder.style.left = `${Math.min(selection.startX, offsetX)}px`;
        selectionBorder.style.width = `${Math.abs(
          selection.startX - offsetX
        )}px`;
        selectionBorder.style.height = `${Math.abs(
          selection.startY - offsetY
        )}px`;
      }
    }
  };

  const handleMouseUp = () => {
    if (selection) {
      const { startX, startY, endX, endY } = selection;
      const newHighlight = {
        position: {
          top: Math.min(startY, endY),
          left: Math.min(startX, endX),
          width: Math.abs(startX - endX),
          height: Math.abs(startY - endY),
        },
        pageIndex: pageNumber,
        color: highlightColor, // Store the current color
      };
      setHighlights((prev) => [...prev, newHighlight]);
      setSelection(null);

      // Remove the selection border
      const selectionBorder = document.getElementById("selection-border");
      if (selectionBorder) {
        highlightLayerRef.current.removeChild(selectionBorder);
      }
    }
  };

  const addHighlight = (position, color) => {
    const highlightDiv = document.createElement("div");
    highlightDiv.style.position = "absolute";
    highlightDiv.style.top = `${position.top}px`;
    highlightDiv.style.left = `${position.left}px`;
    highlightDiv.style.width = `${position.width}px`;
    highlightDiv.style.height = `${position.height}px`;
    highlightDiv.style.backgroundColor = color; // Use the stored color
    highlightDiv.style.opacity = 0.5;
    highlightDiv.style.pointerEvents = "none";

    if (highlightLayerRef.current) {
      highlightLayerRef.current.appendChild(highlightDiv);
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selection]);

  return (
    <div
      className={`container mx-auto mt-10 px-4 ${
        isDarkMode
          ? "bg-darkModeColor text-lightModeColor"
          : "bg-lightModeColor text-darkModeColor"
      }`}
    >
      <div className="flex justify-center space-x-4 py-4">
        {/* <h3 className="text-lg">Select Highlight Color</h3> */}
        {colorOptions.map((color) => (
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
      {pdf ? (
        <>
          <div className="relative">
            <canvas
              ref={canvasRef}
              className={`border mx-auto ${
                isDarkMode ? "border-gray-600" : "border-gray-400"
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
            />
          </div>
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={goToPreviousPage}
              disabled={pageNumber === 1}
              className={`px-4 py-2 rounded-md font-bold ${
                isDarkMode
                  ? "bg-blue-500 hover:bg-blue-600 text-gray-100 disabled:bg-gray-600"
                  : "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400"
              }`}
            >
              Previous
            </button>
            <span className="text-lg font-semibold">
              Page {pageNumber} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={pageNumber === totalPages}
              className={`px-4 py-2 rounded-md font-bold ${
                isDarkMode
                  ? "bg-blue-500 hover:bg-blue-600 text-gray-100 disabled:bg-gray-600"
                  : "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400"
              }`}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-xl">
          {isDarkMode ? "Loading PDF..." : "Loading PDF..."}
        </p>
      )}
    </div>
  );
};

export default PDFViewer;