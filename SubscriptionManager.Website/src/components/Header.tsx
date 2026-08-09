import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layers, Menu, X, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

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

  const publicNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About Us', path: '/about' },
  ];

  const authNavLinks = [
    { name: 'Dashboard', path: '/dashboard' }
  ];

  const navLinks = isAuthenticated ? [...publicNavLinks, ...authNavLinks] : publicNavLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-outline">Log In</Link>
                <Link to="/register" className="btn btn-primary">Get Started</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn btn-outline">
                <LogOut size={18} style={{ marginRight: '8px' }} />
                Log Out
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
