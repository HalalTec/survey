// api/submit.js
export default async function handler(req, res) {
  // Always set JSON content header
  res.setHeader('Content-Type', 'application/json');

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // 1. Verify Environment Variable
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.error('SERVER ERROR: WEB3FORMS_ACCESS_KEY environment variable is missing.');
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error: Missing API Key' 
      });
    }

    // 2. Safely Parse Body
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ success: false, message: 'Invalid JSON payload' });
      }
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({ success: false, message: 'Empty or invalid request body' });
    }

    // 3. Construct Payload for Web3Forms
    const payload = {
      ...body,
      access_key: accessKey,
      subject: "New Business Research Survey Response",
      from_name: "Operations Research App"
    };

    // 4. Forward Request to Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return res.status(200).json({ success: true, message: 'Response recorded successfully' });
    } else {
      console.error('Web3Forms API Error:', data);
      return res.status(400).json({ 
        success: false, 
        message: data.message || 'Web3Forms submission failed' 
      });
    }
  } catch (error) {
    console.error('Serverless catch block error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal Server Error' 
    });
  }
}