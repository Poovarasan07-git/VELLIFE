import { useState } from "react";
import "./TermsPolicy.css";

function TermsPolicy({ createdEmail, onAcceptTerms }) {
  const [isAccepted, setIsAccepted] = useState(false);

  const handleContinue = () => {
    if (isAccepted && onAcceptTerms) {
      onAcceptTerms(createdEmail);
    }
  };

  return (
    <div className="terms-page">
      <div className="terms-container">
        
        {/* Header */}
        <div className="terms-header">
          <div className="terms-logo">VELFIRE</div>
          <h1>Terms of Service & Privacy Policy</h1>
          <p className="terms-subtitle">
            Please read and accept our policies to finalize your account creation for {createdEmail || "your account"}.
          </p>
        </div>

        {/* Scrollable Terms Content */}
        <div className="terms-content">
          <section className="terms-section">
            <h3>1. Introduction & Acceptance</h3>
            <p>
              Welcome to <strong>VELFIRE</strong>. By creating an account and using our platform, you agree to be bound by these Terms of Service and Privacy Policy. If you do not agree to these terms, please do not proceed with account usage.
            </p>
          </section>

          <section className="terms-section">
            <h3>2. Account Registration & Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials (email and password). You agree to notify VELFIRE immediately of any unauthorized access or security breaches concerning your account.
            </p>
          </section>

          <section className="terms-section">
            <h3>3. Privacy & Data Protection</h3>
            <p>
              We value your privacy. Your personal information, including your email address and encrypted password hashes, are stored securely in our databases. We do not sell or share your personal data with unauthorized third parties.
            </p>
          </section>

          <section className="terms-section">
            <h3>4. Acceptable Code of Conduct</h3>
            <p>
              Users must refrain from attempting unauthorized access, disrupting service integrity, or deploying harmful software against the VELFIRE platform. Any violation may result in immediate account suspension.
            </p>
          </section>

          <section className="terms-section">
            <h3>5. Service Updates & Amendments</h3>
            <p>
              VELFIRE reserves the right to update these terms at any time. Continued use of our application following updates constitutes acceptance of the modified terms.
            </p>
          </section>
        </div>

        {/* Footer with Checkbox & Action Button */}
        <div className="terms-footer">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={isAccepted}
              onChange={(e) => setIsAccepted(e.target.checked)}
            />
            <span className="checkmark"></span>
            <span className="checkbox-text">
              I have read and agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
            </span>
          </label>

          <button
            type="button"
            className="accept-button"
            disabled={!isAccepted}
            onClick={handleContinue}
          >
            Accept & Continue to Login →
          </button>
        </div>

      </div>
    </div>
  );
}

export default TermsPolicy;
