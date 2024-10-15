import SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;  // Use your Brevo API key

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const matches = body.matches;

    const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();
    const emailPromises = matches.map(({ santa, recipient }) => {
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.to = [{ email: santa.email }];
      sendSmtpEmail.sender = { email: 'your-email@example.com' };
      sendSmtpEmail.subject = 'Your Secret Santa Assignment!';
      sendSmtpEmail.textContent = `Hey ${santa.name}, you will be gifting ${recipient.name} this year! 🎁`;

      return emailApi.sendTransacEmail(sendSmtpEmail);
    });

    // Send all emails concurrently
    const results = await Promise.all(emailPromises);

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
