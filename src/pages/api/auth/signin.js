export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data.error || 'Invalid email or password';
      return res.status(response.status).json({ error });
    }

    // Forward the cookie from the backend
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      res.setHeader('Set-Cookie', cookies);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Sign-in error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}