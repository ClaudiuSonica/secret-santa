import { FiX } from 'react-icons/fi';

const ParticipantList = ({ isSending, participants, onRemoveParticipant }) => {
  if (!participants.length) return null;

  return (
    <ul className="participant-list" aria-label="Participanți">
      {participants.map(({ name, email, details }, index) => (
        <li className="participant-row" key={email}>
          <span className="participant-avatar" aria-hidden="true">{name.trim().charAt(0).toUpperCase()}</span>
          <span className="participant-details"><strong>{name}</strong><span>{email}</span>{details && <small>Detalii: {details}</small>}</span>
          <span className="participant-number">{String(index + 1).padStart(2, '0')}</span>
          <button className="remove-button" type="button" onClick={() => onRemoveParticipant(email)} aria-label={`Elimină ${name}`} disabled={isSending}>
            <FiX aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ParticipantList;
