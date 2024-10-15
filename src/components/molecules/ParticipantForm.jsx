import React, { useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

const ParticipantForm = ({ onAddParticipant }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleAddParticipant = () => {
    if (name && email) {
      onAddParticipant({ name, email }); // Pass an object with name and phone
      setName('');  // Clear name input
      setEmail(''); // Clear email input
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Input
        placeholder="Enter participant's name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Enter participant's email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button className='bg-gray-100 text-gray-700 hover:bg-gray-300' onClick={handleAddParticipant}>Add Participant</Button>
    </div>
  );
};

export default ParticipantForm;
