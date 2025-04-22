export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password, number } = req.body;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, password, number })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.message || 'Registration failed' 
      });
    }

    return res.status(201).json({ 
      success: true,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Sign-up error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}