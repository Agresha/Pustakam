// src/components/GuestForm.js
import React from 'react';
import Button from '../../utilsComponents/Button';
import FormContainer from '../../utilsComponents/FormContainer';

const GuestForm = () => {
  const handleGuestLogin = () => {
    // Handle guest login
    console.log('Logged in as guest');
  };

  return (
    <FormContainer>
      <h2 className="text-2xl font-semibold text-center mb-6">Continue as Guest</h2>
      <Button text="Proceed as Guest" onClick={handleGuestLogin} />
    </FormContainer>
  );
};

export default GuestForm;
