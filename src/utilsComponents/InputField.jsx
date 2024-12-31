// src/components/InputField.js
import React from 'react';

const InputField = ({ label, type, name, value, onChange, placeholder, required }) => {
  return (
    <div className="mb-4 w-full">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default InputField;
