import React, { useState, useEffect } from "react";
import axios from "axios";

const ResetPassword = () => {
  const [userId, setUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSetPassword, setPassword] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Extract the user ID from URL parameters and verify link expiration
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("user_id");
    setUserId(id);
  
    if (id) {
      // Fetch user data from API
      axios
        .get(`https://pustakam.pythonanywhere.com/user_data/${id}/`)
        .then((response) => {
          if (response.status === 200) {
            // Parse expiration time from API
            const passwordTime = new Date(response.data.data.password_time); // Ensure this is ISO format
            const currentTime = new Date();
  
            console.log("Current Time (ISO):", currentTime.toISOString());
            console.log("Password Expiry Time (ISO):", passwordTime.toISOString());
  
            // Check if current time is after the expiration time
            if (currentTime.getTime() > passwordTime.getTime()) {
              setIsExpired(true);
              setErrorMessage("❌ This reset link has expired.");
            } else {
              setIsExpired(false);
            }
          } else {
            setErrorMessage("❌ Unable to fetch user data.");
          }
        })
        .catch(() => setErrorMessage("❌ An error occurred while fetching user data."));
    }
  }, []);
  
  // Handle password reset form submission
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (isExpired) {
      setErrorMessage("❌ The link has expired. Please request a new link.");
      return;
    }

    if (isSetPassword) {
      setErrorMessage("❌ You have already changed the password.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("❌ Passwords do not match. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (!userId) {
      setErrorMessage("❌ User data not found. Please try again.");
      return;
    }

    try {
      const response = await axios.patch(
        `https://pustakam.pythonanywhere.com/user_data/${userId}/`,
        { password: newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 && response.data.status === "success") {
        setPassword(true);
        setSuccessMessage("✅ Password reset successful!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setErrorMessage("");
      } else {
        setErrorMessage("❌ Something went wrong. Please try again.");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (error) {
      setErrorMessage("❌ An error occurred. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-mainColor px-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-poppins font-bold text-center text-gray-700 mb-6">
          पासवर्ड रीसेट करें
        </h2>

        {isExpired ? (
          <p className="text-red-500 text-lg font-poppins text-center">
            {errorMessage}
          </p>
        ) : (
          <>
            <p className="text-center mb-4">
              {userId
                ? `Resetting password for User ID: ${userId}`
                : "No User ID provided."}
            </p>

            <form onSubmit={handleResetPassword}>
              <div className="mb-6">
                <label
                  htmlFor="newPassword"
                  className="block text-gray-700 text-lg font-poppins font-medium mb-2"
                >
                  नया पासवर्ड
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="अपना नया पासवर्ड दर्ज करें"
                  className="w-full px-4 py-3 border font-poppins rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-mainColor"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 text-lg font-poppins font-medium mb-2"
                >
                  पासवर्ड की पुष्टि करें
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="अपना पासवर्ड फिर से दर्ज करें"
                  className="w-full px-4 py-3 border font-poppins rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-mainColor"
                  required
                />
              </div>

              {errorMessage && (
                <p className="text-red-500 text-base font-poppins mb-4 text-center">
                  {errorMessage}
                </p>
              )}

              {successMessage && (
                <p className="text-green-500 text-base font-poppins mb-4 text-center">
                  {successMessage}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-mainColor font-poppins hover:bg-blue-600 text-white text-lg font-semibold py-3 px-4 rounded-md transition"
              >
                पासवर्ड रीसेट करें
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
