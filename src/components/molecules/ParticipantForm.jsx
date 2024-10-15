import React, { useState, useEffect } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

const ParticipantForm = ({ onAddParticipant }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');  // State for email validation error

  // Function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Basic email format regex
    return emailRegex.test(email);
  };

  // Real-time validation for email input
  useEffect(() => {
    if (email && !isValidEmail(email)) {
      setEmailError('Email-ul introdus nu este valid!');
    } else {
      setEmailError('');
    }
  }, [email]);

  const handleAddParticipant = () => {
    if (!name || !email) {
      setEmailError('Numele și email-ul sunt obligatorii!'); // Set error if fields are empty
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('Email-ul introdus nu este valid!');
      return;
    }

    // Clear error and add participant
    onAddParticipant({ name, email });
    setName('');
    setEmail('');
    setEmailError('');  // Reset error message after successful add
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-sm sm:max-w-md mx-auto px-4">
      <div className="w-full">
        <Input
          placeholder="Enter participant's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="w-full">
        <Input
          placeholder="Enter participant's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 ${emailError ? 'border-red-500' : ''}`}
        />
        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
      </div>

      <Button className="bg-indigo-600 text-white py-2 px-4 rounded-md w-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        Add Participant
      </Button>
    </div>
  );
};

export default ParticipantForm;
