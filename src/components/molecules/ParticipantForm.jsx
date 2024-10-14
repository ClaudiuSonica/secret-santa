import React, { useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

const ParticipantForm = ({ onAddParticipant }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddParticipant = () => {
    if (name && phone) {
      onAddParticipant({ name, phone }); // Pass an object with name and phone
      setName('');  // Clear name input
      setPhone(''); // Clear phone input
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
        placeholder="Enter participant's phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Button className='bg-gray-100 text-gray-700 hover:bg-gray-300' onClick={handleAddParticipant}>Add Participant</Button>
    </div>
  );
};

export default ParticipantForm;
