import { useEffect, useRef, useState } from "react";

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.2 + 0.3,
      speedY: Math.random() * 0.15 + 0.04,
      speedX: (Math.random() - 0.5) * 0.08,
      opacity: Math.random() * 0.3 + 0.05,
    }));

    let animationFrame: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgba(255, 130, 100, 1)`;
      particles.forEach((p) => {
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
      });
      animationFrame = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

function LockIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block" }}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function App() {
  const [tick, setTick] = useState(0);

  // subtle pulse on the lock every few seconds
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <ParticleField />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
          textAlign: "center",
          fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
        }}
      >
        {/* Lock icon */}
        <div
          key={tick}
          style={{
            color: "hsl(14 69% 69%)",
            marginBottom: "32px",
            animation: "lock-pulse 600ms ease both",
          }}
        >
          <LockIcon />
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 300,
            fontSize: "clamp(1.6rem, 5vw, 2.6rem)",
            lineHeight: 1.25,
            color: "hsl(43 38% 92%)",
            margin: "0 0 20px",
            maxWidth: "480px",
            animation: "fade-up 700ms 100ms both",
          }}
        >
          This page is no longer available.
        </h1>

        {/* Divider */}
        <div
          style={{
            width: "40px",
            height: "1px",
            background: "hsl(41 24% 30%)",
            margin: "0 auto 28px",
            animation: "fade-up 700ms 200ms both",
          }}
        />

        {/* Subtext — the real message */}
        <p
          style={{
            fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
            color: "hsl(38 15% 62%)",
            lineHeight: 1.75,
            maxWidth: "380px",
            margin: "0 0 16px",
            animation: "fade-up 700ms 300ms both",
          }}
        >
          The letter was written for a specific moment in time.
          <br />
          That moment has passed.
        </p>

        <p
          style={{
            fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
            color: "hsl(38 15% 45%)",
            lineHeight: 1.7,
            maxWidth: "340px",
            margin: "0 0 48px",
            fontStyle: "italic",
            animation: "fade-up 700ms 450ms both",
          }}
        >
          If you're here, you already know what it said.
          <br />
          The question is what you do with that.
        </p>

        {/* Footer tag */}
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "hsl(38 15% 35%)",
            animation: "fade-up 700ms 600ms both",
          }}
        >
          — M
        </span>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Fraunces:opsz,wght@9..144,300;9..144,400&display=swap');

          @keyframes fade-up {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          @keyframes lock-pulse {
            0%   { transform: scale(1);    opacity: 1; }
            30%  { transform: scale(1.18); opacity: 0.7; }
            60%  { transform: scale(0.95); opacity: 1; }
            100% { transform: scale(1);    opacity: 1; }
          }
        `}</style>
      </main>
    </>
  );
}
