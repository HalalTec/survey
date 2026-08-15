// api/submit.js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const body = req.body;

    // Inject the key securely from Vercel's environment variables
    const payload = {
      ...body,
      access_key: process.env.WEB3FORMS_ACCESS_KEY,
      subject: "New Business Research Survey Response",
      from_name: "Operations Research App"
    };

    // Forward the payload to Web3Forms from the server side
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, message: 'Response recorded successfully' });
    } else {
      return res.status(response.status).json({ success: false, message: data.message || 'Submission failed' });
    }
  } catch (error) {
    console.error('Serverless submission error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}