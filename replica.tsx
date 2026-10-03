import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function App() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // A slight delay adds to the dramatic, serious effect
    const timer = setTimeout(() => setShow(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#050505',
      color: '#ededed',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '24px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : 10, filter: show ? 'blur(0px)' : 'blur(4px)' }}
        transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          maxWidth: '380px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <Lock size={20} color="#666" strokeWidth={1.5} />
        </div>

        <h1 style={{
          fontSize: '22px',
          fontWeight: '400',
          letterSpacing: '-0.02em',
          marginBottom: '16px',
          color: '#e5e5e5'
        }}>
          Mar7be marra a5ira
        </h1>

        <p style={{
          fontSize: '15px',
          lineHeight: '1.6',
          color: '#737373',
          margin: '0',
          fontWeight: '400',
          whiteSpace: 'pre-wrap'
        }}>
          manarach 3lik tawa rja3t bsh ta9ra li ba3ethhoulek 3andi allah wa3lem 9addeh.
          ama lwa9t yejri, w menish bsh no93ed nestanna fik...

          soyons réalistes, ken 7abbit t5ases wa9et rak 5asastou.
          5ater mata3rach inti, ena belli 3andi fi rasi, 5asastlek wa9ti lkol.

          W 7aja a5ira:
          "I'm never going to reach you anymore. I did what I had to do and more, and you know that."

          hedha li 7abbit nwasalhoulek. Good luck in Saudi Arabia.
          Best Regards , El 7arbi
        </p>
      </motion.div>
    </main>
  );
}
