import { FiArrowRight, FiLoader, FiMail } from 'react-icons/fi';

const MatchGenerator = ({ participants, isSending, onGenerateMatches }) => {
  const ready = participants.length >= 3;

  return (
    <div className="send-action">
      {!ready && <span className="minimum-note">Mai adaugă {3 - participants.length} {3 - participants.length === 1 ? 'persoană' : 'persoane'} pentru extragere</span>}
      <button className="send-button" type="button" onClick={onGenerateMatches} disabled={!ready || isSending}>
        {isSending ? <><FiLoader className="spin" aria-hidden="true" /> Se trimit emailurile…</> : <><FiMail aria-hidden="true" /> Trimite extragerea <FiArrowRight className="button-arrow" aria-hidden="true" /></>}
      </button>
    </div>
  );
};

export default MatchGenerator;
