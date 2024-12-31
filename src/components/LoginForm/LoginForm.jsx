import React, { useState,useEffect } from "react";
import axios from "axios";
import logo from "../../Assets/images/pustakam_logo.png";
// import { useAuth } from "../../AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for show/hide password
import { NavLink, useNavigate } from "react-router-dom";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate()
  // const { guestLogin } = useAuth();
  useEffect(() => {
    const userSession = localStorage.getItem("userToken");
    if (userSession) {
      navigate("/homepage"); // Redirect to homepage if already logged in
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Fetch user data from the API
      const response = await axios.get(
        "https://pustakam.pythonanywhere.com/user_data/"
      );
      const users = response.data.data;
  
      // Password validation regex
    const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    // Password format validation
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must be at least 6 characters long and include one uppercase, one lowercase, one digit, and one special character."
      );
      setTimeout(() => setErrorMessage(""), 3000); // Clear after 3 seconds
      return;
    }

      // Find matching user
      const user = users.find(
        (user) => user.email === email && user.password === password
      );
  
      if (user) {
        // Save login session to localStorage
        localStorage.setItem("userToken", JSON.stringify({ email: user.email, name: user.name }));
        localStorage.setItem("userId",user.user_id)
        alert(`Welcome, ${user.name}!`);
        window.location.reload();
        setTimeout(() => {
          navigate("/homepage");
      }, 1000); // Redirect to homepage
      } else {
        setErrorMessage("Invalid email or password.");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to connect to the server. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  
  };
  // const handleGuestLogin = () => {
  //   let user=JSON.stringify({name: "Guest"});
  //   guestLogin(user);
  //   window.location.reload();
  //   setTimeout(() => {
  //     navigate("/homepage");
  //   }, 1000); // Redirect to homepage
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
      {/* Form Card */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        {/* Logo/Image Section */}
        <div className="flex justify-center mb-8">
          <img
            src={logo} // Replace with actual logo URL
            alt="Logo"
            className="w-36 h-36 bg-mainColor"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-poppins font-bold text-center text-gray-700 mb-6">
        लॉग इन करें
        </h2>

        {/* Form Section */}
        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 text-lg font-poppins font-medium mb-2"
            >
              ईमेल
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ईमेल दर्ज करें"
              className="w-full px-4 py-3 border font-poppins rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-mainColor"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 font-poppins text-lg font-medium mb-2"
            >
              पासवर्ड
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="पासवर्ड दर्ज करें"
              className="w-full px-4 py-3 font-poppins border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-mainColor"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-2/3 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-base font-poppins mb-4 text-center">
              {errorMessage}
            </p>
          )}
          <p className="text-end font-poppins">
          पासवर्ड भूल गए?{" "}
            <NavLink to="/forgotpassword" className="text-mainColor font-poppins hover:underline">
            यहाँ क्लिक करें
            </NavLink>
          </p>
          <p className="mt-5 text-center font-poppins mb-5">
            <a href="#" className="text-mainColor hover:underline">
            उपयोग की शर्तें
            </a>{" "}
            &{" "}
            <a href="#" className="text-mainColor hover:underline">
            गोपनीयता नीति
            </a>
          </p>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-mainColor font-poppins hover:bg-blue-600 text-white text-lg font-semibold py-3 px-4 rounded-md transition"
          >
            लॉग इन करें
          </button>
        </form>

        {/* Signup and Policy Section */}
        <div className="text-center mt-6 font-poppins text-gray-700 text-base">
        {/* <p className="mt-3">
        लॉगिन करें{" "}
            <NavLink to='/homepage' onClick={handleGuestLogin} className="text-mainColor hover:underline">
            अतिथि ?
            </NavLink>
          </p> */}
          <p className="mt-3">
          नया खाता?{" "}
            <NavLink to='/signup' className="text-mainColor hover:underline">
            साइन अप करें
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
