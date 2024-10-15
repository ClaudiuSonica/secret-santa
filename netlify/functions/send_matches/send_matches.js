import { Vonage } from '@vonage/server-sdk';

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET
});

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const matches = body.matches;

    // Create an array of promises for each SMS message
    const smsPromises = matches.map(({ santa, recipient }) => {
      const message = `Hey ${santa.name}, you will be gifting ${recipient.name} this year! 🎁`;

      return new Promise((resolve, reject) => {
        vonage.sms.send(
          { to: santa.phone, from: 'VonageAPI', text: message },
          (err, responseData) => {
            if (err) {
              reject(err);
            } else {
              resolve(responseData);
            }
          }
        );
      });
    });

    // Wait for all SMS messages to be sent concurrently
    const results = await Promise.all(smsPromises);

    return {
      statusCode: 200,
      body: JSON.stringify({ results })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
