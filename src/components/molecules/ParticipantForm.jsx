import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';

const ParticipantForm = ({ isSending, onAddParticipant }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanDetails = details.trim();

    if (!cleanName || !cleanEmail) {
      setError({
        field: !cleanName && !cleanEmail ? 'both' : (!cleanName ? 'name' : 'email'),
        message: !cleanName && !cleanEmail
          ? 'Completează numele și adresa de email.'
          : (!cleanName ? 'Completează numele participantului.' : 'Completează adresa de email.'),
      });
      return;
    }
    if (cleanName.length > 100) {
      setError({ field: 'name', message: 'Numele poate avea cel mult 100 de caractere.' });
      return;
    }
    if (cleanEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError({ field: 'email', message: 'Introdu o adresă de email validă.' });
      return;
    }
    if (cleanDetails.length > 500) {
      setError({ field: 'details', message: 'Detaliile pot avea cel mult 500 de caractere.' });
      return;
    }

    if (onAddParticipant({ name: cleanName, email: cleanEmail, details: cleanDetails })) {
      setName('');
      setEmail('');
      setDetails('');
      setError(null);
    }
  };

  return (
    <form className="participant-form" onSubmit={handleSubmit} noValidate>
      <div className="field-group">
        <label htmlFor="participant-name">Nume</label>
        <input
          id="participant-name"
          name="name"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          maxLength={100}
          placeholder="ex. Andrei Popescu"
          value={name}
          disabled={isSending}
          onChange={(event) => { setName(event.target.value); setError(null); }}
          aria-invalid={error?.field === 'name' || error?.field === 'both'}
          aria-describedby={error?.field === 'name' || error?.field === 'both' ? 'form-error' : undefined}
        />
      </div>
      <div className="field-group">
        <label htmlFor="participant-email">Adresă de email</label>
        <input
          id="participant-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={254}
          placeholder="alex@example.com"
          value={email}
          disabled={isSending}
          onChange={(event) => { setEmail(event.target.value); setError(null); }}
          aria-invalid={error?.field === 'email' || error?.field === 'both'}
          aria-describedby={error?.field === 'email' || error?.field === 'both' ? 'form-error' : undefined}
        />
      </div>
      <div className="field-group details-field">
        <div className="field-label-row">
          <label htmlFor="participant-details">Detalii pentru cadou <span>opțional</span></label>
          <span aria-hidden="true">{details.length}/500</span>
        </div>
        <textarea
          id="participant-details"
          name="details"
          rows={3}
          maxLength={500}
          placeholder="ex. preferă ceaiul verde, poartă mărimea M, îi place să citească…"
          value={details}
          disabled={isSending}
          onChange={(event) => { setDetails(event.target.value); setError(null); }}
          aria-invalid={error?.field === 'details'}
          aria-describedby={`details-help${error?.field === 'details' ? ' form-error' : ''}`}
        />
        <small id="details-help">Aceste detalii ajung doar în emailul persoanei care îl extrage pe acest participant.</small>
      </div>
      <button className="add-button" type="submit" aria-label="Adaugă participant" disabled={isSending}><FiPlus aria-hidden="true" /><span>Adaugă</span></button>
      {error && <p className="form-error" id="form-error" role="alert">{error.message}</p>}
    </form>
  );
};

export default ParticipantForm;
