import { useEffect, useRef, useState } from "react";
import "./AnimatedCursor.css";

export default function AnimatedCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef(null);

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shockwaves, setShockwaves] = useState([]);

  useEffect(() => {
    // Check if device supports fine hover (desktop mouse)
    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isTouchDevice) return;

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive elements
      const target = e.target;
      const interactiveEl = target.closest(
        "a, button, input, textarea, select, [role='button'], .clickable, .card, [tabindex]:not([tabindex='-1']), .splash-char, .login-container"
      );
      setIsHovering(Boolean(interactiveEl));
    };

    const onMouseDown = (e) => {
      setIsClicking(true);
      // Spawn a ripple shockwave
      const newShockwave = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setShockwaves((prev) => [...prev.slice(-3), newShockwave]);
    };

    const onMouseUp = () => {
      setIsClicking(false);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth 60/120fps physics loop using requestAnimationFrame & Lerp
    const render = () => {
      // Direct positioning for dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Smooth lag / fluid inertia for outer ring
      const lerpSpeed = 0.22;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpSpeed;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpSpeed;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  // Clean up completed shockwaves after animation duration
  useEffect(() => {
    if (shockwaves.length > 0) {
      const timer = setTimeout(() => {
        setShockwaves((prev) => prev.slice(1));
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [shockwaves]);

  return (
    <div
      className={`custom-cursor-container ${!isVisible ? "hidden" : ""} ${
        isHovering ? "hovering" : ""
      } ${isClicking ? "clicking" : ""}`}
    >
      {/* Inner precise dot */}
      <div ref={dotRef} className="cursor-dot" />

      {/* Trailing luminous follower ring */}
      <div ref={ringRef} className="cursor-ring" />

      {/* Dynamic click shockwaves */}
      {shockwaves.map((sw) => (
        <div
          key={sw.id}
          className="cursor-shockwave"
          style={{
            transform: `translate3d(${sw.x}px, ${sw.y}px, 0) translate(-50%, -50%)`,
          }}
        />
      ))}
    </div>
  );
}
