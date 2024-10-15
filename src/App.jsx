import React, { useState } from 'react';
import MainSection from './components/organisms/MainSection';
import Snowfall from './components/molecules/Snowfall';
import ParticipantService from './utils/ParticipantService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [participants, setParticipants] = useState([]);
  const [matches, setMatches] = useState([]);

  const participantService = new ParticipantService(participants);

  const addParticipant = (participant) => {
    const updatedParticipants = participantService.addParticipant(participant);
    setParticipants(updatedParticipants);
  };

  const removeParticipant = (email) => {
    const updatedParticipants = participantService.removeParticipant(email);
    setParticipants(updatedParticipants);
  };

  // Send matches to Netlify function
  const generateMatches = () => {
    const shuffled = [...participants].sort(() => 0.5 - Math.random());
    const result = shuffled.map((person, index) => ({
      santa: person,
      recipient: shuffled[(index + 1) % shuffled.length],
    }));
    setMatches(result);

    const baseUrl = window.location.origin;  // Dynamically get the current origin
    const functionUrl = `${baseUrl}/.netlify/functions/send_matches`;

    fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matches: result }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode !== 200) {
          toast.error(data.message);  // Display error message as toast
          return;
        } 
        toast.success(data.message);  // Display success message as toast
        setParticipants([]);  // Clear participants after successful match generation
      })
      .catch((error) => {
        const errorMessage = error.message || 'Ups! Ceva nu a mers bine... Te rugăm să încerci din nou.';  // Use custom error message if available
        toast.error(errorMessage);  // Display error message as toast
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
