import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiArrowRight } from "react-icons/fi";

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const dismissed = sessionStorage.getItem("maha_newsletter_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 5000); // 5 second delay
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("maha_newsletter_dismissed", "true");
    setOpen(false);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("http://localhost:8000/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setEmail("");
        setMessage("Welcome to our mailing list.");
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setStatus("error");
        setMessage(data.detail || "Subscribing failed.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Could not connect to service.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 bg-[#081C35]/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-[#081C35] border border-white/10 rounded-xl p-8 relative text-white shadow-2xl overflow-hidden"
          >
            {/* Design detail */}
            <div className="absolute right-[-20%] top-[-20%] w-60 h-60 border border-white/5 rounded-full pointer-events-none" />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer"
            >
              <FiX size={18} />
            </button>

            <div className="text-center">
              <span className="text-[10px] tracking-[0.25em] text-[#D4A437] font-semibold">MAHA INSIGHTS</span>
              <h3 className="text-2xl font-bold tracking-wider font-heading mt-3 mb-2">JOIN OUR COMMUNITY</h3>
              <p className="text-xs text-white/60 leading-relaxed mb-6">
                Get monthly updates on contemporary architectural design, luxury properties, and urban engineering trends.
              </p>

              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading" || status === "success"}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-xs px-4 py-3.5 rounded outline-none focus:border-[#D4A437] transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="absolute right-2 top-2 p-2 text-[#D4A437] hover:text-white transition-colors cursor-pointer"
                >
                  {status === "success" ? <FiCheck size={16} /> : <FiArrowRight size={16} />}
                </button>
              </form>

              {message && (
                <p className={`text-[10px] mt-3 tracking-wide ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                  {message}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

