import React from "react";
import logo from "../../Assets/images/pustakam_logo.png";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Language(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "guest",
        email: "guest@gmail.com",
        mobile_no: "0000000000",
        password: "Guest@1",
        confirmPassword: "Guest@1",
        user_type:"guest",
        language: "hindi", // Default language
      });
       // Handle Input Change
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        };
        const handleSubmit = async(e) =>{
        e.preventDefault();

        //create unique userId
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const userId = Array.from({ length: 10 }, () =>
            characters[Math.floor(Math.random() * characters.length)]
        ).join("");
        localStorage.setItem("userId",userId) //set userId in localstorage
        localStorage.setItem("userToken", JSON.stringify({name: "Guest"}));//set userToken in localstorage
        const { name, email, mobile_no, password, language,user_type } = formData;
        localStorage.setItem("userType",user_type)//set userType in localstorage
        const postData = new FormData();
        postData.append("name", name);
        postData.append("mobile_no", mobile_no);
        postData.append("email", email);
        postData.append("password", password);
        postData.append("languages", language);
        postData.append("user_id",userId);
        postData.append("user_type",user_type);
        try {
            const response = await axios.post(
              "https://pustakam.pythonanywhere.com/user_data/",
              postData
            );
      
            if (response.status === 200 || response.status === 201) {
              navigate("/homepage");
            }
          } catch (error) {
            alert("Fetching error")
            console.error("Error while registering user:", error);
          }
          console.log("post",postData)
          navigate("/homepage");
        };
        return(
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
              <h2 className="text-2xl font-poppins font-bold text-center text-gray-700 mb-4">
                  भाषा चुने
              </h2>
              {/* Form Section */}
              <form onSubmit={handleSubmit}>
                  {/* Hindi Option */}
                  <div className="flex items-center mb-6">
                    <input
                      type="radio"
                      name="language"
                      id="hindi"
                      value="hindi"
                      checked={formData.language === "hindi"}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="hindi"
                      className="ml-3 text-lg text-gray-700 font-medium font-bold font-poppins"
                    >
                      हिंदी
                    </label>
                  </div>
                 {/* English Option */}
                  <div className="flex items-center mb-4">
                    <input
                      type="radio"
                      name="language"
                      id="english"
                      value="english"
                      checked={formData.language === "english"}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="english"
                      className="ml-3 text-lg text-gray-700 font-medium font-poppins"
                    >
                      English
                    </label>
                  </div>
                  {/* Submit Button */}
                  <button
                      type="submit"
                      className="w-full bg-mainColor font-poppins hover:bg-blue-600 text-white text-lg font-semibold py-3 rounded-md transition"
                  >
                      submit
                  </button>
              </form>
            </div>
          </div>
          )
    }
export default Language;