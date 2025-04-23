import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import styles from '@/styles/Profile.module.css';
import { useRouter } from 'next/router';

export default function Profile() {
  const [userData, setUserData] = useState({
    id: '',
    customer_FullName: '',
    customer_Email: '',
    customer_PhoneNumber: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: ''
  });
  const [notification, setNotification] = useState({ message: '', type: '', show: false });
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const authResponse = await fetch('/api/auth/check', {
        credentials: 'include'
      });

      if (!authResponse.ok) {
        throw new Error('Authentication failed');
      }

      const authData = await authResponse.json();
      const userId = authData.user.id;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/${userId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData({ ...data, id: userId });
      // Initialize form data with user data
      setFormData({
        name: data.customer_FullName,
        email: data.customer_Email,
        number: data.customer_PhoneNumber
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      showNotification('Failed to load profile data', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/${userData.customer_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update both userData and formData with new values
      const updatedUserData = {
        ...userData,
        customer_FullName: formData.name,
        customer_Email: formData.email,
        customer_PhoneNumber: formData.number
      };
      setUserData(updatedUserData);
      showNotification('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Failed to update profile', 'error');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const showNotification = (message, type) => {
    setNotification({ message, type, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const [deletePassword, setDeletePassword] = useState('');
  
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/${userData.customer_ID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
        credentials: 'include'
      });
  
      if (!response.ok) {
        let errorMsg = 'Failed to delete account';
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMsg = errorData.error;
          } else if (errorData && errorData.message) {
            errorMsg = errorData.message;
          }
        } catch {
          // fallback to default error message
        }
        showNotification(errorMsg, 'error');
        return;
      }
  
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      showNotification('Failed to delete account. Please try again.', 'error');
    }
  };

  return (
    <Layout hideFooter>
      <Head>
        <title>My Profile - Sara et Karim</title>
      </Head>

      <div className={styles.profileBody}>
        <header className={styles.header}>
          <h1>My Profile</h1>
        </header>

        {notification.show && (
          <div className={`${styles.notification} ${styles[notification.type]}`}>
            {notification.message}
          </div>
        )}

        <div className={styles.profileContainer}>
          <div className={styles.infoDisplay}>
            <p><strong>Full Name:</strong> {userData.customer_FullName}</p>
            <p><strong>Email:</strong> {userData.customer_Email}</p>
            <p><strong>Phone:</strong> {userData.customer_PhoneNumber}</p>
          </div>

          <h2>Update Profile</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="number">Phone Number</label>
              <input
                type="text"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className={styles.btnSubmit}>
              Update
            </button>
          </form>

          <div className={styles.deleteSection}>
            <h2>Delete Account</h2>
            <p>Enter your password to confirm account deletion. This action is irreversible.</p>
            <form onSubmit={handleDeleteAccount}>
              <div className={styles.formGroup}>
                <label htmlFor="deletePassword">Password</label>
                <input
                  type="password"
                  id="deletePassword"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.btnDelete}>
                Delete Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}