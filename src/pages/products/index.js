import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import styles from '@/styles/Products.module.css';

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 5;

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        credentials: 'include'
      });
      
      if (response.status === 401 || response.status === 403) {
        router.push('/auth');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return products.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(products.length / limit);

  return (
    <Layout>
      <Head>
        <title>Products - Sara et Karim</title>
      </Head>

      <div className={styles.productsPage}>
        <h1>Our Products</h1>
        
        <div className={styles.productsContainer}>
          {getCurrentPageProducts().map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.imageContainer}>
                <Image
                  src={product.product_IMG}
                  alt={product.product_Name}
                  width={200}
                  height={200}
                  objectFit="cover"
                  className={styles.productImage}
                />
              </div>
              <h2 className={styles.productTitle}>{product.product_Name}</h2>
              <p className={styles.productPrice}>Price: ${product.product_Price}</p>
              <Link 
                href={`/products/${product.product_ID}`}
                className={styles.detailsButton}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>

        <div className={styles.pagination}>
          {currentPage > 1 && (
            <button 
              onClick={() => setCurrentPage(prev => prev - 1)}
              className={styles.paginationButton}
            >
              Previous
            </button>
          )}
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`${styles.paginationButton} ${currentPage === i + 1 ? styles.active : ''}`}
            >
              {i + 1}
            </button>
          ))}
          
          {currentPage < totalPages && (
            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              className={styles.paginationButton}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}