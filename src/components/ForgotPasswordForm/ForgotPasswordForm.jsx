import React, { useState } from "react";
import axios from "axios";
import logo from "../../Assets/images/pustakam_logo.png";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      // Fetch user data from the API
      const userDataResponse = await axios.get(
        "https://pustakam.pythonanywhere.com/user_data/"
      );

      const users = userDataResponse.data.data;

      // Check if the email exists
      const user = users.find((user) => user.email === email);

      if (!user) {
        setErrorMessage("Please enter a registered email.");
        setTimeout(() => setErrorMessage(""), 3000); // Clear after 3 seconds
        setIsLoading(false); // Stop loading
        return;
      }

      // If email exists, proceed to send it to forgot_password API
      const forgotPasswordResponse = await axios.post(
        "https://pustakam.pythonanywhere.com/forgot_password/",
        { email } // Send email in the request body
      );

      if (forgotPasswordResponse.status === 200 || forgotPasswordResponse.status === 201) {
        setSuccessMessage("A password reset link has been sent to your email.");
        setErrorMessage(""); // Clear error message
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/login");
        }, 3000); // Redirect to login after 3 seconds
      }
    } catch (error) {
      console.error("Error during forgot password request:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to process the request. Please try again."
      );
      setTimeout(() => setErrorMessage(""), 3000); // Clear error after 3 seconds
    }finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
      {/* Form Card */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        {/* Logo/Image Section */}
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="Logo"
            className="w-36 h-36 bg-mainColor"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-poppins font-bold text-center text-gray-700 mb-6">
        पासवर्ड भूल गए ?
        </h2>

        {/* Form Section */}
        <form onSubmit={handleForgotPassword}>
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
              placeholder="अपना पंजीकृत ईमेल दर्ज करें"
              className="w-full px-4 py-3 border font-poppins rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-mainColor"
              required
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-base font-poppins mb-4 text-center">
              {errorMessage}
            </p>
          )}

          {/* Success Message */}
          {successMessage && (
            <p className="text-green-500 text-base font-poppins mb-4 text-center">
              {successMessage}
            </p>
          )}

          {/* Loading Spinner or Submit Button */}
          {isLoading ? (
            <div className="flex justify-center">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-mainColor"></div>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full bg-mainColor font-poppins hover:bg-blue-600 text-white text-lg font-semibold py-3 px-4 rounded-md transition"
            >
              लिंक भेजें
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
