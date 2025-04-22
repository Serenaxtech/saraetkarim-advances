export async function checkAuth() {
  try {
    const response = await fetch('/api/auth/check', {
      credentials: 'include'
    });
    return response.ok;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}

export async function signOut() {
  try {
    await fetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include'
    });
    window.location.href = '/auth/signin';
  } catch (error) {
    console.error('Sign out failed:', error);
  }
}