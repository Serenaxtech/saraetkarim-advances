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
      const authResponse = await fetch('/api/auth/check', {
        credentials: 'include'
      });

      if (!authResponse.ok) {
        throw new Error('Authentication failed');
      }

      const authData = await authResponse.json();
      const customerId = authData.user.id;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/address/customer/${customerId}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
        
        if (data.length > 0 && !selectedAddress) {
          setSelectedAddress(data[0].address_ID.toString());
        }
      } else if (response.status === 404) {
        
        setAddresses([]);
        setSelectedAddress('');
      } else if (response.status === 401 || response.status === 403) {
        router.push('/auth');
      } else {
        throw new Error('Failed to fetch addresses');
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      showNotification('Failed to load addresses', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress),
        credentials: 'include'
      });

      if (response.ok) {
        showNotification('Address added successfully', 'success');
        fetchAddresses();

        setNewAddress({
          region: '', city: '', street: '', building: '', floor: '', apartment: '', additional: ''
        });
      } else {
         const errorData = await response.json();
         const errorMessage = errorData.message || 'Failed to add address';
         showNotification(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      showNotification('Failed to add address', 'error');
    }
  };

  const fetchCartItems = async () => {
    try {
      const authResponse = await fetch('/api/auth/check', {
        credentials: 'include'
      });
  
      if (!authResponse.ok) {
        throw new Error('Authentication failed');
      }
  
      const authData = await authResponse.json();
      const customerId = authData.user.id;
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/customer/${customerId}`, {
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
  
      const cartItems = await response.json();
      return cartItems;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      showNotification('Please select an address', 'error');
      return;
    }
  
    try {

      const cartItems = await fetchCartItems();
      if (!cartItems || cartItems.length === 0) {
        showNotification('No items in cart to order', 'error');
        return;
      }
  

      for (const item of cartItems) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            cart_ID: item.cart_ID,
            address_ID: parseInt(selectedAddress)
          }),
          credentials: 'include'
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.message || 'Failed to create one of the orders';
          showNotification(errorMessage, 'error');
          return;
        }
      }
  
      showNotification('Orders placed successfully!');
      setTimeout(() => {
        router.push('/thankyou');
      }, 2000);
    } catch (error) {
      console.error('Error placing orders:', error);
      showNotification('Failed to place orders', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000); // Hide after 3 seconds
  };

  return (
    <Layout hideFooter> {/* Assuming Layout component exists and can hide footer */}
      <Head>
        <title>Select Address - Sara et Karim</title>
        {/* Include fonts if not globally included in _app.js or _document.js */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Leiko:wght@400;700&display=swap" />
      </Head>

      {/* Notification Area */}
      {notification.show && (
        <div className={`${styles.toast} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <div className={styles.addressBody}>
        <h1>Select Address</h1>
        <div className={styles.container}>
          <div className={styles.addressList}>
            {addresses.length === 0 ? (
              <p>No addresses found. Please add one below.</p>
            ) : (
              addresses.map((address) => (
                <div key={address.address_ID} className={styles.addressItem}>
                  <input
                    type="radio"
                    id={`address-${address.address_ID}`}
                    name="address"
                    value={address.address_ID.toString()}
                    checked={selectedAddress === address.address_ID.toString()}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                  />
                  <label htmlFor={`address-${address.address_ID}`} className={styles.addressDetails}>
                    <p>Region: {address.region}, {address.city}</p>
                    <p>Street: {address.street}, Building: {address.building}</p>
                    <p>Floor: {address.floor}</p>
                    {address.moreDetails && <p>Additional: {address.moreDetails}</p>}
                  </label>
                </div>
              ))
            )}
          </div>

          <div className={styles.addAddressForm}>
            <h2>Add New Address</h2>
            <form onSubmit={handleAddressSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="region">Region:</label>
                <input type="text" id="region" name="region" value={newAddress.region} onChange={handleInputChange} required />
              </div>
              <div className={styles.formGroup}>
                 <label htmlFor="city">City:</label>
                 <input type="text" id="city" name="city" value={newAddress.city} onChange={handleInputChange} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="street">Street:</label>
                <input type="text" id="street" name="street" value={newAddress.street} onChange={handleInputChange} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="building">Building:</label>
                <input type="text" id="building" name="building" value={newAddress.building} onChange={handleInputChange} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="floor">Floor:</label>
                <input type="text" id="floor" name="floor" value={newAddress.floor} onChange={handleInputChange} required />
              </div>
              <div className={styles.formGroup}>
                 <label htmlFor="apartment">Apartment:</label>
                 <input type="text" id="apartment" name="apartment" value={newAddress.apartment} onChange={handleInputChange} required />
              </div>
              <div className={styles.formGroup}>
                 <label htmlFor="additional">Additional Info (Optional):</label>
                 <input type="text" id="additional" name="additional" value={newAddress.additional} onChange={handleInputChange} />
              </div>
              <button type="submit" className={styles.btn}>Add Address</button>
            </form>
          </div>

          <div className={styles.checkoutBtnContainer}>
            <button onClick={handleCheckout} className={styles.btn} disabled={addresses.length === 0 && !selectedAddress}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}