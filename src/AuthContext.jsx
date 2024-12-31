import React, { createContext, useContext, useState } from "react";

// Create the AuthContext
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));

  const login = (token) => {
    setUserToken(token);
    localStorage.setItem("userToken", token);
  };
  const guestLogin = (token) => {
    setUserToken(token);
    localStorage.setItem("userToken", token);
  };

  const signup=(token)=>{
    setUserToken(token);
    localStorage.setItem("userToken", token);
  }

  const logout = () => {
    setUserToken(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    localStorage.setItem("userType","logOutUser")
  };

  return (
    <AuthContext.Provider value={{ login, logout, guestLogin,signup,userToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
