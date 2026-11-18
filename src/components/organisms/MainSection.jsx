import { FiArrowDown, FiGift, FiLock, FiMail, FiStar } from 'react-icons/fi';
import ParticipantForm from '../molecules/ParticipantForm';
import ParticipantList from './ParticipantList';
import MatchGenerator from './MatchGenerator';

const MainSection = ({ participants, isSending, hasSent, successMessage, onAddParticipant, onRemoveParticipant, onGenerateMatches }) => (
  <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Acasă Secret Santa">
        <span className="brand-mark"><FiGift aria-hidden="true" /></span>
        <span>Secret <strong>Santa</strong></span>
      </a>
      <span className="topbar-note"><span className="status-dot" /> Magia sărbătorilor</span>
    </header>

    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow"><FiStar aria-hidden="true" /> FĂRĂ LISTE, DOAR SURPRIZE</div>
        <h1 id="hero-title">Darurile sunt mai frumoase<br />când rămân <span>secrete.</span></h1>
        <p className="hero-description">Adaugă oamenii dragi, iar noi facem extragerea. Fiecare primește pe email doar numele persoanei pentru care pregătește un dar.</p>
        <div className="hero-note"><FiLock aria-hidden="true" /><span>Potrivirile rămân private, exact cum trebuie.</span></div>
        <a href="#participants" className="text-link">Începe extragerea <FiArrowDown aria-hidden="true" /></a>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="snow-glow" />
        <div className="art-star star-one">✦</div><div className="art-star star-two">✦</div><div className="art-star star-three">✦</div>
        <div className="tree"><span className="tree-star">★</span><span className="tree-garland" /></div>
        <div className="gift gift-large"><span className="gift-ribbon" /><span className="gift-bow" /></div>
        <div className="gift gift-small"><span className="gift-ribbon" /><span className="gift-bow" /></div>
        <div className="art-caption">pentru cineva<br />drag ție</div>
      </div>
    </section>

    <section className="organizer-card" id="participants" aria-labelledby="list-title">
      <div className="card-heading">
        <div>
          <div className="eyebrow section-eyebrow">CERCUL TĂU DE CRĂCIUN</div>
          <h2 id="list-title">Cine participă?</h2>
          <p>Adaugă cel puțin 3 persoane pentru a începe extragerea.</p>
        </div>
        <div className="participant-count" aria-live="polite">
          <span className="count-number">{participants.length.toString().padStart(2, '0')}</span>
          <span className="count-label">{participants.length === 1 ? 'persoană' : 'persoane'}</span>
        </div>
      </div>

      <ParticipantForm isSending={isSending} onAddParticipant={onAddParticipant} />
      <ParticipantList isSending={isSending} participants={participants} onRemoveParticipant={onRemoveParticipant} />

      {participants.length === 0 && !hasSent && (
        <div className="empty-state">
          <div className="empty-icon"><FiMail aria-hidden="true" /></div>
          <div><strong>Lista ta începe aici</strong><span>Fiecare persoană va primi pe email propria extragere.</span></div>
        </div>
      )}

      {hasSent && (
        <div className="success-state" role="status">
          <span className="success-icon">✓</span>
          <span><strong>{successMessage}</strong><small>Verifică inboxurile pentru puțină magie de Crăciun.</small></span>
        </div>
      )}

      <div className="card-footer">
        <div className="privacy-note"><FiLock aria-hidden="true" /><span>La trimitere, Brevo expediază emailuri reale către toți participanții.</span></div>
        <MatchGenerator participants={participants} isSending={isSending} onGenerateMatches={onGenerateMatches} />
      </div>
    </section>

    <footer className="page-footer">PENTRU BUCURIA DE A DĂRUI <span>✦</span> PĂSTREAZĂ SECRETUL</footer>
  </main>
);

export default MainSection;
