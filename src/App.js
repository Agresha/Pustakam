import './App.css';
import React, { useState, useEffect, useContext } from "react";
import { createBrowserRouter, RouterProvider,Navigate } from 'react-router-dom';
import logo from "../src/Assets/images/pustakam_logo.png";
import SplashScreen from "./components/SplashScreen/SplashScreen.jsx";
import Onboarding from './components/onBoarding/onBoardingScreen.jsx'
import Language from "./components/Language/Language.jsx";
import HomePage from "./DashBoard/HomePage.jsx";
import Detailpage from "./BookDetail/DetailPage.jsx";
import ElectronicPublication from "./e.Publication/e.pub.jsx";
import LoginForm from './components/LoginForm/LoginForm.jsx';
import SignupForm from './components/SignUpForm/SignUpForm.jsx';
import ForgotPasswordForm from "./components/ForgotPasswordForm/ForgotPasswordForm.jsx";
import BooksByTopic from "./components/BookByTopic/BookByTopic";
import { ThemeContext } from "./components/ThemeProvider/themeprovider.jsx";
import { AuthProvider } from "./AuthContext";  // Import AuthProvider
import FavouritePage from "./components/FavouritePage/FavouritePage.jsx"
import FreeBookPage from './components/FreeBookPage/FreeBookPage.jsx';
import Subscription from "./components/paymentGateway/Subscription.jsx";
import Razerpay from "./components/paymentGateway/Razerpay.jsx";

const PrivateRoute = ({ element }) => {
  const userSession = localStorage.getItem("userToken"); // Check for user session
  return userSession ? element : <Navigate to="/login" replace />;
};


function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user_type=localStorage.getItem("userType");
  useEffect(() => {     
    const token = localStorage.getItem("userId");     
    if (token) {       
        setIsLoggedIn(true);     
    }      

    const currentPath = window.location.pathname; // Get the current pathname      

    // Check if splash screen has been shown before
    const hasShownSplash = sessionStorage.getItem("hasShownSplash");

    if (!hasShownSplash) {
        // Show splash screen for the first time
        setTimeout(() => {         
            setIsSplashVisible(false);         
            sessionStorage.setItem("hasShownSplash", "true"); // Set the flag in sessionStorage
        }, 4000);
    } else {
        // Directly hide splash screen if it has been shown before
        setIsSplashVisible(false);
    }
}, []); 

  const router = createBrowserRouter([
    {
      path: '/',
      element: isLoggedIn
              ? <HomePage />
              : user_type === 'logOutUser'
                ? <LoginForm />
                : <Onboarding />,
    },    
    {
      path: '/language',
      element: <Language />,
    },
    {
      path: '/login',
      element: <LoginForm />,
    },
    {
      path: '/signup',
      element: <SignupForm />,
    },
    {
      path: '/homepage',
      element: <HomePage/>,
    },
    {
      path: '/forgotpassword',
      element: <ForgotPasswordForm />,
    },
    {
      path: '/booksbytopic',
      element: <BooksByTopic/>,
    },
    {
      path: '/detailpage/:id',
      element: <Detailpage/>,
    },
    {
      path: '/electronicPublication/:id',
      element: <ElectronicPublication/>,
    },
    {
      path: '/favouritepage',
      element: <FavouritePage/>,
    },
    {
      path: '/freebookpage',
      element: <FreeBookPage/>,
    },
    {
      path:'/Subscription',
      element: <PrivateRoute element={<Subscription/>} />,
    },
    {
      path: '/razerpay',
      element: <PrivateRoute element={<Razerpay />} />,
    },
  ]);

  return (
    <AuthProvider>
      <div className={`${isDarkMode ? "bg-darkModeColor" : "bg-lightModeColor"}`}>
        {isSplashVisible && <SplashScreen imageUrl={logo} duration={4000} bgColor="#0279CA" heading='Pustakam' />}
        {!isSplashVisible && <RouterProvider router={router} />}
      </div>
    </AuthProvider>
  );
}

export default App;
