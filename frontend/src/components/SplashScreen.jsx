import { useState, useEffect, useMemo } from "react";
import "./SplashScreen.css";

const LETTERS = ["V", "E", "L", "F", "I", "R", "E"];

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING CORE...");
  const [isExiting, setIsExiting] = useState(false);

  // Generate deterministic particles for ambient luxury background
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.6 + 3) % 96}%`,
      size: `${3 + (i % 4) * 2}px`,
      duration: `${4 + (i % 5) * 1.2}s`,
      delay: `${(i * 0.35) % 3}s`,
    }));
  }, []);

  const handleFinish = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete?.();
    }, 550);
  };

  useEffect(() => {
    // Progress bar animation & dynamic status messages
    const startTime = Date.now();
    const duration = 3400; // 3.4 seconds total showcase

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentPct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(currentPct);

      if (currentPct < 35) {
        setStatusText("INITIALIZING NEURAL CORE...");
      } else if (currentPct < 70) {
        setStatusText("LOADING AI CAREER ECOSYSTEM...");
      } else if (currentPct < 95) {
        setStatusText("SECURING ENVIRONMENT...");
      } else {
        setStatusText("WELCOME TO VELFIRE");
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        handleFinish();
      }
    }, 30);

    // Keyboard support: Escape, Space, Enter to quickly skip
    const handleKeyDown = (e) => {
      if (["Escape", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        handleFinish();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`velfire-splash-root ${isExiting ? "exiting" : ""}`}
      onClick={handleFinish}
      title="Click anywhere to skip intro"
    >
      {/* Ambient core glow & rotating rings */}
      <div className="splash-ambient-core" />
      <div className="splash-ambient-ring" />
      <div className="splash-ambient-ring-inner" />

      {/* Floating ember particles */}
      <div className="splash-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="splash-particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Main Center Stage */}
      <div className="splash-stage">
        {/* Top futuristic badge */}
        <div className="splash-badge-wrapper">
          <span className="splash-badge">
            <span className="splash-badge-dot" />
            VELFIRE SYSTEM v2.0
          </span>
        </div>

        {/* Logo Wordmark: Letters arrive one by one */}
        <div className="splash-wordmark">
          {LETTERS.map((char, index) => {
            // Sequential delay: 0.28s, 0.49s, 0.70s, 0.91s, 1.12s, 1.33s, 1.54s
            const delaySec = 0.28 + index * 0.21;
            return (
              <span
                key={index}
                className="splash-char landed"
                data-char={char}
                style={{
                  animationDelay: `${delaySec}s`,
                }}
              >
                {char}
              </span>
            );
          })}

          {/* Shimmer sweep layer across whole word after letters land */}
          <div className="splash-shimmer-layer" />
        </div>

        {/* Tagline */}
        <div className="splash-tagline-wrapper">
          <div className="splash-tagline">
            <span className="splash-tagline-line left" />
            <span>AI CAREER <span className="splash-tagline-accent">OPERATING SYSTEM</span></span>
            <span className="splash-tagline-line" />
          </div>
        </div>
      </div>

      {/* Bottom Progress & Skip row */}
      <div className="splash-footer" onClick={(e) => e.stopPropagation()}>
        <div className="splash-progress-track">
          <div
            className="splash-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="splash-status-row">
          <span className="splash-status-text">
            <span>●</span> {statusText}
          </span>
          <button
            type="button"
            className="splash-skip-btn"
            onClick={handleFinish}
          >
            Skip Intro →
          </button>
        </div>
      </div>
    </div>
  );
}
