import { useRef, useState } from 'react';
import MainSection from './components/organisms/MainSection';
import ParticipantService from './utils/ParticipantService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [participants, setParticipants] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const requestId = useRef(null);
  const participantService = new ParticipantService(participants);

  const addParticipant = (participant) => {
    const updatedParticipants = participantService.addParticipant(participant);
    if (updatedParticipants === participants) {
      toast.error('Această adresă de email este deja în listă.');
      return false;
    }
    setParticipants(updatedParticipants);
    setHasSent(false);
    setSuccessMessage('');
    requestId.current = null;
    return true;
  };

  const removeParticipant = (email) => {
    setParticipants(participantService.removeParticipant(email));
    setHasSent(false);
    setSuccessMessage('');
    requestId.current = null;
  };

  const generateMatches = async () => {
    if (isSending || participants.length < 3) return;

    setIsSending(true);
    setHasSent(false);
    setSuccessMessage('');
    try {
      requestId.current ||= crypto.randomUUID();
      const response = await fetch('/api/send-matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants, requestId: requestId.current }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Trimiterea emailurilor a eșuat. Încearcă din nou.');

      setParticipants([]);
      setHasSent(true);
      setSuccessMessage(data.message || 'Emailurile Secret Santa sunt pe drum!');
      requestId.current = null;
      toast.success(data.message || 'Emailurile au fost trimise.');
    } catch (error) {
      toast.error(error.message || 'Trimiterea emailurilor a eșuat. Încearcă din nou.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <MainSection
        participants={participants}
        isSending={isSending}
        hasSent={hasSent}
        successMessage={successMessage}
        onAddParticipant={addParticipant}
        onRemoveParticipant={removeParticipant}
        onGenerateMatches={generateMatches}
      />
      <ToastContainer
        position="top-center"
        autoClose={4500}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
