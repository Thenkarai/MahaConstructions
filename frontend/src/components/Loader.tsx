import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  onComplete: () => void;
  isPageSwitch?: boolean;
}

export default function Loader({ onComplete, isPageSwitch = false }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);

  useEffect(() => {
    // Smooth 600ms for page switch, 1200ms for initial load
    const duration = isPageSwitch ? 500 : 1200;
    const intervalTime = 16; // ~60fps
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setGlowPulse(true);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(onComplete, 400); // Fade transition out
          }, 200);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete, isPageSwitch]);

  // SVG Circle Measurements (Radius = 88px -> Circumference = ~552.92px)
  const radius = 88;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#081C35] select-none overflow-hidden"
        >
          {/* Centered Focal Hub */}
          <div className="relative flex items-center justify-center">

            {/* Circular Progress Ring Halo */}
            <motion.div
              animate={glowPulse ? { scale: [1, 1.04, 1] } : { scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center"
            >
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background Ring Track (Subtle Premium Guide) */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="#D4A437"
                  strokeOpacity="0.15"
                  strokeWidth={strokeWidth}
                  fill="none"
                />

                {/* Clockwise Progress Ring Fill */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="url(#goldGradient)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-[stroke-dashoffset] duration-75 ease-out"
                  style={{
                    filter: glowPulse
                      ? "drop-shadow(0px 0px 12px #F2C14E)"
                      : "drop-shadow(0px 0px 6px rgba(242, 193, 78, 0.6))",
                  }}
                />

                {/* Gold Gradient Definition */}
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4A437" />
                    <stop offset="50%" stopColor="#F2C14E" />
                    <stop offset="100%" stopColor="#D4A437" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Logo (Centered inside Progress Ring with Breathing Scale) */}
              <motion.div
                animate={{ scale: [0.98, 1, 0.98] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 m-auto w-32 h-32 md:w-36 md:h-36 bg-white rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(212,164,55,0.25)] border border-[#F2C14E]/30 p-4"
              >
                <img
                  src="/logo.png"
                  alt="MAHA CONSTRUCTIONS"
                  className="w-auto h-16 md:h-20 object-contain filter drop-shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </motion.div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
