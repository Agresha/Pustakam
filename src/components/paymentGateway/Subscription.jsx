import React, { useState, useEffect, useContext } from 'react';

import { ThemeContext } from "../ThemeProvider/themeprovider"; 

const Subscription = () => {
  const { isDarkMode } = useContext(ThemeContext); // Get dark mode value from context
  
  const [user, setUser] = useState({
    name: "",
    email: "",
    contact: "",
  });

  // Load Razorpay SDK dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay SDK Loaded');
    };
    document.body.appendChild(script);

    // Simulate fetching user details (replace with actual API call)
    const fetchUserDetails = async () => {
      const loggedInUser = {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9876543210",
      };
      setUser(loggedInUser);
    };

    fetchUserDetails();
  }, []);

  const handlePayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK is not loaded yet!");
      return;
    }

    const options = {
      key: "rzp_test_Ie5WFjNmrwbK72", 
      amount: 50000, 
      currency: "INR",
      name: "pustakam",
      description: "Test Transaction",
      image: "https://pustakam.pythonanywhere.com//image/finalLogo_EsgIfwU.jpeg",
      handler: (response) => {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.contact,
      },
      notes: {
        address: "Customer's address",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const plans = [
    {
      name: "Monthly",
      price: "FREE",
      description: [
        "20 products",
        "Revenue up to $150.00",
        "8% transaction fee",
      ],
    },
    {
      name: "Yearly",
      price: "$10.00 / month",
      description: [
        "50 products",
        "Revenue up to $500.00",
        "4% transaction fee",
      ],  
      bestChoice: true,
    },
    {
      name: "Lifetime",
      price: "$20.00 / month",
      description: [
        "200 products",
        "Revenue up to $1,000.00",
        "2% transaction fee",
      ]
    },
  ];

  return (
    <div
      className={`subscription-container  ${
        isDarkMode ? "bg-gray-900 text-white h-screen" : "text-gray-900"
      }`}
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <div className="plans text-center text-3xl p-8 font-bold mb-6">
        Choose Your Plan
      </div>

      <div
        className={`subscription-cards ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        } p-6  `}
        style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}
      >
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`subscription-card p-6  shadow-md transition-all transform ${
              isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
            } ${plan.bestChoice ? "border-2 border-yellow-400" : "border"}`}
            style={{
              position: 'relative',
              width: '250px',
              textAlign: 'center',
              transition: 'all 0.3s ease-in-out', // Smooth transition effect
            }}
          >
            {plan.bestChoice && (
              <div
                className={`badge absolute top-0 right-0 p-2 text-xs font-bold rounded ${
                  isDarkMode ? "bg-yellow-500 text-gray-900" : "bg-yellow-400 text-gray-900"
                }`}
              >
                BEST CHOICE
              </div>
            )}
            <h3 className="text-xl font-semibold mb-3">{plan.name}</h3>
            <p className="price text-lg font-bold mb-4">{plan.price}</p>
            <ul className="mb-4 list-none px-0">
              {plan.description.map((item, i) => (
                <li key={i} className="text-sm mb-2">{item}</li>
              ))}
            </ul>
            <button onClick={handlePayment} style={styles.button}
              className={`py-2 px-6 rounded font-semibold transition-all ${
                isDarkMode
                  ? "bg-white text-gray-900"
                  : "bg-mainColor text-white"
              }`}
            >
              Choose
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Inline styles for button
const styles = {
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  }
};

export default Subscription;
