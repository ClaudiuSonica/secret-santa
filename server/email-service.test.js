import assert from 'node:assert/strict';
import test from 'node:test';
import { createMatches, sendMatches, validateParticipants } from './email-service.js';

function participants(count) {
  return Array.from({ length: count }, (_, index) => ({
    name: `Participant ${index + 1}`,
    email: `participant-${index + 1}@example.test`,
  }));
}

function assertValidDraw(draw, sourceParticipants) {
  assert.equal(draw.length, sourceParticipants.length);

  const participantEmails = new Set(sourceParticipants.map(({ email }) => email));
  const santaEmails = draw.map(({ santa }) => santa.email);
  const recipientEmails = draw.map(({ recipient }) => recipient.email);

  assert.equal(new Set(santaEmails).size, sourceParticipants.length, 'each participant is a Santa exactly once');
  assert.equal(new Set(recipientEmails).size, sourceParticipants.length, 'each participant is a recipient exactly once');
  assert.deepEqual(new Set(santaEmails), participantEmails);
  assert.deepEqual(new Set(recipientEmails), participantEmails);

  for (const { santa, recipient } of draw) {
    assert.notEqual(santa.email, recipient.email, 'a participant cannot match themselves');
  }
}

for (const count of [3, 4, 100]) {
  test(`createMatches produces a valid one-to-one draw for ${count} participants`, () => {
    const sourceParticipants = participants(count);

    for (let attempt = 0; attempt < 100; attempt += 1) {
      assertValidDraw(createMatches(sourceParticipants), sourceParticipants);
    }
  });
}

test('validateParticipants preserves optional details and rejects invalid details', () => {
  const validated = validateParticipants([
    { name: 'Ana', email: 'ana@example.test', details: 'Îi place ceaiul verde.' },
    { name: 'Bogdan', email: 'bogdan@example.test' },
    { name: 'Carmen', email: 'carmen@example.test', details: '   ' },
  ]);

  assert.equal(validated[0].details, 'Îi place ceaiul verde.');
  assert.equal(validated[1].details, '');
  assert.equal(validated[2].details, '');
  assert.throws(
    () => validateParticipants([...participants(2), { name: 'Detalii', email: 'detalii@example.test', details: 'x'.repeat(501) }]),
    /cel mult 500 de caractere/,
  );
});

test('sendMatches places each matched recipient details in that Santa email', async () => {
  const sourceParticipants = [
    { name: 'Ana', email: 'ana@example.test', details: 'Iubește ceaiul <verde> & cărțile.\nPreferă surprize utile.' },
    { name: 'Bogdan', email: 'bogdan@example.test', details: 'Colecționează jocuri de societate.' },
    { name: 'Ana', email: 'carmen@example.test', details: 'Îi plac lumânările parfumate.' },
  ];
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.BREVO_API_KEY;
  const originalSenderEmail = process.env.SENDER_EMAIL;
  let capturedBatch;

  process.env.BREVO_API_KEY = 'test-api-key';
  process.env.SENDER_EMAIL = 'sender@example.test';
  globalThis.fetch = async (_url, options) => {
    capturedBatch = JSON.parse(options.body);
    return new Response(JSON.stringify({ messageIds: ['one', 'two', 'three'] }), { status: 201 });
  };

  try {
    await sendMatches(sourceParticipants, '75edc5dc-d8d1-4b18-bb71-6a10d314b3fb');
  } finally {
    globalThis.fetch = originalFetch;
    if (originalApiKey === undefined) delete process.env.BREVO_API_KEY;
    else process.env.BREVO_API_KEY = originalApiKey;
    if (originalSenderEmail === undefined) delete process.env.SENDER_EMAIL;
    else process.env.SENDER_EMAIL = originalSenderEmail;
  }

  assert.equal(capturedBatch.messageVersions.length, sourceParticipants.length);
  const recipientEmails = new Set();

  for (const version of capturedBatch.messageVersions) {
    const santaEmail = version.to[0].email;
    const santa = sourceParticipants.find(({ email }) => email === santaEmail);
    const recipient = sourceParticipants.find(({ details }) => {
      const escapedDetails = details.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replace(/\r?\n/g, '<br>');
      return version.htmlContent.includes(escapedDetails);
    });

    assert.ok(santa, 'each email is addressed to a participant in the draw');
    assert.ok(recipient, 'each email contains one participant’s uniquely identifiable details');
    assert.notEqual(santaEmail, recipient.email, 'the email sender is not their own recipient');
    assert.ok(version.htmlContent.includes(`Bună, ${santa.name}!`));
    assert.ok(version.htmlContent.includes(`>${recipient.name}</p>`));
    assert.ok(version.htmlContent.includes('<section style='), 'details are sent as part of the email HTML, not as an HTML-valued parameter');
    assert.ok(!version.params, 'the personalized body does not use escaped Brevo template params');
    recipientEmails.add(recipient.email);
  }

  assert.deepEqual(recipientEmails, new Set(sourceParticipants.map(({ email }) => email)));
});
