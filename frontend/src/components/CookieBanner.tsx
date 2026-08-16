import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const [accepted, setAccepted] = useState(true); // Default true so it doesn't flash initially

  useEffect(() => {
    const consent = localStorage.getItem("maha_cookie_consent");
    if (!consent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("maha_cookie_consent", "true");
    setAccepted(true);
  };

  return (
    <AnimatePresence>
      {!accepted && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 left-6 max-w-sm bg-[#081C35]/95 border border-white/10 text-white p-6 rounded-lg shadow-2xl z-40 backdrop-blur-md"
        >
          <h4 className="text-xs font-semibold tracking-[0.2em] text-[#D4A437] mb-2">PRIVACY POLICY</h4>
          <p className="text-[11px] text-white/60 leading-relaxed mb-4">
            We use cookies to analyze web traffic and improve your browsing experience. By clicking "Accept", you consent to our use of cookies.
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-[#D4A437] text-[#081C35] text-[10px] font-semibold tracking-widest rounded hover:bg-white transition-colors cursor-pointer"
            >
              ACCEPT ALL
            </button>
            <button
              onClick={() => setAccepted(true)}
              className="px-4 py-2 bg-white/5 text-white/50 text-[10px] font-semibold tracking-widest rounded hover:bg-white/10 transition-colors cursor-pointer"
            >
              DECLINE
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

