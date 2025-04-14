import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-background-overlay"></div>
      <div className="container">
        <div className="footer-content">
          {/* Left Column - Logo */}
          <div className="footer-left">
            <Image 
              src="/images/coffee-grinder.png" 
              alt="Coffee Grinder" 
              width={200} 
              height={200} 
              className="footer-grinder"
            />
          </div>

          {/* Middle Column - Links */}
          <div className="footer-middle">
            <div className="footer-links-group">
              <h3>About</h3>
              <ul>
                <li><Link href="/our-story">Our Story</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h3>Menu</h3>
              <ul>
                <li><Link href="/locations">Locations</Link></li>
                <li><Link href="/support">Support</Link></li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h3>Services</h3>
              <ul>
                <li><Link href="/payment">Payment Options</Link></li>
                <li><Link href="/refunds">Refunds & Exchanges</Link></li>
              </ul>
            </div>
          </div>

          {/* Right Column - Contact & Social */}
          <div className="footer-right">
            <div className="contact-info">
              <p><i className="fas fa-map-marker-alt"></i> NORTH LEBANON, TRIPOLI MAARAD</p>
              <p><i className="fas fa-envelope"></i> Saraetkarimcafe@Gmail.Com</p>
              <p><i className="fas fa-phone"></i> 70 562711</p>
            </div>
            <div className="social-media">
              <span>Social Media</span>
              <a href="#"><i className="fab fa-pinterest"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>Created By Serena Ridany</p>
          <p>Copyright 2025 Sara et Karim Coffee. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}