import { useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiClock, FiCheck, FiMessageSquare, FiTrendingUp } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  const [activeTab, setActiveTab] = useState<"contact" | "quote">("contact");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  // Quote Form State
  const [quoteForm, setQuoteForm] = useState({ name: "", email: "", phone: "", project_type: "Residential", budget_range: "$5M - $10M", message: "" });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("http://localhost:8000/api/leads/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setStatus("success");
        setContactForm({ name: "", email: "", phone: "", message: "" });
        setMessage("Thank you. An engineering coordinator will follow up shortly.");
      } else {
        setStatus("error");
        setMessage("Submission failed. Please verify your fields.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Could not establish server connection.");
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("http://localhost:8000/api/leads/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteForm)
      });
      if (res.ok) {
        setStatus("success");
        setQuoteForm({ name: "", email: "", phone: "", project_type: "Residential", budget_range: "$5M - $10M", message: "" });
        setMessage("Quote blueprint logged. Sourcing coordinates now.");
      } else {
        setStatus("error");
        setMessage("Failed to log estimate blueprint.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Server connection failed.");
    }
  };

  return (
    <div className="w-full pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Office Contacts */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] tracking-[0.4em] text-[#D4A437] font-semibold uppercase">CONTACT CORE</span>
            <h1 className="text-3xl md:text-5xl font-black font-heading text-[#081C35] mt-3 mb-6 uppercase">
              DISCUSS YOUR LAND
            </h1>
            <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed mb-8">
              Connect with our Nagercoil office to schedule site surveys, discuss custom construction plans, or get estimate timelines.
            </p>

            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-50 border border-slate-200 flex items-center justify-center rounded-full text-[#D4A437] shrink-0">
                  <FiMapPin size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest text-[#081C35] font-bold uppercase mb-1">OFFICE ADDRESS</h4>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    Tamilmoni complex, 1st floor, ICICI Bank Upstair, Near kottar police station,Nagercoil
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-50 border border-slate-200 flex items-center justify-center rounded-full text-[#D4A437] shrink-0">
                  <FiPhone size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest text-[#081C35] font-bold uppercase mb-1">DIAL PHONE</h4>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    +91 9488888758
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-50 border border-slate-200 flex items-center justify-center rounded-full text-[#D4A437] shrink-0">
                  <FiMail size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest text-[#081C35] font-bold uppercase mb-1">EMAIL </h4>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    Mahaconstructions2013@gmail.com
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-50 border border-slate-200 flex items-center justify-center rounded-full text-[#D4A437] shrink-0">
                  <FiClock size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest text-[#081C35] font-bold uppercase mb-1">BUSINESS HOURS</h4>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    Monday - Saturday: 10:00 AM - 6:00 PM
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Social connections */}
          <div className="mt-12 flex gap-4 text-xs">
            <a href="https://wa.me/919488888758" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-green-600 font-bold hover:underline">
              <FaWhatsapp /> WHATSAPP DIRECT
            </a>
          </div>
        </div>

        {/* Right Column: Interaction form */}
        <div className="lg:col-span-7 bg-[#F8F8F8]/50 border border-slate-200 rounded-lg p-8 shadow-sm">
          {/* Form Tabs selectors */}
          <div className="flex gap-6 border-b border-slate-200 pb-4 mb-6 text-[10px] tracking-widest font-bold">
            <button
              onClick={() => {
                setActiveTab("contact");
                setStatus("idle");
              }}
              className={`pb-2 relative cursor-pointer ${activeTab === "contact" ? "text-[#D4A437] border-b-2 border-[#D4A437]" : "text-[#081C35]/60"
                }`}
            >
              GENERAL INQUIRY
            </button>
            <button
              onClick={() => {
                setActiveTab("quote");
                setStatus("idle");
              }}
              className={`pb-2 relative cursor-pointer ${activeTab === "quote" ? "text-[#D4A437] border-b-2 border-[#D4A437]" : "text-[#081C35]/60"
                }`}
            >
              REQUEST DETAILED BLUEPRINT ESTIMATE
            </button>
          </div>

          {status === "success" ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck size={20} />
              </div>
              <h4 className="text-sm font-bold tracking-widest uppercase mb-1">SUBMISSION LOGGED</h4>
              <p className="text-xs text-slate-700 max-w-sm mx-auto">{message}</p>
            </div>
          ) : (
            <>
              {activeTab === "contact" ? (
                /* Contact Form */
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="text-[9px] tracking-widest text-[#081C35]/60 font-bold block mb-1.5 uppercase">FULL NAME</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded outline-none focus:border-[#D4A437]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] tracking-widest text-[#081C35]/60 font-bold block mb-1.5 uppercase">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded outline-none focus:border-[#D4A437]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest text-[#081C35]/60 font-bold block mb-1.5 uppercase">TELEPHONE</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded outline-none focus:border-[#D4A437]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] tracking-widest text-[#081C35]/60 font-bold block mb-1.5 uppercase">INQUIRY DETAIL</label>
                    <textarea
                      rows={5}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded outline-none focus:border-[#D4A437] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-4 bg-[#081C35] hover:bg-[#D4A437] text-white hover:text-[#081C35] text-[10px] tracking-widest font-semibold rounded transition-colors uppercase cursor-pointer"
                  >
                    {status === "submitting" ? "TRANSMITTING FILE..." : "LOG GENERAL INQUIRY"}
                  </button>
                </form>
              ) : (
                /* Quote Form */
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div>
                    <label className="text-[9px] tracking-widest text-[#081C35]/60 font-bold block mb-1.5 uppercase">FULL NAME</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded outline-none focus:border-[#D4A437]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] tracking-widest text-[#081C35]/60 font-bold block mb-1.5 uppercase">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        value={quoteForm.email}
                        onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                        className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded outline-none focus:border-[#D4A437]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest text-[#081C35]/60 font-bold block mb-1.5 uppercase">TELEPHONE</label>
                      <input
                        type="tel"
                        value={quoteForm.phone}
                        onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                        className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded outline-none focus:border-[#D4A437]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] tracking-widest text-[#081C35]/60 font-bold block mb-1.5 uppercase">PROJECT SPECS</label>
                      <select
                        value={quoteForm.project_type}
                        onChange={(e) => setQuoteForm({ ...quoteForm, project_type: e.target.value })}
                        className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded outline-none focus:border-[#D4A437] cursor-pointer"
                      >
                        <option>Residential Villa</option>
                        <option>Commercial Shell</option>
                        <option>Interior Architecture</option>
                        <option>Landscape Curation</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest text-[#081C35]/60 font-bold block mb-1.5 uppercase">BUDGET SCALE</label>
                      <select
                        value={quoteForm.budget_range}
                        onChange={(e) => setQuoteForm({ ...quoteForm, budget_range: e.target.value })}
                        className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded outline-none focus:border-[#D4A437] cursor-pointer"
                      >
                        <option>₹1 Crore - ₹5 Crore</option>
                        <option>₹5 Crore - ₹10 Crore</option>
                        <option>₹10 Crore - ₹20 Crore</option>
                        <option>₹20 Crore+</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] tracking-widest text-[#081C35]/60 font-bold block mb-1.5 uppercase">SITE NOTES & VISIONS</label>
                    <textarea
                      rows={4}
                      value={quoteForm.message}
                      onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-xs px-4 py-3 rounded outline-none focus:border-[#D4A437] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-4 bg-[#D4A437] hover:bg-[#081C35] text-[#081C35] hover:text-white text-[10px] tracking-widest font-semibold rounded transition-colors uppercase cursor-pointer"
                  >
                    {status === "submitting" ? "UPLOADING CALCULATIONS..." : "SUBMIT ESTIMATE ESTIMATE"}
                  </button>
                </form>
              )}
              {status === "error" && (
                <p className="text-[10px] text-red-500 mt-2 text-center tracking-wide">{message}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mock Map Vector layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20">
        <div className="w-full h-[320px] bg-slate-50 border border-slate-200 rounded-lg overflow-hidden relative shadow-sm flex items-center justify-center p-6 text-center">
          {/* Custom styled mock vector map grid background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]" />

          <div className="relative z-10 max-w-sm">
            <FiMapPin className="text-[#D4A437] mx-auto mb-3" size={24} />
            <h4 className="text-xs font-bold tracking-widest text-[#081C35] uppercase mb-1">Maha Construction</h4>
            <p className="text-[10px] text-slate-700 font-medium">Tamilmoni complex, 1st floor, ICICI Bank Upstair, Near kottar police station,Nagercoil.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


