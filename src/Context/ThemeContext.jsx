import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Automatically set the theme based on the time of day
    const hours = new Date().getHours();
    setIsDarkMode(hours >= 18 || hours < 6); // Night mode between 6 PM and 6 AM
  }, []);

  useEffect(() => {
    // Apply dark or light theme to the body
    document.body.className = isDarkMode ? "dark-theme" : "light-theme";
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
