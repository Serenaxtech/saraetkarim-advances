import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/ThankYou.module.css';

export default function ThankYou() {
  return (
    <>
      <Head>
        <title>Thank You - Sara et Karim</title>
      </Head>
      <div className={styles.thankYouBody}>
        <h1>Thank You for Ordering!</h1>
        <Link href="/products" className={styles.continueShoppingBtn}>
          Continue Shopping
        </Link>
      </div>
    </>
  );
}