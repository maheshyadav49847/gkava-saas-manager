import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, Menu, X, ChevronRight } from 'lucide-react';
import './Header.css';

export function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <header className={`header ${isMobileMenuOpen ? 'menu-open' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="brand">
          <Layers className="brand-icon" size={28} />
          <span className="brand-text">GK<span style={{ color: 'var(--color-primary)' }}>ava</span></span>
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  <span>{link.name}</span>
                  <ChevronRight size={20} className="nav-chevron" />
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Actions moved inside nav for mobile view */}
          <div className="header-actions">
            <a 
              href={`${import.meta.env.VITE_APP_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5180' : `https://app.${window.location.hostname.replace('www.', '').replace('app.', '')}`)}/login`} 
              className="btn btn-outline"
            >Log In</a>
            <a 
              href={`${import.meta.env.VITE_APP_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5180' : `https://app.${window.location.hostname.replace('www.', '').replace('app.', '')}`)}/register`} 
              className="btn btn-primary"
            >Get Started</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
