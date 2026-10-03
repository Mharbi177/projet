const fs = require('fs');

const filePath = 'd:/tasnim-letter/replica.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace chapters array
const chaptersRegex = /const chapters: Chapter\[\] = \[[\s\S]*?\];/;
const newChapters = `const chapters: Chapter[] = [
  { kind: "intro", icon: Gift, theme: "14 45% 25%", themeAlt: "157 20% 20%" },
  { label: "01 — El Wa9t", kind: "the-wait", icon: Clock3, theme: "41 35% 20%", themeAlt: "14 35% 20%" },
  { label: "02 — El Silence", kind: "the-silence", icon: Eye, theme: "201 30% 15%", themeAlt: "220 25% 15%" },
  { label: "03 — Reality Check", kind: "the-reality", icon: Telescope, theme: "220 30% 18%", themeAlt: "280 20% 20%" },
  { label: "04 — The Door", kind: "the-door", icon: Wind, theme: "220 15% 12%", themeAlt: "240 10% 10%" },
  { kind: "final", icon: Check, theme: "14 50% 25%", themeAlt: "41 40% 25%" },
];`;
content = content.replace(chaptersRegex, newChapters);

// Replace ChapterContent switch
const switchRegex = /switch \(chapter\.kind\) \{[\s\S]*?default:\s*return null;\s*\}/;
const newSwitch = `switch (chapter.kind) {
    case "intro":
      return (
        <section className="chapter intro" data-testid="chapter-intro">
          <div className="chapter-content">
            <span className="chapter-icon" aria-hidden="true">
              <Gift size={25} strokeWidth={1.35} />
            </span>
            <p className="intro-opening" data-testid="text-intro-opening">
              ahla bik, mra okhra.
            </p>
            <div className="intro-copy" data-testid="text-intro-copy">
              <span>9olt na3mel update sghir</span>
              <span>5ater ezaman ydor.</span>
              <span>W lazem l7keya tkoun wadh7a.</span>
            </div>
            <button
              className={\`action-button intro-seal \${breaking ? "breaking" : ""}\`}
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
              <span>Nchoufou jdid</span>
              <ArrowRight size={16} strokeWidth={1.7} />
            </button>
            <p className="swipe-hint" style={{ marginTop: '24px', fontSize: '13px', color: 'hsl(var(--paper-muted))', opacity: 0.6, animation: 'reveal-up 700ms 1400ms both' }}>
              Swipe or use arrows to navigate
            </p>
          </div>
        </section>
      );
    case "the-wait":
      return (
        <section className="chapter" data-testid="chapter-the-wait">
          <div className="chapter-content stack">
            <ChapterHeading chapter={chapter} />
            <p className="chapter-kicker">
              Kont khallitlek el msg louleni
            </p>
            <p className="display-line">You had your time to read it.</p>
            <p className="muted-line">
              W t5amem w ta3ref rou7ek shnowa t7eb. Ama kima na3rfou b3adhna, ezaman ma yestanach.
            </p>
          </div>
        </section>
      );
    case "the-silence":
      return (
        <section className="chapter" data-testid="chapter-the-silence">
          <div className="chapter-content stack">
            <ChapterHeading chapter={chapter} />
            <p className="chapter-kicker">
              El silence mte3ek howa zeda ijeba.
            </p>
            <p className="emphasis">W bjeh rabi ma t9oulich busy w life happens.</p>
            <p>I get it, KSA w jaw, ama let's be real...</p>
            <div className="soft-card" data-testid="card-silence">
              <p>Li y7eb ya3ti men wa9tou ya3ti.</p>
            </div>
          </div>
        </section>
      );
    case "the-reality":
      return (
        <section className="chapter" data-testid="chapter-the-reality">
          <div className="chapter-content stack">
            <ChapterHeading chapter={chapter} />
            <p>
              Ena rja3t w 7awelt 5ater chouft fik 7ajet speciaux, w mouch naw3i nsayeb fisa3.
            </p>
            <p className="prominent">
              Ama zeda... I don't wait forever.
            </p>
            <button
              className="reveal-button"
              data-testid="button-reveal-reality"
              onClick={() => onReveal("reality")}
              type="button"
            >
              <Telescope size={15} strokeWidth={1.7} />
              <span>
                {revealed.reality ? "It is what it is" : "Chofna la79i9a"}
              </span>
            </button>
            {revealed.reality && (
              <p className="reveal-note" data-testid="text-reveal-reality">
                <TypewriterText text="W bera7a tamma, ena nest7a9 shkoun y9ader el effort." />
              </p>
            )}
          </div>
        </section>
      );
    case "the-door":
      return (
        <section className="chapter" data-testid="chapter-the-door">
          <div className="space-ripple-bg" aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', width: '300px', height: '300px', transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: -1 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid hsl(var(--paper) / .05)', animation: 'space-ripple 4s ease-out infinite' }} />
          </div>
          <div className="chapter-content">
            <ChapterHeading chapter={chapter} />
            <div className="line-reveal">
              <span className="display-line">
                The time has gone.
              </span>
            </div>
            <div className="stack-tight" style={{ marginTop: "40px" }}>
              <p>The door has closed from my side.</p>
              <p className="muted-line" style={{ marginTop: "16px" }}>
                I'm never going to reach you anymore.
              </p>
            </div>
            <p className="bottom-note">
              No regrets though, it is what it is.
            </p>
          </div>
        </section>
      );
    case "final":
      return (
        <section className="chapter final-chapter" data-testid="chapter-final">
          <div className="chapter-content">
            <ChapterHeading chapter={chapter} />
            <p className="final-lead">El zebda:</p>
            <p className="final-main">
              Rabi ywaf9ek fi 7yetek ljdida.
            </p>
            {finalRevealed && (
              <p className="final-reveal" data-testid="text-final-reveal">
                W hadha ekher update men 3andi. Ciao ✌️
              </p>
            )}
            <p className="dismissed-message" data-testid="text-final-note">
              Hanek 3rafet elli s3it w 3malt elli 3lya, w ki l9it el beb msakar... sakartou men jehti zeda. Good luck w keep shining.
            </p>
            {!dismissed ? (
              <button
                className="action-button final-action"
                data-testid="button-back-to-reality"
                onClick={onDismiss}
                type="button"
              >
                <Check size={14} strokeWidth={1.8} />
                <span>Move on</span>
              </button>
            ) : (
              <p
                className="dismissed-message"
                data-testid="text-dismissed-message"
              >
                <TypewriterText text="The end." delay={200} />
              </p>
            )}
          </div>
        </section>
      );
    default:
      return null;
  }`;

content = content.replace(switchRegex, newSwitch);

fs.writeFileSync(filePath, content);
console.log('Update complete');
