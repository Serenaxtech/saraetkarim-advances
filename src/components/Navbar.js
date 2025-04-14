import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg" id="myNav">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo */}
        <Link href="/" className="navbar-brand">
          <Image 
            src="/images/logo.jpg" 
            alt="Logo" 
            width={40} 
            height={40}
            className="rounded-circle object-fit-cover"
          />
        </Link>

        {/* Icons */}
        <div className="d-flex align-items-center">
          <Link href="/profile" className="text-white me-3" id="profile-link">
            <FontAwesomeIcon icon={faUser} className="fa-lg" />
          </Link>
          <Link href="/cart" className="text-white">
            <FontAwesomeIcon icon={faShoppingCart} className="fa-lg" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Items */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href="/" className="nav-link active">Home</Link>
            </li>
            <li className="nav-item">
              <Link href="/menu" className="nav-link">Menu</Link>
            </li>
            <li className="nav-item">
              <Link href="/products" className="nav-link">Products</Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className="nav-link">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}