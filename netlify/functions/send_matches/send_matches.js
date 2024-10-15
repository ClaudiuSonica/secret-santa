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
      sendSmtpEmail.sender = { email: process.env.SENDER_EMAIL };
      sendSmtpEmail.subject = '🎅✨ Ho Ho Ho! Descoperă cine e Mosul tău Secret! 🎁';
      
      // Styled HTML content with a Christmas theme
      sendSmtpEmail.htmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <h1 style="text-align: center; color: #e74c3c;">🎄 Secret Santa 🎄</h1>
              <p style="font-size: 18px; color: #2c3e50;">Salut ${santa.name},</p>
              <p style="font-size: 16px; color: #2c3e50;">Este acel moment magic din an! 🎅 Ai fost ales să-i oferi un cadou lui <strong>${recipient.name}</strong> anul acesta! 🎁</p>
              <p style="font-size: 16px; color: #2c3e50;">Fă-l să fie special! 🥳</p>
              <hr style="border-top: 1px solid #e74c3c; margin: 20px 0;">
              <p style="text-align: center; color: #7f8c8d;">Crăciun Fericit și multe bucurii! 🎉</p>
            </div>
          </body>
        </html>
      `;

      return emailApi.sendTransacEmail(sendSmtpEmail);
    });

    // Send all emails concurrently
    const results = await Promise.all(emailPromises);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Emailuri trimise cu succes! 🎉 Crăciun Fericit!',
        results
      })
    };
  } catch (error) {

    if (statusCode === 404) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Nu s-a găsit utilizatorul... Verifică datele introduse.'
        })
      };
    }    

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Ups! Ceva nu a mers bine... Te rugăm să încerci din nou.',
        error: error.message
      })
    };
  }
}
