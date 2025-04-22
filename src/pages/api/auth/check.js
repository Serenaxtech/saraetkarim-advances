export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authToken = req.cookies.authToken;

  if (!authToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/check/auth`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `authToken=${authToken}`
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    return res.status(200).json({
      isAuthenticated: true,
      user: data.user
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}