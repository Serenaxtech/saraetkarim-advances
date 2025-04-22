import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import styles from '@/styles/Cart.module.css';

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    fetchCartItems();
    fetchCartTotal();
  }, []);

  // Add new function to fetch product details
  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setProductDetails(prev => ({
          ...prev,
          [productId]: data
        }));
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  // Modify fetchCartItems to also fetch product details
  const fetchCartItems = async () => {
    try {
      const authResponse = await fetch('/api/auth/check', {
        credentials: 'include'
      });

      if (!authResponse.ok) {
        throw new Error('Authentication failed');
      }

      const authData = await authResponse.json();
      const userId = authData.user.id;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/customer/${userId}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
        // Fetch product details for each cart item
        data.forEach(item => {
          fetchProductDetails(item.product_ID);
        });
      } else {
        throw new Error('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      showNotification('Failed to load cart items', 'error');
    }
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

  const updateQuantity = async (cartId, quantity) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
        credentials: 'include'
      });

      if (response.ok) {
        await fetchCartItems();
        await fetchCartTotal();
        showNotification('Cart updated successfully', 'success');
      } else {
        showNotification('Failed to update cart', 'error');
      }
    } catch (error) {
      showNotification('Failed to update cart', 'error');
    }
  };

  const removeItem = async (cartId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${cartId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await fetchCartItems();
        await fetchCartTotal();
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

  // Added useEffect to log cart items whenever they change
  useEffect(() => {
    console.log('Current Cart Items:', cartItems);
  }, [cartItems]);

  return (
    <Layout hideFooter>
      <Head>
        <title>Your Cart</title>
      </Head>

      <div className={styles.cartBody}>
        <h1>Your Cart</h1>
        
        <div className={styles.container}>
          <div className={styles.cartItems}>
            {cartItems.map((item) => {
              const product = productDetails[item.product_ID] || {};
              return (
                <div key={item.cart_ID} className={styles.cartItem}>
                  <Image
                    src={product.img || '/images/placeholder.jpg'}
                    alt={product.name || `Product ${item.product_ID}`}
                    width={80}
                    height={80}
                    className={styles.productImage}
                  />
                  <div className={styles.cartItemDetails}>
                    <h2>{product.name || `Product ${item.product_ID}`}</h2>
                    <p>Price: ${product.price || '0.00'}</p>
                  </div>
                  <div className={styles.cartItemActions}>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.cart_ID, parseInt(e.target.value))}
                      className={styles.quantityInput}
                    />
                    <button
                      onClick={() => removeItem(item.cart_ID)}
                      className={styles.btnDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.cartSummary}>
            <p>Total: ${cartTotal.toFixed(2)}</p>
            <button
              onClick={() => router.push('/address')}
              className={styles.btnPlaceOrder}
            >
              Place Order
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