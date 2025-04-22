import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '@/styles/Auth.module.css';

export default function SignUp() {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);
  const [signInMessage, setSignInMessage] = useState({ text: '', type: '' });
  const [signUpMessage, setSignUpMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/check/auth`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });
        
        console.log('Auth check response status:', response.status);
        
        if (isMounted) {
          setAuthCheckComplete(true);
          if (response.ok) {
            console.log('User is authenticated, redirecting to profile');
            router.replace('/profile');
          } else {
            console.log('User is not authenticated, staying on auth page');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (isMounted) {
          setAuthCheckComplete(true);
        }
      }
    };

    // Only run the auth check once when component mounts
    if (!authCheckComplete) {
      checkAuth();
    }

    return () => {
      isMounted = false;
    };
  }, [authCheckComplete]); // Remove router from dependencies

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSignInMessage({ text: '', type: '' });
    setIsSubmitting(true);

    const email = e.target.si_email.value.trim();
    const password = e.target.si_password.value.trim();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        mode: 'cors',
        credentials: 'include'
      });

      const result = await response.json();

      if (response.ok) {
        setSignInMessage({ text: 'Signed in successfully!', type: 'success' });
        e.target.reset();
        router.push('/profile');
      } else {
        handleErrorResponse(result, setSignInMessage);
      }
    } catch (error) {
      console.error(error);
      setSignInMessage({
        text: 'Network error. Please check your connection.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignUpMessage({ text: '', type: '' });
    setIsSubmitting(true);

    const name = e.target.su_name.value.trim();
    const email = e.target.su_email.value.trim();
    const password = e.target.su_password.value.trim();
    const number = e.target.su_number.value.trim();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({ name, email, password, number }),
        credentials: 'include'
      });

      const result = await response.json();

      if (response.ok) {
        setSignUpMessage({ text: 'Account created successfully! Please sign in.', type: 'success' });
        e.target.reset();
        setTimeout(() => {
          setIsSignIn(true);
        }, 2000);
      } else {
        handleErrorResponse(result, setSignUpMessage);
      }
    } catch (error) {
      console.error(error);
      setSignUpMessage({
        text: 'Network error. Please check your connection.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleErrorResponse = (result, setMessage) => {
    if (Array.isArray(result.errors) && result.errors.length > 0) {
      setMessage({
        text: result.errors.map(err => err.msg).join('\n'),
        type: 'error'
      });
    } else {
      setMessage({
        text: result.error || 'An error occurred',
        type: 'error'
      });
    }
  };

  return (
    <>
      <Head>
        <title>Sign In / Sign Up - Sara et Karim</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Leko:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <header className={styles.header}>
        <h1>Welcome to "Sara et Karim"</h1>
      </header>

      <div className={styles.authContainer}>
        <div className={styles.toggleButtons}>
          <button
            className={`${styles.toggleButton} ${isSignIn ? styles.active : ''}`}
            onClick={() => setIsSignIn(true)}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`${styles.toggleButton} ${!isSignIn ? styles.active : ''}`}
            onClick={() => setIsSignIn(false)}
            type="button"
          >
            Sign Up
          </button>
        </div>

        {isSignIn ? (
          <form className={styles.authForm} onSubmit={handleSignIn}>
            <h2>Sign In</h2>
            <div className={styles.formGroup}>
              <label htmlFor="si_email">Email Address</label>
              <input
                type="email"
                id="si_email"
                name="si_email"
                placeholder="yourname@example.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="si_password">Password</label>
              <input
                type="password"
                id="si_password"
                name="si_password"
                placeholder="********"
                required
                minLength={8}
              />
            </div>

            <button
              className={styles.btnSubmit}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
            {signInMessage.text && (
              <div className={`${styles.message} ${styles[signInMessage.type]}`}>
                {signInMessage.text}
              </div>
            )}
          </form>
        ) : (
          <form className={styles.authForm} onSubmit={handleSignUp}>
            <h2>Sign Up</h2>
            <div className={styles.formGroup}>
              <label htmlFor="su_name">Full Name</label>
              <input
                type="text"
                id="su_name"
                name="su_name"
                placeholder="John Doe"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="su_email">Email Address</label>
              <input
                type="email"
                id="su_email"
                name="su_email"
                placeholder="yourname@example.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="su_password">Password</label>
              <input
                type="password"
                id="su_password"
                name="su_password"
                placeholder="********"
                required
                minLength={8}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="su_number">Phone Number</label>
              <input
                type="tel"
                id="su_number"
                name="su_number"
                placeholder="12345678"
                required
                pattern="[0-9]{8}"
              />
            </div>

            <button
              className={styles.btnSubmit}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
            {signUpMessage.text && (
              <div className={`${styles.message} ${styles[signUpMessage.type]}`}>
                {signUpMessage.text}
              </div>
            )}
          </form>
        )}
      </div>
    </>
  );
}