import { useEffect, useRef, useState, type TouchEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Compass,
  Eye,
  Gift,
  MapPin,
  Pause,
  RotateCcw,
  Sparkles,
  Telescope,
  Wind,
  type LucideIcon,
} from "lucide-react";

type Chapter = {
  label?: string;
  kind: string;
  icon: LucideIcon;
  theme: string;
  themeAlt: string;
};

const chapters: Chapter[] = [
  { kind: "intro", icon: Gift, theme: "14 45% 25%", themeAlt: "157 20% 20%" },
  { label: "01 — The Beginning", kind: "chapter-1", icon: Clock3, theme: "41 35% 20%", themeAlt: "14 35% 20%" },
  { label: "02 — The Journey", kind: "chapter-2", icon: Eye, theme: "201 30% 15%", themeAlt: "220 25% 15%" },
  { label: "03 — The Discovery", kind: "chapter-3", icon: Telescope, theme: "220 30% 18%", themeAlt: "280 20% 20%" },
  { label: "04 — The Challenge", kind: "chapter-4", icon: Wind, theme: "220 15% 12%", themeAlt: "240 10% 10%" },
  { label: "05 — The Turning Point", kind: "chapter-5", icon: RotateCcw, theme: "41 25% 18%", themeAlt: "20 30% 22%" },
  { label: "06 — The Conclusion", kind: "final", icon: Check, theme: "14 50% 25%", themeAlt: "41 40% 25%" },
];

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  
  useEffect(() => {
    let i = 0;
    let interval: number;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setDisplayed(text.substring(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 30);
    }, delay);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay]);
  
  return <span>{displayed}</span>;
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    const particles = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speedY: Math.random() * 0.2 + 0.05,
      speedX: (Math.random() - 0.5) * 0.1,
      opacity: Math.random() * 0.4 + 0.05
    }));
    
    let animationFrame: number;
    
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgba(255, 150, 120, 1)`;
      
      particles.forEach(p => {
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
  
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    const colors = ["#ff9f87", "#ffb4a2", "#e5989b", "#b5838d", "#ffffff"];
    const particles = Array.from({ length: 120 }).map(() => ({
      x: width / 2,
      y: height / 2 + 100,
      size: Math.random() * 6 + 3,
      speedY: (Math.random() * -12) - 6,
      speedX: (Math.random() - 0.5) * 18,
      gravity: 0.25,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1.0
    }));
    
    let animationFrame: number;
    
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      let active = false;
      
      particles.forEach(p => {
        if (p.life <= 0) return;
        active = true;
        
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
        
        p.speedY += p.gravity;
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.life -= 0.008;
      });
      
      if (active) {
        animationFrame = requestAnimationFrame(render);
      }
    };
    
    render();
    
    return () => cancelAnimationFrame(animationFrame);
  }, []);
  
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 100, pointerEvents: "none" }} />;
}

type ChapterContentProps = {
  chapter: Chapter;
  finalRevealed: boolean;
  dismissed: boolean;
  revealed: Record<string, boolean>;
  onDismiss: () => void;
  onReveal: (kind: string) => void;
  onStart: () => void;
};

function ChapterHeading({ chapter }: { chapter: Chapter }) {
  const Icon = chapter.icon;
  return (
    <div className="chapter-heading">
      {chapter.label && <p className="chapter-label">{chapter.label}</p>}
      <span className="chapter-icon" aria-hidden="true">
        <Icon size={17} strokeWidth={1.6} />
      </span>
    </div>
  );
}

function ContinueButton({
  onClick,
  label = "Continue",
  testId = "button-continue",
}: {
  onClick: () => void;
  label?: string;
  testId?: string;
}) {
  return (
    <button
      className="action-button continue-button"
      data-testid={testId}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      <span aria-hidden="true" className="arrow-circle">
        <ArrowRight size={16} strokeWidth={1.7} />
      </span>
    </button>
  );
}

function ChapterActions({
  current,
  onBack,
  onNext,
}: {
  current: number;
  onBack: () => void;
  onNext: () => void;
}) {
  const isFinal = current === chapters.length - 1;
  return (
    <nav aria-label="Letter navigation" className="chapter-actions">
      <button
        aria-label="Go back one chapter"
        className="action-button back-button"
        data-testid="button-back"
        disabled={current === 0}
        onClick={onBack}
        type="button"
      >
        <ArrowLeft size={15} strokeWidth={1.7} />
        <span>Back</span>
      </button>
      {!isFinal && <ContinueButton onClick={onNext} />}
    </nav>
  );
}

function ChapterContent({
  chapter,
  finalRevealed,
  dismissed,
  revealed,
  onDismiss,
  onReveal,
  onStart,
}: ChapterContentProps) {
  const [breaking, setBreaking] = useState(false);

  switch (chapter.kind) {
    case "intro":
      return (
        <section className="chapter intro" data-testid="chapter-intro">
          <div className="chapter-content">
            <span className="chapter-icon" aria-hidden="true">
              <Gift size={25} strokeWidth={1.35} />
            </span>
            <p className="intro-opening" data-testid="text-intro-opening">
              Welcome to the Interactive Story
            </p>
            <div className="intro-copy" data-testid="text-intro-copy">
              <span>This is a template for creating</span>
              <span>immersive, multi-chapter interactive experiences.</span>
              <span>Let's explore what you can build.</span>
            </div>
            <button
              className={`action-button intro-seal ${breaking ? "breaking" : ""}`}
              style={{
                animation: breaking ? 'seal-break 500ms ease-in forwards' : 'reveal-up 700ms 940ms both'
              }}
              data-testid="button-start-letter"
              onClick={() => {
                if (breaking) return;
                setBreaking(true);
                setTimeout(() => {
                  onStart();
                  setBreaking(false);
                }, 450);
              }}
              type="button"
            >
              <span>Begin Journey</span>
              <ArrowRight size={16} strokeWidth={1.7} />
            </button>
            <p className="swipe-hint" style={{ marginTop: '24px', fontSize: '13px', color: 'hsl(var(--paper-muted))', opacity: 0.6, animation: 'reveal-up 700ms 1400ms both' }}>
              Swipe or use arrows to navigate
            </p>
          </div>
        </section>
      );
    case "chapter-1":
    case "chapter-2":
    case "chapter-3":
    case "chapter-4":
    case "chapter-5":
      return (
        <section className="chapter" data-testid={`chapter-${chapter.kind}`}>
          <div className="chapter-content stack">
            <ChapterHeading chapter={chapter} />
            <p className="chapter-kicker">
              This is the {chapter.label?.split(" — ")[1]}
            </p>
            <p className="display-line">You can replace this content</p>
            <p className="muted-line">
              with your own story, portfolio details, or presentation points.
            </p>
            <div className="soft-card" data-testid={`card-${chapter.kind}`}>
              <p>Add interactive elements like this card.</p>
            </div>
            <button
              className="reveal-button"
              data-testid={`button-reveal-${chapter.kind}`}
              onClick={() => onReveal(chapter.kind)}
              type="button"
            >
              <Eye size={15} strokeWidth={1.7} />
              <span>
                {revealed[chapter.kind] ? "Revealed" : "Click to Reveal"}
              </span>
            </button>
            {revealed[chapter.kind] && (
              <p className="reveal-note" data-testid={`text-reveal-${chapter.kind}`}>
                <TypewriterText text="Hidden content can be revealed dynamically to engage the reader." />
              </p>
            )}
          </div>
        </section>
      );
    case "final":
      return (
        <section className="chapter final-chapter" data-testid="chapter-final">
          <div className="chapter-content">
            <ChapterHeading chapter={chapter} />
            <p className="final-lead">The End of the Template</p>
            <p className="final-main">
              Thank you for exploring this interactive experience.
            </p>
            <p className="final-signoff">Now make it your own.</p>
            {finalRevealed && (
              <p className="final-reveal" data-testid="text-final-reveal">
                ✨ Keep building great things ✨
              </p>
            )}
            <p className="dismissed-message" data-testid="text-final-note">
              This template provides a beautiful foundation with smooth animations, swipe gestures, and particle effects.
            </p>
            {!dismissed ? (
              <button
                className="action-button final-action"
                data-testid="button-back-to-reality"
                onClick={onDismiss}
                type="button"
              >
                <Check size={14} strokeWidth={1.8} />
                <span>Finish</span>
              </button>
            ) : (
              <p
                className="dismissed-message"
                data-testid="text-dismissed-message"
              >
                <TypewriterText text="Ready to create your next project." delay={200} />
              </p>
            )}
          </div>
        </section>
      );
    default:
      return null;
  }
}

function Letter() {
  const [isLoading, setIsLoading] = useState(true);
  
  const [current, setCurrent] = useState(() => {
    try {
      const saved = localStorage.getItem("interactive-story-chapter");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed < chapters.length) {
          return parsed;
        }
      }
    } catch (e) {}
    return 0;
  });
  
  const [direction, setDirection] = useState(1);
  const [finalRevealed, setFinalRevealed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tapFeedback, setTapFeedback] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const touchStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 360);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const onChange = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches);
    media.addEventListener?.("change", onChange);
    return () => {
      window.clearTimeout(timer);
      media.removeEventListener?.("change", onChange);
    };
  }, []);

  useEffect(() => {
    try {
      if (current === 0) {
        localStorage.removeItem("interactive-story-chapter");
      } else {
        localStorage.setItem("interactive-story-chapter", current.toString());
      }
    } catch (e) {}
  }, [current]);

  useEffect(() => {
    if (current !== chapters.length - 1 || finalRevealed) return;
    const timer = window.setTimeout(
      () => setFinalRevealed(true),
      reducedMotion ? 700 : 2600,
    );
    return () => window.clearTimeout(timer);
  }, [current, finalRevealed, reducedMotion]);

  const pulse = () => setTapFeedback((value) => value + 1);

  const goTo = (next: number) => {
    setCurrent((prev) => {
      const target = Math.max(0, Math.min(chapters.length - 1, next));
      if (target !== prev) {
        pulse();
        setDirection(target > prev ? 1 : -1);
        return target;
      }
      return prev;
    });
  };

  const goNext = () => goTo(current + 1);
  const goBack = () => goTo(current - 1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        goTo(current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goTo(current - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current]);

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStart.current = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 42) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goBack();
    } else if (dy < 0) {
      goNext();
    } else {
      goBack();
    }
  };

  const reveal = (kind: string) => {
    pulse();
    setRevealed((previous) => ({ ...previous, [kind]: !previous[kind] }));
  };

  if (isLoading) {
    return (
      <main className="loading-screen" data-testid="loading-screen">
        <div className="loading-mark">a little letter</div>
      </main>
    );
  }

  const chapter = chapters[current];
  const progress = (current + 1) / chapters.length;
  
  const appStyle = {
    "--theme-bg": chapter.theme,
    "--theme-bg-alt": chapter.themeAlt,
  } as React.CSSProperties;

  return (
    <main
      className="letter-app"
      style={appStyle}
      data-testid="letter-app"
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      <ParticleField />
      {finalRevealed && <Confetti />}
      
      <div className="letter-shell">
        <header className="topbar">
          <span className="wordmark">
            <BookOpen size={14} strokeWidth={1.6} aria-hidden="true" />
            <span>Interactive Story</span>
          </span>
          <div className="chapter-dots" style={{ display: 'flex', gap: '6px', alignItems: 'center', zIndex: 10 }}>
            {chapters.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                title={ch.label || "Intro"}
                style={{
                  width: current === idx ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '99px',
                  background: current === idx ? 'hsl(var(--coral))' : 'hsl(var(--paper) / .2)',
                  transition: 'all 300ms ease',
                  padding: 0,
                  border: 'none',
                  cursor: 'pointer'
                }}
                aria-label={`Go to chapter ${idx + 1}`}
              />
            ))}
          </div>
        </header>
        <div aria-hidden="true" className="progress-track">
          <div
            className="progress-fill"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        
        <div className="chapter-stage-wrapper" style={{ position: "relative", flex: 1, display: "flex", width: "100%", overflow: "hidden", pointerEvents: "none" }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? "10%" : "-10%",
                  opacity: 0,
                  filter: "blur(4px)",
                  scale: 0.98,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                  scale: 1,
                },
                exit: (dir: number) => ({
                  x: dir > 0 ? "-10%" : "10%",
                  opacity: 0,
                  filter: "blur(4px)",
                  scale: 0.98,
                }),
              }}
              initial={reducedMotion ? { opacity: 0 } : "enter"}
              animate={reducedMotion ? { opacity: 1 } : "center"}
              exit={reducedMotion ? { opacity: 0 } : "exit"}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                filter: { duration: 0.3 },
                scale: { duration: 0.3 }
              }}
              className="chapter-stage"
              data-testid="chapter-stage"
              style={{ pointerEvents: "auto" }}
            >
              <ChapterContent
                chapter={chapter}
                dismissed={dismissed}
                finalRevealed={finalRevealed}
                onDismiss={() => {
                  pulse();
                  setDismissed(true);
                }}
                onReveal={reveal}
                onStart={goNext}
                revealed={revealed}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        
        <ChapterActions current={current} onBack={goBack} onNext={goNext} />
      </div>
      <span aria-hidden="true" className="tap-ripple" key={tapFeedback} />
    </main>
  );
}

export default function App() {
  return <Letter />;
}
