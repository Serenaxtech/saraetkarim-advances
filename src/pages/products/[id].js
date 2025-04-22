import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '@/components/Layout';
import styles from '@/styles/ProductDetails.module.css';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    if (id) {
      fetchProductDetails();
      fetchProductReviews();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
        credentials: 'include'
      });

      if (response.status === 401 || response.status === 403) {
        router.push('/auth');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }

      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductReviews = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/product/${id}`, {
        credentials: 'include'
      });

      if (response.status === 401 || response.status === 403) {
        router.push('/auth');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          product_ID: parseInt(id), 
          quantity: parseInt(quantity) 
        }),
        credentials: 'include'
      });

      if (response.ok) {
        showNotification('Product added to cart successfully!');
      } else {
        showNotification('Failed to add product to cart.', true);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Failed to add product to cart.', true);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_ID: parseInt(id),
          rating,
          review_Text: reviewText
        }),
        credentials: 'include'
      });

      if (response.ok) {
        showNotification('Review submitted successfully!');
        setRating(0);
        setReviewText('');
        fetchProductReviews();
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          errorData.errors.forEach(err => showNotification(err.msg, true));
        } else {
          showNotification('Failed to submit review.', true);
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      showNotification('Failed to submit review.', true);
    }
  };

  const showNotification = (message, isError = false) => {
    // Implement your notification system here
    alert(message); // Temporary solution - replace with your preferred notification system
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  // Remove Layout component and use a div instead
  return (
    <div className={styles.pageWrapper}>
      <Head>
        <title>{product.name} - Sara et Karim</title>
      </Head>
  
      <div className={styles.container}>
        <h1>{product.name}</h1>
        
        <div className={styles.productDetailsContainer}>
          <Image
            src={product.img}
            alt={product.name}
            width={300}
            height={300}
            className={styles.productImg}
            objectFit="cover"
          />
          
          <div className={styles.productInfoSection}>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Info:</strong> {product.info}</p>

            <form className={styles.form} onSubmit={handleAddToCart}>
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock_quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <button type="submit">Add to Cart</button>
            </form>
          </div>
        </div>

        <div className={styles.reviews}>
          <h2>Reviews</h2>
          <div className={styles.reviewsList}>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className={styles.reviewItem}>
                  <p><strong>Rating:</strong> {review.rating} / 5</p>
                  <p>{review.reviewtext}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>

          <h2>Submit Your Review</h2>
          <form className={styles.form} onSubmit={handleSubmitReview}>
            <div className={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${rating >= star ? styles.selected : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            
            <label htmlFor="review_Text">Your Review:</label>
            <textarea
              id="review_Text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="5"
            />
            <button type="submit">Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  );
}