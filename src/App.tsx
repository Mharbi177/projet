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
  { label: "01 — El Retour", kind: "return", icon: Clock3, theme: "41 35% 20%", themeAlt: "14 35% 20%" },
  { label: "02 — El Timing", kind: "timing", icon: Eye, theme: "201 30% 15%", themeAlt: "220 25% 15%" },
  { label: "03 — Li na3rfou", kind: "knowing", icon: Telescope, theme: "220 30% 18%", themeAlt: "280 20% 20%" },
  { label: "04 — El Espace", kind: "space", icon: Wind, theme: "220 15% 12%", themeAlt: "240 10% 10%" },
  { label: "05 — Ba3ed lespace", kind: "after-time", icon: RotateCcw, theme: "41 25% 18%", themeAlt: "20 30% 22%" },
  { label: "06 — Ki sefert lKSA", kind: "ksa", icon: MapPin, theme: "204 25% 13%", themeAlt: "14 28% 12%" },
  { label: "07 — EL ZEBDA", kind: "point", icon: Compass, theme: "14 40% 22%", themeAlt: "30 35% 20%" },
  { label: "08 — juste pour clarifier", kind: "meta", icon: Sparkles, theme: "280 25% 20%", themeAlt: "320 25% 18%" },
  { label: "09 — Bel Ra7a no pressure ", kind: "no-pressure", icon: Pause, theme: "157 25% 18%", themeAlt: "180 25% 16%" },
  { kind: "final", icon: Check, theme: "14 50% 25%", themeAlt: "41 40% 25%" },
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
              ahla bik, ay nshalah tkoun b5ir
            </p>
            <div className="intro-copy" data-testid="text-intro-copy">
              <span>w 7abit nzid nbereklek</span>
              <span>5ater na3ref lmawdhou3 ken emahmchek yeser.</span>
              <span>Fama 7keya 7abit nfassarhelek b shwaya b shwaya.</span>
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
              <span>N7ellou l7keya</span>
              <ArrowRight size={16} strokeWidth={1.7} />
            </button>
            <p className="swipe-hint" style={{ marginTop: '24px', fontSize: '13px', color: 'hsl(var(--paper-muted))', opacity: 0.6, animation: 'reveal-up 700ms 1400ms both' }}>
              Swipe or use arrows to navigate
            </p>
          </div>
        </section>
      );
    case "return":
      return (
        <section className="chapter" data-testid="chapter-return">
          <div className="chapter-content stack">
            <ChapterHeading chapter={chapter} />
            <p className="chapter-kicker">
              Ba3d snin, Harbi rja3 y7eb ykallemek.
            </p>
            <p className="display-line">5ater fama 7ajet fik b9aw m3ah.</p>
            <p className="muted-line">
              Personnalité, 9iyam, jmel, tari9et t5amem, w barcha qualités
              okhra. w déjà crush 9dim ....
            </p>
          </div>
        </section>
      );
    case "timing":
      return (
        <section className="chapter" data-testid="chapter-timing">
          <div className="chapter-content stack">
            <ChapterHeading chapter={chapter} />
            <p className="chapter-kicker">
              Ama lezem zeda n9oullek el contexte kif ma houwa.
            </p>
            <p className="emphasis">Enti kont 5arja men relation sérieuse.</p>
            <p>Fama barcha 7ajet fi mo5ek, w ma kontich fi période sehla.</p>
            <p className="muted-line">
              W ena fi nafs el wa9t kont n7awel net9areb menek w nefhem win
              ynajem yemchi lmawdhou3.
            </p>
          </div>
        </section>
      );
    case "knowing":
      return (
        <section className="chapter" data-testid="chapter-knowing">
          <div className="chapter-content stack">
            <ChapterHeading chapter={chapter} />
            <p>
              Bdit n3aref fik chwaya b chwaya. n7awel nefhem, w nraja3 rou7i fi
              barcha details.
            </p>
            <div className="soft-card" data-testid="card-knowing">
              <p>El 7keya b9at mahech wadh7a barcha.</p>
            </div>
            <button
              className="reveal-button"
              data-testid="button-reveal-knowing"
              onClick={() => onReveal("knowing")}
              type="button"
            >
              <Eye size={15} strokeWidth={1.7} />
              <span>
                {revealed.knowing ? "Wadh7et chwaya" : "Nchoufouha men dakhel"}
              </span>
            </button>
            {revealed.knowing && (
              <p className="reveal-note" data-testid="text-reveal-knowing">
                <TypewriterText text="Mouch kol 7aja testa7a9 ijeba fi wa9tha. Ama ena kont n7eb nefhem 9bal ma na3mel ay khotwa." />
              </p>
            )}
          </div>
        </section>
      );
    case "space":
      return (
        <section className="chapter" data-testid="chapter-space">
          <div className="space-ripple-bg" aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', width: '300px', height: '300px', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: -1 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid hsl(var(--paper) / .05)', animation: 'space-ripple 4s ease-out infinite' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid hsl(var(--paper) / .02)', animation: 'space-ripple 4s ease-out infinite 2s' }} />
          </div>
          <div className="chapter-content">
            <ChapterHeading chapter={chapter} />
            <div className="line-reveal">
              <span className="display-line">
                Ki 7assit elli l7keya mahech wadh7a,
              </span>
              <span className="display-line">jbedt ro7i.</span>
            </div>
            <div className="stack-tight" style={{ marginTop: "40px" }}>
              <p>9olt na3ti espace lrou7i</p>
              <p>w lik enti zeda.</p>
              <p className="muted-line" style={{ marginTop: "16px" }}>
                Wa9tha kont nraha decision logique.
              </p>
            </div>
            <p className="bottom-note">
              Bsh nchouf rou7i akther w nfhem chnowa n7eb.
            </p>
          </div>
        </section>
      );
    case "after-time":
      return (
        <section className="chapter" data-testid="chapter-after-time">
          <div className="chapter-content">
            <ChapterHeading chapter={chapter} />
            <p className="chapter-kicker">
              Ama el wa9t t3adda, w ena zeda tfakkert akther.
            </p>
            <div className="phrase-list" data-testid="text-reflections">
              <span>Fama barcha 7ajet kont na3refhom 3lik...</span>
              <span>personnalité.</span>
              <span>a5le9.</span>
              <span>tari9et t5amem.</span>
            </div>
            <p>
              W akther ma tfakkert, akther fhemt 9addeh enti personne importante
              fi 7yeti peut être menesh fi nafs el stage mais hadhaka houwa la
              vie en rose ..
            </p>
          </div>
        </section>
      );
    case "ksa":
      return (
        <section className="chapter ksa-chapter" data-testid="chapter-ksa">
          <div aria-hidden="true" className="ksa-sky">
            <div className="shooting-star" style={{ position: 'absolute', top: '20%', right: '20%', width: '100px', height: '1px', background: 'linear-gradient(90deg, transparent, hsl(var(--paper)), transparent)', animation: 'shooting-star 6s ease-in infinite 2s' }} />
          </div>
          <div className="chapter-content ksa-copy">
            <ChapterHeading chapter={chapter} />
            <p>Ki choftek tawa, rabi sahalhlelk w bditi 7yet jdida fi KSA...</p>
            <p className="ksa-strong">l7keya wallat 7a9i9iya akther.</p>
            <div className="ksa-moment">
              {!revealed.ksa ? (
                <button
                  className="reveal-button"
                  data-testid="button-reveal-ksa"
                  onClick={() => onReveal("ksa")}
                  type="button"
                >
                  <MapPin size={15} strokeWidth={1.7} />
                  <span>El moment elli fhemt fih</span>
                </button>
              ) : (
                <p data-testid="text-reveal-ksa">
                  <TypewriterText text="Ynajem ena zeda 3malt ghalta." />
                </p>
              )}
            </div>
          </div>
        </section>
      );
    case "point":
      return (
        <section className="chapter" data-testid="chapter-point">
          <div className="chapter-content stack">
            <ChapterHeading chapter={chapter} />
            <p>Ma n7ebbech nji n9olek elli kol chay ken ghalet.</p>
            <p className="muted-line">W mouch n7eb nfar4 3lik 7atta chay.</p>
            <p className="prominent">Ama ma n7ebbech zeda mba3ed n9oul:</p>
            <p className="display-line accent-line">
              ena li jbedt ro7i w ma7aweltch.
            </p>
            <p className="muted-line">
              N7eb nchouf l7keya mara okhra, b sra7a akther.
            </p>
          </div>
        </section>
      );
    case "meta":
      return (
        <section className="chapter" data-testid="chapter-meta">
          <div className="chapter-content stack">
            <ChapterHeading chapter={chapter} />
            <p className="chapter-kicker">
              W 9bal ma ywalli el klem sérieux barcha...
            </p>
            <div className="soft-card meta-card" data-testid="card-meta">
              <p>
                n9olek fil klem hedha bsh n7otlek fi mo5ek li ena rani kima
                9otlek bekri manarach 9ritou el message wale ama menish bsh
                nsaybek lghiri akeka
              </p>
            </div>
            <button
              className="reveal-button"
              data-testid="button-reveal-meta"
              onClick={() => onReveal("meta")}
              type="button"
            >
              <Sparkles size={15} strokeWidth={1.7} />
              <span>
                {revealed.meta ? "Hakka a7la" : "El parenthèse mta3i"}
              </span>
            </button>
            {revealed.meta && (
              <p className="reveal-note" data-testid="text-reveal-meta">
                <TypewriterText text="Mafama 7atta chy . Juste 7abit nfassarlek win ena wa9ef , normalement ta3ref" />
              </p>
            )}
          </div>
        </section>
      );
    case "no-pressure":
      return (
        <section className="chapter" data-testid="chapter-no-pressure">
          <div className="chapter-content stack">
            <ChapterHeading chapter={chapter} />
            <p>Ama tawa enti fi 7yet jdida, fi new experience.</p>
            <p className="prominent">
              Ma n7ebbech men hedha kollou ta3mel 7atta décision.
            </p>
            <p className="muted-line">
              Ma fama 7atta 7aja lezem tet7sem tawa. A9ra, khoudh nafas, w
              khalli kol chay yemchi b wa9tou.
            </p>
          </div>
        </section>
      );
    case "final":
      return (
        <section className="chapter final-chapter" data-testid="chapter-final">
          <div className="chapter-content">
            <ChapterHeading chapter={chapter} />
            <p className="final-lead">El klem lkol fi phrase wa7da:</p>
            <p className="final-main">
              n7eb n3awed nchouf l7keya kifesh temchi.
            </p>
            <p className="final-signoff">Mouch lezem ijeba tawa.</p>
            {finalRevealed && (
              <p className="final-reveal" data-testid="text-final-reveal">
                w nchallah li fih l5ir ysir.
              </p>
            )}
            <p className="dismissed-message" data-testid="text-final-note">
              hanek a9ra w khw w hanek raka7 oumourek w a3tini el zebda 7atenti
              bsh na3rfou loumour kifech, na3ref new experience w barsha mhemech
              tw ama kima 9otlek man7ebech nendem wkhw
            </p>
            {!dismissed ? (
              <button
                className="action-button final-action"
                data-testid="button-back-to-reality"
                onClick={onDismiss}
                type="button"
              >
                <Check size={14} strokeWidth={1.8} />
                <span>Khalliha houni</span>
              </button>
            ) : (
              <p
                className="dismissed-message"
                data-testid="text-dismissed-message"
              >
                <TypewriterText text="Tawa khoudh wa9tek. Ma fama 7atta pression." delay={200} />
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
      const saved = localStorage.getItem("tasnim-letter-chapter");
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
        localStorage.removeItem("tasnim-letter-chapter");
      } else {
        localStorage.setItem("tasnim-letter-chapter", current.toString());
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
            <span>for Tasnim</span>
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
