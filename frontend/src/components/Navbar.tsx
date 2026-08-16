import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiMenu, FiX, FiArrowRight, FiPhone, FiCalendar, FiShield, FiCheckCircle } from "react-icons/fi";

interface NavbarProps {
  onRequestQuote: () => void;
}

export default function Navbar({ onRequestQuote }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { title: "HOME", path: "/" },
    { title: "PACKAGES", path: "/pricing" },
    { title: "PROJECTS", path: "/projects" },
    { title: "PROCESS", path: "/#process" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    const q = searchQuery.toLowerCase();
    if (q.includes("proj") || q.includes("work")) navigate("/projects");
    else if (q.includes("gall") || q.includes("photo")) navigate("/gallery");
    else if (q.includes("faq") || q.includes("ask")) navigate("/faq");
    else if (q.includes("contact") || q.includes("map")) navigate("/contact");
    else if (q.includes("pric") || q.includes("package") || q.includes("plan")) navigate("/pricing");
    else navigate("/projects");
    setSearchQuery("");
  };

  return (
    <>
      {/* ── 1. Thin Top Information Bar (Deep Dark Navy #081C35) ── */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#081C35] text-slate-300 text-[11px] tracking-[0.15em] font-medium text-center py-2 uppercase border-b border-[#D4A437]/20 shadow-md flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F2C14E] animate-ping inline-block" />
          <span className="text-[#F2C14E] font-extrabold flex items-center gap-1">
            <FiShield className="text-[#D4A437]" size={13} />

          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs font-semibold">
          <span className="text-slate-300 flex items-center gap-1">
            <FiCheckCircle className="text-[#F2C14E]" size={13} /> FREE SITE VISIT INCLUDED
          </span>
          <span className="text-slate-600">|</span>
          <span>
            DIRECT CALL:{" "}
            <a href="tel:+919488888758" className="text-[#F2C14E] font-black underline hover:text-white transition-colors">
              +91 94888 88758
            </a>
          </span>
        </div>

        <div className="md:hidden">
          <a href="tel:+919488888758" className="text-[#F2C14E] font-black text-[10px] flex items-center gap-1">
            <FiPhone size={11} /> +91 94888 88758
          </a>
        </div>
      </div>

      {/* ── 2. Main Floating Navigation (Luxury Frosted Dark & Floating Container) ── */}
      <header className="fixed top-[34px] left-0 w-full z-40 transition-all duration-300 px-3 md:px-6 pt-3">
        <div
          className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 px-4 md:px-6 py-3 flex items-center justify-between border ${scrolled
              ? "bg-[#081C35]/95 backdrop-blur-md border-[#D4A437]/40 shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
              : "bg-[#081C35]/85 backdrop-blur-sm border-[#D4A437]/25 shadow-xl"
            }`}
        >
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="bg-white p-1.5 rounded-xl shadow-[0_0_20px_rgba(212,164,55,0.2)] border border-[#F2C14E] group-hover:border-[#D4A437] transition-all duration-300 shrink-0">
              <img
                src="/logo.png"
                alt="MAHA CONSTRUCTIONS"
                className="h-9 md:h-11 w-auto object-contain transition-transform group-hover:scale-105"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black tracking-wider text-white font-heading uppercase leading-none">
                MAHA <span className="text-[#F2C14E]">CONSTRUCTIONS</span>
              </span>
              <span className="text-[9px] font-bold tracking-[0.25em] text-[#D4A437] uppercase mt-1">
                We Build Your Dream Home
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#102949]/90 p-1.5 rounded-full border border-[#D4A437]/30 shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.path}
                className={`px-4 py-1.5 text-[11px] font-extrabold tracking-wider uppercase rounded-full transition-all duration-200 ${isActive(link.path)
                    ? "text-[#081C35] bg-gradient-to-r from-[#F2C14E] to-[#D4A437] shadow-md font-black"
                    : "text-slate-200 hover:text-[#F2C14E] hover:bg-white/5"
                  }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Action CTAs & Mobile Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 md:p-2.5 rounded-xl text-slate-300 hover:text-[#F2C14E] bg-white/5 hover:bg-white/10 border border-[#D4A437]/30 transition-all cursor-pointer"
              title="Search"
            >
              <FiSearch size={16} />
            </button>

            {/* Premium Ultra-High-Visibility Gold CTA Button (Visible on ALL Screen Sizes!) */}
            <button
              onClick={onRequestQuote}
              className="flex items-center gap-1.5 md:gap-2 px-3 sm:px-5 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-[#F2C14E] via-[#D4A437] to-[#B8860B] hover:from-[#FBE395] hover:to-[#E2B242] text-[#081C35] font-black text-[10px] sm:text-xs tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer shadow-[0_0_25px_rgba(242,193,78,0.55)] hover:shadow-[0_0_35px_rgba(242,193,78,0.85)] border-2 border-[#FFF099] hover:scale-105 active:scale-95 shrink-0"
            >
              <FiCalendar size={15} className="stroke-[2.5] text-[#081C35] shrink-0" />
              <span className="hidden sm:inline">BOOK FREE CONSULTATION</span>
              <span className="sm:hidden">FREE CONSULT</span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:p-2.5 text-[#F2C14E] bg-[#102949] rounded-xl border border-[#D4A437]/40 lg:hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-[#081C35] z-30 flex flex-col pt-28 pb-8 px-6 lg:hidden overflow-y-auto"
          >
            <div className="space-y-2.5 flex-1">
              {navLinks.map((page) => (
                <Link
                  key={page.title}
                  to={page.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-5 py-4 rounded-xl font-bold tracking-wide uppercase text-xs transition-all ${isActive(page.path)
                      ? "bg-gradient-to-r from-[#F2C14E] to-[#D4A437] text-[#081C35] font-black"
                      : "text-slate-200 hover:bg-[#102949] hover:text-[#F2C14E] border border-[#D4A437]/20"
                    }`}
                >
                  {page.title}
                  <FiArrowRight size={14} />
                </Link>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => { setMobileMenuOpen(false); onRequestQuote(); }}
                className="w-full py-4 bg-gradient-to-r from-[#F2C14E] to-[#D4A437] text-[#081C35] font-black text-xs tracking-widest rounded-xl uppercase flex items-center justify-center gap-2 shadow-lg"
              >
                <FiCalendar size={16} /> BOOK FREE CONSULTATION
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Search Overlay ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#081C35]/95 backdrop-blur-lg z-[999] flex items-center justify-center p-6"
          >
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-8 right-8 text-white/60 hover:text-white cursor-pointer bg-white/10 rounded-full p-2"
            >
              <FiX size={22} />
            </button>
            <div className="w-full max-w-2xl">
              <p className="text-[10px] tracking-[0.4em] text-[#F2C14E] font-semibold text-center mb-6 uppercase">
                Search MAHA CONSTRUCTIONS
              </p>
              <form onSubmit={handleSearchSubmit} className="relative mb-8">
                <input
                  type="text"
                  placeholder="Search packages, projects, process..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#102949] border border-[#D4A437]/40 text-white text-xl md:text-2xl font-light text-center py-5 px-6 rounded-2xl outline-none focus:border-[#F2C14E] transition-colors placeholder:text-slate-500"
                  autoFocus
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F2C14E] hover:text-white cursor-pointer">
                  <FiArrowRight size={22} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
