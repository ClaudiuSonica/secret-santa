import { randomInt } from 'node:crypto';
const MAX_PARTICIPANTS = 100;
const MAX_DETAILS_LENGTH = 500;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SEND_LIMIT = 10;
const SEND_WINDOW_MS = 60 * 60 * 1000;
const recentSends = [];

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function deliveryError(message, logDetails) {
  const error = new Error(message);
  error.statusCode = 502;
  error.logDetails = logDetails;
  return error;
}

function enforceSendLimit() {
  const cutoff = Date.now() - SEND_WINDOW_MS;
  while (recentSends.length && recentSends[0] <= cutoff) recentSends.shift();
  if (recentSends.length >= SEND_LIMIT) {
    const error = new Error('Ai atins limita de trimiteri. Încearcă din nou mai târziu.');
    error.statusCode = 429;
    throw error;
  }
  recentSends.push(Date.now());
}

export function validateParticipants(value) {
  if (!Array.isArray(value) || value.length < 3 || value.length > MAX_PARTICIPANTS) {
    throw validationError(`Adaugă între 3 și ${MAX_PARTICIPANTS} participanți.`);
  }

  const participants = value.map((participant) => {
    if (!participant || typeof participant !== 'object') {
      throw validationError('Fiecare participant are nevoie de un nume și o adresă de email.');
    }

    const name = typeof participant.name === 'string' ? participant.name.trim() : '';
    const email = typeof participant.email === 'string' ? participant.email.trim().toLowerCase() : '';
    const details = typeof participant.details === 'string' ? participant.details.trim() : '';

    if (!name || name.length > 100 || !email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      throw validationError('Verifică numele și adresa de email ale fiecărui participant.');
    }

    if (participant.details !== undefined && typeof participant.details !== 'string') {
      throw validationError('Detaliile participantului trebuie să fie text.');
    }
    if (details.length > MAX_DETAILS_LENGTH) {
      throw validationError(`Detaliile participantului pot avea cel mult ${MAX_DETAILS_LENGTH} de caractere.`);
    }

    return { name, email, details };
  });

  const emails = new Set(participants.map(({ email }) => email));
  if (emails.size !== participants.length) {
    throw validationError('Fiecare participant trebuie să aibă o adresă de email unică.');
  }

  return participants;
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const otherIndex = randomInt(index + 1);
    [result[index], result[otherIndex]] = [result[otherIndex], result[index]];
  }
  return result;
}

export function createMatches(participants) {
  const shuffled = shuffle(participants);
  return shuffled.map((santa, index) => ({
    santa,
    recipient: shuffled[(index + 1) % shuffled.length],
  }));
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function buildEmailHtml(santaName, recipientName, details) {
  const detailsSection = details
    ? `<section style="margin:24px 0 0;padding:18px 20px;border-radius:14px;background:#f7f2e5;text-align:left">
        <p style="margin:0 0 7px;color:#9d6848;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase">Câteva indicii pentru cadou</p>
        <p style="margin:0;color:#385342;font-size:15px;line-height:1.55">${escapeHtml(details).replace(/\r?\n/g, '<br>')}</p>
      </section>`
    : '';

  return `
    <!doctype html>
    <html lang="ro">
      <body style="margin:0;background:#f5f3ed;padding:32px 16px;font-family:Arial,sans-serif;color:#1d332a">
        <main style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e7e5dc;border-radius:20px;padding:36px 32px;text-align:center">
          <p style="margin:0 0 16px;color:#b84739;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">Puțină magie de Crăciun</p>
          <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:34px">Cadoul tău Secret Santa</h1>
          <p style="font-size:17px;line-height:1.6">Bună, ${escapeHtml(santaName)}! Anul acesta vei pregăti o surpriză pentru</p>
          <p style="display:inline-block;margin:8px 0 24px;border-radius:14px;background:#edf3ed;padding:16px 24px;color:#1d503a;font-family:Georgia,serif;font-size:28px;font-weight:bold">${escapeHtml(recipientName)}</p>
          ${detailsSection}
          <p style="font-size:15px;line-height:1.6">Păstrează secretul, alege ceva cu grijă și bucură-te de surpriză.</p>
          <p style="margin:28px 0 0;color:#77796f;font-size:14px">Sărbători fericite! 🎄</p>
        </main>
      </body>
    </html>
  `;
}

export async function sendMatches(value, requestId) {
  const participants = validateParticipants(value);
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL;

  if (!apiKey || !senderEmail || !EMAIL_PATTERN.test(senderEmail)) {
    const error = new Error('Trimiterea emailurilor nu este configurată. Adaugă BREVO_API_KEY și un SENDER_EMAIL valid.');
    error.statusCode = 503;
    throw error;
  }

  if (typeof requestId !== 'string' || !UUID_PATTERN.test(requestId)) {
    throw validationError('Solicitarea pentru extragere nu este validă. Încearcă din nou.');
  }
  enforceSendLimit();

  const matches = createMatches(participants);
  const batch = {
    sender: { email: senderEmail, name: 'Secret Santa' },
    subject: '🎅 Ho, ho, ho! Perechea ta de Secret Santa a sosit',
    headers: { idempotencyKey: requestId },
    htmlContent: '<!doctype html><html lang="ro"><body><p>Vezi mesajul personalizat inclus în această extragere Secret Santa.</p></body></html>',
    messageVersions: matches.map(({ santa, recipient }) => ({
      to: [{ email: santa.email }],
      htmlContent: buildEmailHtml(santa.name, recipient.name, recipient.details),
    })),
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    signal: AbortSignal.timeout(20000),
    body: JSON.stringify(batch),
  });
  const result = await response.json().catch(() => null);

  if (!response.ok && result?.code !== 'duplicate_parameter') {
    const logDetails = `Brevo response status=${response.status} code=${typeof result?.code === 'string' ? result.code : 'unknown'}`;
    if (response.status === 401 && result?.code === 'unauthorized') {
      throw deliveryError('Brevo a blocat acest server deoarece IP-ul lui nu este autorizat. Adaugă IP-ul serverului în lista de IP-uri autorizate din Brevo, apoi încearcă din nou.', logDetails);
    }
    throw deliveryError('Brevo nu a acceptat această extragere. Verifică jurnalul de emailuri tranzacționale înainte de a începe o nouă extragere.', logDetails);
  }

  return { recipientCount: matches.length };
}
