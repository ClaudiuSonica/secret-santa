import React from 'react';
import ListItem from '../atoms/ListItem';

const ParticipantList = ({ participants, onRemoveParticipant }) => {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {participants.map(({ name, email }) => (
        <ListItem key={email} name={name} email={email} onRemove={() => onRemoveParticipant(email)} />
      ))}
    </div>
  );
};

export default ParticipantList;
