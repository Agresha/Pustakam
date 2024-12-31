import React, { createContext, useState, useEffect } from "react";

// Create the context
export const ThemeContext = createContext();

// Create the provider component
export const ThemeProvider = ({ children }) => {
  // State for theme
  const [isDarkMode, setIsDarkMode] = useState(false);
  const userId = localStorage.getItem("userId");
  console.log(userId);

  // State for language
  const [selectedLanguage, setSelectedLanguage] = useState("Hindi");

  // State for user preference
  const [isUserPreferredTheme, setIsUserPreferredTheme] = useState(false);

  // Function to determine if the current time is "day" or "night"
  const isNightTime = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 18 || currentHour < 6; // Night time: 6 PM to 6 AM
  };

  // Load saved theme and language from localStorage on initial render
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
        return;
      }

      try {
        const response = await fetch(`https://pustakam.pythonanywhere.com/user_data/${userId}/`);
        const data = await response.json();
        console.log("data", data);

        let savedTheme = data.data.theme;
        if (savedTheme === "dark") {
          setIsDarkMode(true);
          document.documentElement.classList.add("dark");
        } else {
          setIsDarkMode(false);
          document.documentElement.classList.remove("dark");
        }

        let apiLanguage = data.data.language;
        if (!apiLanguage) {
          apiLanguage = "english"; // Default to English if language is null
        }
        setSelectedLanguage(apiLanguage);
        localStorage.setItem("language", apiLanguage);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    const savedTheme = localStorage.getItem("theme");
    const savedUserPreference = localStorage.getItem("userPreferredTheme") === "true";
    const savedLanguage = localStorage.getItem("language") || "Hindi";

    setSelectedLanguage(savedLanguage);
    setIsUserPreferredTheme(savedUserPreference);

    if (savedUserPreference) {
      const isDark = savedTheme === "dark";
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      const nightMode = isNightTime();
      setIsDarkMode(nightMode);
      document.documentElement.classList.toggle("dark", nightMode);
    }
  }, [userId]);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    const theme = newMode ? "dark" : "light";
    document.documentElement.classList.toggle("dark", newMode);

    if (!userId) {
      console.log("Guest user: theme changes will not be saved.");
      return;
    }

    try {
      const response = await fetch(`https://pustakam.pythonanywhere.com/user_data/${userId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme: theme,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update theme in API");
      }

      console.log("Theme updated successfully in API");
    } catch (error) {
      console.error("Error updating theme:", error);
    }
    setIsUserPreferredTheme(true);
    localStorage.setItem("userPreferredTheme", "true");
  };

  const handleLanguageChange = async (language) => {
    setSelectedLanguage(language);
    localStorage.setItem("language", language);

    if (!userId) {
      console.log("Guest user: language changes will not be saved.");
      return;
    }

    try {
      const response = await fetch(`https://pustakam.pythonanywhere.com/user_data/${userId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          languages: language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update language in API");
      }

      console.log("Language updated successfully in API");
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        selectedLanguage,
        handleLanguageChange,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};