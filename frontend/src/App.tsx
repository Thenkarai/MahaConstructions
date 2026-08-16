import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Lenis from "lenis";
import { FiX, FiCheck } from "react-icons/fi";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingControls from "./components/FloatingControls";
import CustomCursor from "./components/CustomCursor";
import Loader from "./components/Loader";
import CookieBanner from "./components/CookieBanner";
import NewsletterPopup from "./components/NewsletterPopup";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import Testimonials from "./pages/Testimonials";
import Calculator from "./pages/Calculator";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Pricing from "./pages/Pricing";

// Security Guard for Admin Dashboard Route Access
function ProtectedAdminRoute({ children }: { children: React.JSX.Element }) {
  const isAuth = sessionStorage.getItem("maha_admin_authenticated") === "true";
  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

// Sub-component to manage location-based layouts and smooth scroll resets
function AppLayout() {
  const location = useLocation();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const prevPath = useRef(location.pathname);

  // Trigger page transition loader on route change
  useEffect(() => {
    if (loadingComplete && prevPath.current !== location.pathname) {
      prevPath.current = location.pathname;
      setPageLoading(true);
    }
    window.scrollTo(0, 0);
  }, [location.pathname, loadingComplete]);

  // Quote Form submission states
  const [quoteForm, setQuoteForm] = useState({ name: "", email: "", phone: "", project_type: "Residential Villa", budget_range: "$5M - $10M", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (!loadingComplete) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [loadingComplete]);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("http://localhost:8000/api/leads/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteForm)
      });
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setQuoteOpen(false);
        setQuoteForm({ name: "", email: "", phone: "", project_type: "Residential Villa", budget_range: "$5M - $10M", message: "" });
      }, 2000);
    } catch (err) {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setQuoteOpen(false);
      }, 2000);
    }
  };

  const isSimpleRoute = ["/admin/login", "/admin"].includes(location.pathname) || 
                       !["/", "/services", "/projects", "/gallery", "/testimonials", "/calculator", "/pricing", "/faq", "/contact", "/privacy", "/terms"].some(p => location.pathname === p || location.pathname.startsWith("/services/") || location.pathname.startsWith("/projects/"));

  if (!loadingComplete) {
    return <Loader onComplete={() => setLoadingComplete(true)} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page Switch Transition Loader Overlay */}
      {pageLoading && (
        <Loader isPageSwitch={true} onComplete={() => setPageLoading(false)} />
      )}
      {/* Premium custom mouse follower */}
      <CustomCursor />

      {/* Navigation (Hidden on Admin screens / 404s) */}
      {!isSimpleRoute && <Navbar onRequestQuote={() => setQuoteOpen(true)} />}

      {/* Main Pages Router */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<Projects />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer (Hidden on Admin screens / 404s) */}
      {!isSimpleRoute && <Footer />}

      {/* Floating Helpers */}
      {!isSimpleRoute && (
        <>
          <FloatingControls />
          <CookieBanner />
          <NewsletterPopup />
        </>
      )}

      {/* Estimate Modal Overlay */}
      {quoteOpen && (
        <div className="fixed inset-0 bg-[#081C35]/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 text-white">
          <div className="w-full max-w-lg bg-[#0D223F] border-2 border-[#D4A437]/60 rounded-2xl p-6 sm:p-8 relative shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-y-auto max-h-[90vh] z-10 text-white">
            <button
              onClick={() => setQuoteOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-[#102949] text-[#F2C14E] hover:text-white rounded-xl border border-[#D4A437]/40 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <FiX size={18} />
            </button>

            <span className="text-[10px] tracking-[0.25em] text-[#F2C14E] font-black uppercase block mb-1">
              FREE SITE CONSULTATION &amp; ESTIMATE
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-heading uppercase mb-6 text-white">
              REQUEST FREE ESTIMATE
            </h3>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 bg-green-500/20 border-2 border-green-400 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiCheck size={28} />
                </div>
                <h4 className="text-base font-black tracking-wider uppercase mb-2 text-white">PROPOSAL REQUEST LOGGED</h4>
                <p className="text-xs text-slate-300">Our chief engineering team will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] tracking-wider text-[#F2C14E] font-extrabold block mb-1.5 uppercase">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    className="w-full bg-[#102949] border border-[#D4A437]/40 text-white text-xs sm:text-sm px-4 py-3 rounded-xl outline-none focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E] transition-all placeholder:text-slate-400 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] tracking-wider text-[#F2C14E] font-extrabold block mb-1.5 uppercase">EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                      className="w-full bg-[#102949] border border-[#D4A437]/40 text-white text-xs sm:text-sm px-4 py-3 rounded-xl outline-none focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E] transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider text-[#F2C14E] font-extrabold block mb-1.5 uppercase">TELEPHONE *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 94888 88758"
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                      className="w-full bg-[#102949] border border-[#D4A437]/40 text-white text-xs sm:text-sm px-4 py-3 rounded-xl outline-none focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E] transition-all placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] tracking-wider text-[#F2C14E] font-extrabold block mb-1.5 uppercase">PROJECT TYPE</label>
                    <select
                      value={quoteForm.project_type}
                      onChange={(e) => setQuoteForm({ ...quoteForm, project_type: e.target.value })}
                      className="w-full bg-[#102949] border border-[#D4A437]/40 text-white text-xs sm:text-sm px-4 py-3 rounded-xl outline-none focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E] transition-all cursor-pointer font-medium"
                    >
                      <option className="bg-[#0D223F] text-white">Residential Villa</option>
                      <option className="bg-[#0D223F] text-white">Commercial Shell</option>
                      <option className="bg-[#0D223F] text-white">Interior Architecture</option>
                      <option className="bg-[#0D223F] text-white">Renovation &amp; Remodeling</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider text-[#F2C14E] font-extrabold block mb-1.5 uppercase">BUDGET RANGE</label>
                    <select
                      value={quoteForm.budget_range}
                      onChange={(e) => setQuoteForm({ ...quoteForm, budget_range: e.target.value })}
                      className="w-full bg-[#102949] border border-[#D4A437]/40 text-white text-xs sm:text-sm px-4 py-3 rounded-xl outline-none focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E] transition-all cursor-pointer font-medium"
                    >
                      <option className="bg-[#0D223F] text-white">₹30 Lakhs - ₹50 Lakhs</option>
                      <option className="bg-[#0D223F] text-white">₹50 Lakhs - ₹1 Crore</option>
                      <option className="bg-[#0D223F] text-white">₹1 Crore - ₹5 Crore</option>
                      <option className="bg-[#0D223F] text-white">₹5 Crore+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] tracking-wider text-[#F2C14E] font-extrabold block mb-1.5 uppercase">SITE NOTES &amp; VISIONS</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your plot size, location, or requirements..."
                    value={quoteForm.message}
                    onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                    className="w-full bg-[#102949] border border-[#D4A437]/40 text-white text-xs sm:text-sm px-4 py-3 rounded-xl outline-none focus:border-[#F2C14E] focus:ring-1 focus:ring-[#F2C14E] transition-all resize-none placeholder:text-slate-400 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-[#F2C14E] via-[#D4A437] to-[#B8860B] hover:from-[#FBE395] hover:to-[#E2B242] text-[#081C35] font-black text-xs sm:text-sm tracking-widest uppercase rounded-xl transition-all duration-300 shadow-[0_10px_30px_rgba(242,193,78,0.4)] border-2 border-[#FFF099] cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-2"
                >
                  {submitting ? "SUBMITTING PROPOSAL..." : "SUBMIT PROPOSAL REQUEST"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
