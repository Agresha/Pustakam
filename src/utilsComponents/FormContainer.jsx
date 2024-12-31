// src/components/FormContainer.js
import React from 'react';

const FormContainer = ({ children }) => {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      {children}
    </div>
  );
};

export default FormContainer;
