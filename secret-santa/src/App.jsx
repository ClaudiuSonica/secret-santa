import React, { useState } from 'react';
import MainSection from './components/organisms/MainSection';
import Snowfall from './components/molecules/Snowfall';
import ParticipantService from './utils/ParticipantService';

function App() {
  const [participants, setParticipants] = useState([]);
  const [matches, setMatches] = useState([]);

  const participantService = new ParticipantService(participants);

  const addParticipant = (participant) => {
    const updatedParticipants = participantService.addParticipant(participant);
    setParticipants(updatedParticipants);
  };

  const removeParticipant = (phone) => {
    const updatedParticipants = participantService.removeParticipant(phone);
    setParticipants(updatedParticipants);
  };

  const generateMatches = () => {
    const shuffled = [...participants].sort(() => 0.5 - Math.random());
    const result = shuffled.map((person, index) => ({
      santa: person,
      recipient: shuffled[(index + 1) % shuffled.length],
    }));
    setMatches(result);
  
    // Send matches to Netlify function
    fetch('/.netlify/functions/send_matches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matches: result }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };  

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center text-white overflow-hidden">
      <Snowfall />
      <MainSection
        participants={participants}
        onAddParticipant={addParticipant}
        onRemoveParticipant={removeParticipant}
        onGenerateMatches={generateMatches}
      />

      {/* Display Matches (for development) */}
      {matches.length > 0 && (
        <div className="mt-8 space-y-4">
          {matches.map(({ santa, recipient }, index) => (
            <div key={index}>
              🎁 {santa.name} ({santa.phone}) will gift {recipient.name} ({recipient.phone}) 🎁
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
