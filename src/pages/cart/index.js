import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import styles from '@/styles/Cart.module.css';

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    fetchCartItems();
    fetchCartTotal();
  }, []);

  const fetchCartItems = async () => {
    try {
      // First, get the user ID from the auth check endpoint
      const authResponse = await fetch('/api/auth/check', {
        credentials: 'include'
      });

      if (!authResponse.ok) {
        throw new Error('Authentication failed');
      }

      const authData = await authResponse.json();
      const userId = authData.user.id;

      // Then fetch the cart items using the user ID
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/customer/${userId}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      } else {
        throw new Error('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      showNotification('Failed to load cart items', 'error');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
        credentials: 'include'
      });

      if (response.ok) {
        fetchCartItems();
        showNotification('Cart updated successfully', 'success');
      } else {
        showNotification('Failed to update cart', 'error');
      }
    } catch (error) {
      showNotification('Failed to update cart', 'error');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        fetchCartItems();
        showNotification('Item removed from cart', 'success');
      } else {
        showNotification('Failed to remove item', 'error');
      }
    } catch (error) {
      showNotification('Failed to remove item', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const fetchCartTotal = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/total`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCartTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching cart total:', error);
    }
  };

  // Replace the calculateTotal function
  const calculateTotal = () => {
    return cartTotal.toFixed(2);
  };
  
  // Update the total display in the JSX
  <div className={styles.cartSummary}>
    <p>Total: ${calculateTotal()}</p>
    <button
      onClick={() => router.push('/address')}
      className={styles.btnCheckout}
    >
      Proceed to Checkout
    </button>
  </div>
  return (
    <Layout>
      <Head>
        <title>Cart - Sara et Karim</title>
      </Head>

      <div className={styles.cartBody}>
        <h1>Shopping Cart</h1>
        
        <div className={styles.container}>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className={styles.productImage}
                />
                <div className={styles.cartItemDetails}>
                  <h2>{item.name}</h2>
                  <p>Price: ${item.price}</p>
                </div>
                <div className={styles.cartItemActions}>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className={styles.btnRemove}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
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