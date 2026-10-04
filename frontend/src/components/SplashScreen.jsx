import { useState, useEffect, useMemo } from "react";
import "./SplashScreen.css";

const LETTERS = ["V", "E", "L", "L", "I", "F", "E"];

export default function SplashScreen({ onComplete }) {
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
    }, 500);
  };

  useEffect(() => {
    // Total duration: allows letters to land one-by-one + shimmer sweep
    const timer = setTimeout(() => {
      handleFinish();
    }, 2500);

    // Keyboard support: Escape, Space, Enter to skip immediately
    const handleKeyDown = (e) => {
      if (["Escape", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        handleFinish();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`vellife-splash-root ${isExiting ? "exiting" : ""}`}
      onClick={handleFinish}
      title="Click anywhere to continue"
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

      {/* Main Center Stage: ONLY the animated title */}
      <div className="splash-stage">
        <div className="splash-wordmark">
          {LETTERS.map((char, index) => {
            // Sequential delay: 0.25s, 0.45s, 0.65s, 0.85s, 1.05s, 1.25s, 1.45s
            const delaySec = 0.25 + index * 0.2;
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
      </div>
    </div>
  );
}
