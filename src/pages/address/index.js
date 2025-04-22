import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import styles from '@/styles/Address.module.css';

export default function Address() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [newAddress, setNewAddress] = useState({
    region: '',
    city: '',
    street: '',
    building: '',
    floor: '',
    apartment: '',
    additional: ''
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (error) {
      showNotification('Failed to load addresses', 'error');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress),
        credentials: 'include'
      });

      if (response.ok) {
        showNotification('Address added successfully', 'success');
        fetchAddresses();
        setNewAddress({
          region: '',
          city: '',
          street: '',
          building: '',
          floor: '',
          apartment: '',
          additional: ''
        });
      } else {
        showNotification('Failed to add address', 'error');
      }
    } catch (error) {
      showNotification('Failed to add address', 'error');
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      showNotification('Please select an address', 'error');
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address_ID: selectedAddress }),
        credentials: 'include'
      });

      if (response.ok) {
        router.push('/thankyou');
      } else {
        showNotification('Failed to place order', 'error');
      }
    } catch (error) {
      showNotification('Failed to place order', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  return (
    <Layout>
      <Head>
        <title>Select Address - Sara et Karim</title>
      </Head>

      <div className={styles.addressBody}>
        <h1>Select Address</h1>
        
        <div className={styles.container}>
          <div className={styles.addressList}>
            {addresses.map((address) => (
              <div key={address.id} className={styles.addressItem}>
                <input
                  type="radio"
                  name="address"
                  value={address.id}
                  checked={selectedAddress === address.id}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                />
                <div className={styles.addressDetails}>
                  <p>{address.region}, {address.city}</p>
                  <p>{address.street}, Building {address.building}</p>
                  <p>Floor {address.floor}, Apartment {address.apartment}</p>
                  {address.additional && <p>Additional: {address.additional}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.addAddressForm}>
            <h2>Add New Address</h2>
            <form onSubmit={handleAddressSubmit}>
              {/* Form fields */}
              <div className={styles.formGroup}>
                <label htmlFor="region">Region:</label>
                <input
                  type="text"
                  id="region"
                  value={newAddress.region}
                  onChange={(e) => setNewAddress({...newAddress, region: e.target.value})}
                  required
                />
              </div>
              {/* Add similar form groups for city, street, building, floor, apartment, additional */}
              <button type="submit" className={styles.btn}>Add Address</button>
            </form>
          </div>

          <div className={styles.checkoutBtnContainer}>
            <button onClick={handleCheckout} className={styles.btn}>
              Proceed to Checkout
            </button>
          </div>
        </div>

        {notification.show && (
          <div className={`${styles.toast} ${styles[notification.type]}`}>
            {notification.message}
          </div>
        )}
      </div>
    </Layout>
  );
}