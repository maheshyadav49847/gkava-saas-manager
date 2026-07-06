import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          <div className="footer-brand">
            <Link to="/" className="brand mb-4">
              <Layers className="brand-icon" size={24} />
              <span className="brand-text">GK<span style={{ color: 'var(--color-primary)' }}>ava</span></span>
            </Link>
            <p className="footer-desc">
              Empowering businesses with scalable, secure, and modern SaaS solutions.
            </p>
            <div className="social-links mt-8">
              <a href="#" className="social-icon">Twitter</a>
              <a href="#" className="social-icon">LinkedIn</a>
              <a href="#" className="social-icon">GitHub</a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Products</h4>
            <ul className="footer-links">
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><a href="#">Integrations</a></li>
              <li><a href="#">Documentation</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} GKAVA Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
