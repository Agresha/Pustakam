import React, { useState } from "react";
import axios from "axios";
import { FiCamera } from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for show/hide password
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
  const { signup } = useAuth();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, mobile_no, password, confirmPassword, image } = formData;

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile_no)) {
      setErrorMessage("Enter a valid 10-digit mobile number.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must be at least 6 characters long and include one uppercase, one lowercase, one digit, and one special character."
      );
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const patchData = new FormData();
    patchData.append("name", name);
    patchData.append("mobile_no", mobile_no);
    patchData.append("email", email);
    patchData.append("password", password);
    if (image instanceof File) {
      patchData.append("image", image);
    }
    patchData.append("user_type", "user");

    try {
      const response = await axios.patch(
        `https://pustakam.pythonanywhere.com/user_data/${userId}/`,
        patchData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        const user = JSON.stringify({ email: email, name: name });
        signup(user);
        setSuccessMessage("Signup successful!");
        navigate("/homepage");
      }
    } catch (error) {
      console.error("Error while registering user:", error);
      setErrorMessage("Failed to register user. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        {/* Profile Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            {formData.image ? (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-full"
              />
            ) : (
              <span className="text-5xl text-gray-500">👤</span>
            )}
            <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer">
              <FiCamera className="text-white w-4 h-4" />
              <input
                type="file"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <h2 className="text-3xl font-poppins font-bold text-center text-gray-700 mb-6">
          साइन अप करें
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="नाम दर्ज करें"
              className="w-full px-4 py-3 border font-poppins rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-mainColor"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ईमेल दर्ज करें"
              className="w-full px-4 py-3 font-poppins border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-mainColor"
              required
            />
          </div>

          {/* Mobile */}
          <div className="mb-4">
            <input
              type="tel"
              name="mobile_no"
              value={formData.mobile_no}
              onChange={handleChange}
              placeholder="मोबाइल नंबर दर्ज करें"
              className="w-full px-4 py-3 font-poppins border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-mainColor"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="पासवर्ड दर्ज करें"
              className="w-full px-4 py-3 font-poppins border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-mainColor"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="mb-6 relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="पासवर्ड की पुष्टि करें"
              className="w-full px-4 py-3 font-poppins border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-mainColor"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-center mb-4">{successMessage}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-mainColor font-poppins hover:bg-blue-600 text-white text-lg font-semibold py-3 rounded-md transition"
          >
            साइन अप करें
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center font-poppins text-gray-700 mt-6">
          पहले से ही खाते में है?{" "}
          <NavLink
            to="/login"
            className="text-mainColor font-poppins hover:underline"
          >
            लॉग इन करें
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
