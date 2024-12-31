// src/components/Button.js
import React from 'react';

const Button = ({ text, onClick, type = 'button', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 px-4 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {text}
    </button>
  );
};

export default Button;
