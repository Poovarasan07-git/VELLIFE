import React from "react";
import "./Footer.css";

function Footer({ onAboutClick }) {
  return (
    <footer className="vellife-footer">
      <div className="vellife-footer-container">
        
        {/* BRAND & ABOUT COLUMN */}
        <div className="footer-col footer-brand-col">
          <h3 className="footer-brand">VELLIFE</h3>
          <p className="footer-tagline">AI Career Operating System & Skill Mastery Platform</p>
          {onAboutClick && (
            <button 
              type="button" 
              className="footer-about-action-btn"
              onClick={onAboutClick}
              title="Learn more about VELLIFE OS"
            >
              <span>Explore Platform Story</span>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
          )}
        </div>

        {/* CONTACT & LOCATION COLUMN */}
        <div className="footer-col footer-contact-col">
          <h4 className="footer-col-title">Contact & Location</h4>
          
          <div className="footer-info-item">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <a href="mailto:vellife07@gmail.com" className="footer-link">
              vellife07@gmail.com
            </a>
          </div>

          <div className="footer-info-item">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>chennai ,tamilnadu</span>
          </div>
        </div>

        {/* SOCIAL MEDIA LOGOS COLUMN */}
        <div className="footer-col footer-social-col">
          <h4 className="footer-col-title">Connect With Us</h4>
          
          <div className="footer-social-logos">
            {/* Instagram Logo */}
            <a 
              href="https://instagram.com/vellife.official" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon-btn instagram"
              title="Instagram (@vellife.official)"
              aria-label="Instagram (@vellife.official)"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            {/* YouTube Logo */}
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon-btn youtube"
              title="YouTube"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>

            {/* LinkedIn Logo */}
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon-btn linkedin"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>

      </div>

      {/* BOTTOM COPYRIGHT BAR */}
      <div className="footer-bottom-bar">
        <p>© {new Date().getFullYear()} VELLIFE. All rights reserved. | chennai ,tamilnadu</p>
      </div>
    </footer>
  );
}

export default Footer;
