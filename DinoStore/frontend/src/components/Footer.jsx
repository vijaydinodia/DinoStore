import React from "react";
import { Link } from "react-router-dom";
import "../css/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo + About */}
        <div className="footer-section">
          <h2 className="footer-logo">Dino Store</h2>
          <p>
            Your one-stop shop for amazing products. Quality, affordability, and
            trust — all in one place.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/product">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3>Support</h3>
          <p>Email: support@dinostore.com</p>
          <p>Phone: +91 99999-99999</p>
          <p>Location: India</p>
        </div>

        {/* Social */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <span>🌐</span>
            <span>📘</span>
            <span>📸</span>
            <span>🐦</span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Dino Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
