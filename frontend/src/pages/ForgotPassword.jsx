import { useState, useEffect } from "react";
import "./ForgotPassword.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function ForgotPassword({ onNavigateToLogin, initialEmail = "" }) {
  // Steps: 1: 'email', 2: 'otp', 3: 'new_password', 4: 'success'
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [realEmailSent, setRealEmailSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const apiRequest = async (endpoint, payload) => {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    }
  };

  // STEP 1: Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest("/api/forgot-password/send-otp", { email: cleanEmail });
      if (data.status === "success") {
        const isReal = Boolean(data.real_email_sent);
        setRealEmailSent(isReal);
        if (data.otp && !isReal) {
          setDemoOtp(data.otp);
        } else {
          setDemoOtp("");
        }
        setSuccessMsg(data.message || `Verification code sent to ${cleanEmail}`);
        setCountdown(60);
        setCanResend(false);
        setStep(2);
      } else {
        setError(data.detail || data.message || "Failed to generate OTP. Please try again.");
      }
    } catch {
      setError("Unable to connect to the server. Please verify backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (cleanOtp.length !== 6) {
      setError("OTP code must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest("/api/forgot-password/verify-otp", {
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
      });

      if (data.status === "success") {
        setSuccessMsg("OTP verified! Now enter your new password.");
        setStep(3);
      } else {
        setError(data.detail || data.message || "Invalid OTP code. Please try again.");
      }
    } catch {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!newPassword) {
      setError("Please enter your new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify both fields.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest("/api/forgot-password/reset", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      if (data.status === "success") {
        setStep(4);
      } else {
        setError(data.detail || data.message || "Failed to reset password. Please try again.");
      }
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate password strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: "", score: 0, color: "" };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { label: "Weak", score: 33, color: "#f87171" };
    if (score <= 4) return { label: "Medium", score: 66, color: "#fbbf24" };
    return { label: "Strong", score: 100, color: "#34d399" };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        
        {/* Brand Logo */}
        <div className="forgot-logo">VELFIRE</div>

        {/* Step Progress Pills */}
        {step < 4 && (
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? "active" : ""}`}>
              <span className="step-num">1</span>
              <span className="step-text">Email</span>
            </div>
            <div className={`step-line ${step >= 2 ? "active" : ""}`} />
            <div className={`step-dot ${step >= 2 ? "active" : ""}`}>
              <span className="step-num">2</span>
              <span className="step-text">OTP</span>
            </div>
            <div className={`step-line ${step >= 3 ? "active" : ""}`} />
            <div className={`step-dot ${step >= 3 ? "active" : ""}`}>
              <span className="step-num">3</span>
              <span className="step-text">New Password</span>
            </div>
          </div>
        )}

        {/* Alert Messages */}
        {error && (
          <div className="alert alert-error">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {successMsg && step !== 4 && (
          <div className="alert alert-success">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <div className="step-content">
            <h1>Reset Password</h1>
            <p className="forgot-subtitle">
              Enter your registered email address to receive a 6-digit OTP verification code.
            </p>

            <form onSubmit={handleSendOtp} noValidate>
              <div className="input-group">
                <label htmlFor="reset-email">Email Address</label>
                <div className="input-wrapper">
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoFocus
                    required
                  />
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                </div>
              </div>

              <button type="submit" className="action-button" disabled={loading}>
                {loading ? (
                  <span className="spinner-wrapper">
                    <span className="spinner"></span>
                    Generating OTP...
                  </span>
                ) : (
                  "Generate & Send OTP"
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <div className="step-content">
            <h1>Verify OTP</h1>
            <p className="forgot-subtitle">
              Enter the 6-digit code sent to <strong className="highlight-text">{email}</strong>
              <button
                type="button"
                className="change-email-btn"
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
              >
                (Change)
              </button>
            </p>

            {/* Real OTP Dispatched Notice */}
            {realEmailSent && (
              <div className="inbox-notice-banner">
                <div className="inbox-notice-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#34d399" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="inbox-notice-body">
                  <div className="inbox-notice-title">Real Verification Code Sent!</div>
                  <div className="inbox-notice-text">
                    Check your inbox at <strong>{email}</strong> for your 6-digit OTP code (also check spam/junk folder if needed).
                  </div>
                </div>
              </div>
            )}

            {/* Instant Demo OTP helper badge when SMTP is not yet configured */}
            {!realEmailSent && demoOtp && (
              <div className="demo-otp-banner">
                <div className="demo-otp-header">
                  <span className="pulse-icon"></span>
                  <span>Generated Verification Code:</span>
                </div>
                <div className="demo-otp-row">
                  <code className="demo-code">{demoOtp}</code>
                  <button
                    type="button"
                    className="demo-fill-btn"
                    onClick={() => setOtp(demoOtp)}
                  >
                    Auto Fill
                  </button>
                </div>
                <div className="smtp-helper-hint">
                  💡 <em>To deliver directly to your real Gmail inbox, enter your Gmail & App Password in <code>backend/.env</code>.</em>
                </div>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} noValidate>
              <div className="input-group">
                <label htmlFor="otp-input">6-Digit OTP Code</label>
                <div className="input-wrapper">
                  <input
                    id="otp-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setOtp(val);
                    }}
                    placeholder="Enter 6-digit code"
                    className="otp-input-field"
                    autoFocus
                    required
                  />
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="resend-row">
                {canResend ? (
                  <button
                    type="button"
                    className="resend-btn"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    Resend OTP Code
                  </button>
                ) : (
                  <span className="resend-timer">
                    Resend code in <strong>{countdown}s</strong>
                  </span>
                )}
              </div>

              <button type="submit" className="action-button" disabled={loading || otp.length !== 6}>
                {loading ? (
                  <span className="spinner-wrapper">
                    <span className="spinner"></span>
                    Verifying OTP...
                  </span>
                ) : (
                  "Verify & Continue"
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: Set New Password */}
        {step === 3 && (
          <div className="step-content">
            <h1>Set New Password</h1>
            <p className="forgot-subtitle">
              Create a strong new password for your account <strong className="highlight-text">{email}</strong>
            </p>

            <form onSubmit={handleResetPassword} noValidate>
              <div className="input-group">
                <label htmlFor="new-password">New Password</label>
                <div className="input-wrapper">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex="-1"
                  >
                    {showNewPassword ? (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                {newPassword && (
                  <div className="strength-meter-wrap">
                    <div className="strength-bar-bg">
                      <div
                        className="strength-bar-fill"
                        style={{ width: `${strength.score}%`, backgroundColor: strength.color }}
                      ></div>
                    </div>
                    <span className="strength-label" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="confirm-new-password">Confirm New Password</label>
                <div className="input-wrapper">
                  <input
                    id="confirm-new-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword && (
                  <div className="match-indicator">
                    {newPassword === confirmPassword ? (
                      <span className="match-yes">✓ Passwords match</span>
                    ) : (
                      <span className="match-no">✗ Passwords do not match</span>
                    )}
                  </div>
                )}
              </div>

              <button type="submit" className="action-button" disabled={loading}>
                {loading ? (
                  <span className="spinner-wrapper">
                    <span className="spinner"></span>
                    Updating Password...
                  </span>
                ) : (
                  "Update & Save Password"
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: Success View */}
        {step === 4 && (
          <div className="step-content success-step">
            <div className="success-icon-wrap">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#34d399" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1>Password Reset Complete!</h1>
            <p className="forgot-subtitle">
              Your password has been successfully updated. You can now log into your account with your new password.
            </p>

            <button
              type="button"
              className="action-button success-btn"
              onClick={() => onNavigateToLogin(email)}
            >
              Sign In Now
            </button>
          </div>
        )}

        {/* Back to Login Footer */}
        {step !== 4 && (
          <div className="back-to-login">
            <button
              type="button"
              className="back-login-btn"
              onClick={() => onNavigateToLogin(email)}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Login</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;
