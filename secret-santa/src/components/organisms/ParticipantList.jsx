import React from 'react';
import ListItem from '../atoms/ListItem';

const ParticipantList = ({ participants, onRemoveParticipant }) => {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {participants.map(({ name, phone }) => (
        <ListItem key={phone} name={name} phone={phone} onRemove={() => onRemoveParticipant(phone)} />
      ))}
    </div>
  );
};

export default ParticipantList;
