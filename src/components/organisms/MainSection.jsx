import React from 'react';
import ParticipantForm from '../molecules/ParticipantForm';
import ParticipantList from '../organisms/ParticipantList';
import MatchGenerator from '../organisms/MatchGenerator';

const MainSection = ({ participants, onAddParticipant, onRemoveParticipant, onGenerateMatches }) => {
  return (
    <div className="relative z-10 bg-white/20 backdrop-blur-lg p-10 rounded-lg shadow-xl text-center">
      <h1 className="text-3xl sm:text-5xl font-bold text-red-400 mb-4" style={{ fontFamily: 'Pacifico, cursive' }}>
        🎄 Secret Santa 🎅
      </h1>
      <p className="text-lg text-gray-300 mb-6">
        Enter the names of participants and find out who’s gifting whom!
      </p>

      <ParticipantForm onAddParticipant={onAddParticipant} />
      <ParticipantList participants={participants} onRemoveParticipant={onRemoveParticipant} />
      <MatchGenerator participants={participants} onGenerateMatches={onGenerateMatches} />
    </div>
  );
};

export default MainSection;
