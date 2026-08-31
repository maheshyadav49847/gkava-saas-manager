import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, LogOut, User, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout } = useAuth();

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  // Click outside to close profile menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`header ${isMobileMenuOpen ? 'menu-open' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="brand">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden mr-2" style={{ width: '32px', height: '32px', marginRight: '8px', borderRadius: '8px', overflow: 'hidden' }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
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
              <div className="profile-menu-container" ref={profileMenuRef}>
                <button 
                  className="profile-menu-btn" 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <div className="avatar">
                    <User size={18} />
                  </div>
                  <span className="profile-name">My Account</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <p className="profile-dropdown-title">Signed In</p>
                    </div>
                    <ul className="profile-dropdown-list">
                      <li>
                        <Link to="/dashboard" className="profile-dropdown-item">
                          <LayoutDashboard size={16} />
                          <span>Dashboard</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/dashboard?tab=billing" className="profile-dropdown-item">
                          <Settings size={16} />
                          <span>Billing & Plans</span>
                        </Link>
                      </li>
                      <li className="profile-dropdown-divider"></li>
                      <li>
                        <button onClick={handleLogout} className="profile-dropdown-item text-red">
                          <LogOut size={16} />
                          <span>Log Out</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
