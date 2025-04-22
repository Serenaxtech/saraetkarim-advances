import Head from 'next/head'
import Script from 'next/script'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children, hideFooter }) {
  return (
    <>
      <Head>
        <title>Sara Et Karim</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Leiko:wght@400;700&display=swap" rel="stylesheet" />
        </Head>
      </Head>
      
      <Navbar />
      <main>{children}</main>
      {!hideFooter && <Footer />}

      <Script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossOrigin="anonymous"
      />
    </>
  )
}