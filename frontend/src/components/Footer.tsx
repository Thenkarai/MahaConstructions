import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiShield, FiCheckCircle } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setMessage("Thank you! You have subscribed to our construction newsletter.");
    }, 800);
  };

  return (
    <footer className="bg-[#081C35] text-slate-300 border-t border-[#D4A437]/30 pt-16 pb-10 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4A437]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#D4A437]/20">
        
        {/* Column 1: Brand Info & Logo */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-white p-1.5 rounded-xl shadow-[0_0_20px_rgba(212,164,55,0.2)] border border-[#F2C14E] group-hover:border-[#D4A437] transition-all duration-300 shrink-0">
                <img 
                  src="/logo.png" 
                  alt="MAHA CONSTRUCTIONS" 
                  className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-wider text-white font-heading uppercase leading-none">
                  MAHA <span className="text-[#F2C14E]">CONSTRUCTIONS</span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.25em] text-[#D4A437] uppercase mt-1">
                  We Build Your Dream Home
                </span>
              </div>
            </Link>
            <p className="mt-5 text-slate-300 text-xs md:text-sm leading-relaxed font-normal">
              Building luxury homes with quality, itemized transparency and trust. Er. Maha Rajan (Government Registered Engineer) leading 10+ years of structural engineering excellence across Tamil Nadu.
            </p>
          </div>

          {/* Social Icons */}
          <div className="mt-6 flex items-center gap-3">
            <a href="https://www.facebook.com/share/17Adgojfej/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#102949] border border-[#D4A437]/30 hover:border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2] hover:text-white rounded-xl flex items-center justify-center transition-all shadow-md">
              <FaFacebookF size={16} />
            </a>
            <a href="https://www.instagram.com/mahaconstructions_2013?igsh=amF2M2VhMmFwMnU0" target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#102949] border border-[#D4A437]/30 hover:border-[#E1306C] text-[#E1306C] hover:bg-[#E1306C] hover:text-white rounded-xl flex items-center justify-center transition-all shadow-md">
              <FaInstagram size={16} />
            </a>
            <a href="https://wa.me/919488888758" target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#102949] border border-[#D4A437]/30 hover:border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-xl flex items-center justify-center transition-all shadow-md">
              <FaWhatsapp size={16} />
            </a>
            <a href="https://www.youtube.com/@mahaconstructions2013" target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#102949] border border-[#D4A437]/30 hover:border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-xl flex items-center justify-center transition-all shadow-md">
              <FaYoutube size={16} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="lg:col-span-2">
          <h4 className="text-xs font-black tracking-[0.2em] text-[#F2C14E] mb-4 uppercase">QUICK LINKS</h4>
          <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
            <li><Link to="/" className="hover:text-[#F2C14E] transition-colors">· Home</Link></li>
            <li><Link to="/pricing" className="hover:text-[#F2C14E] transition-colors">· Packages</Link></li>
            <li><Link to="/projects" className="hover:text-[#F2C14E] transition-colors">· Projects</Link></li>
            <li><a href="/#process" className="hover:text-[#F2C14E] transition-colors">· Process</a></li>
          </ul>
        </div>

        {/* Column 3: Our Services */}
        <div className="lg:col-span-3">
          <h4 className="text-xs font-black tracking-[0.2em] text-[#F2C14E] mb-4 uppercase">OUR SERVICES</h4>
          <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
            <li className="hover:text-[#F2C14E] transition-colors">· Luxury Residential Construction</li>
            <li className="hover:text-[#F2C14E] transition-colors">· Villa & Bungalow Construction</li>
            <li className="hover:text-[#F2C14E] transition-colors">· Premium Interior Fitouts</li>
            <li className="hover:text-[#F2C14E] transition-colors">· Structural Engineering Audits</li>
            <li className="hover:text-[#F2C14E] transition-colors">· 3D Architectural Elevation & Vastu</li>
            <li className="hover:text-[#F2C14E] transition-colors">· Government Approval Processing</li>
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div className="lg:col-span-3">
          <h4 className="text-xs font-black tracking-[0.2em] text-[#F2C14E] mb-4 uppercase">CONTACT US</h4>
          <ul className="space-y-3 text-xs text-slate-300 font-medium">
            <li className="flex items-start gap-2.5">
              <FiPhone className="text-[#F2C14E] mt-0.5 shrink-0" size={15} />
              <span>Office: +91 94888 88758 / Engr: +91 90959 29543</span>
            </li>
            <li className="flex items-center gap-2.5">
              <FiMail className="text-[#F2C14E] shrink-0" size={15} />
              <span>Mahaconstructions2013@gmail.com</span>
            </li>
            <li className="flex items-center gap-2.5">
              <FiGlobe className="text-[#F2C14E] shrink-0" size={15} />
              <span>www.mahaconstructions.com</span>
            </li>
            <li className="flex items-start gap-2.5">
              <FiMapPin className="text-[#F2C14E] mt-0.5 shrink-0" size={15} />
              <span>Tamilmoni complex, 1st floor, ICICI Bank Upstair, Near kottar police station, Nagercoil</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Map Widget Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 border-b border-[#D4A437]/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <FiMapPin className="text-[#F2C14E]" size={18} />
          <span><strong>Office Location:</strong> Nagercoil, Kanyakumari, Tamil Nadu</span>
        </div>
        <a 
          href="https://maps.google.com/?q=Tamilmoni+complex,+1st+floor,+ICICI+Bank+Upstair,+Near+kottar+police+station,+Nagercoil" 
          target="_blank" 
          rel="noreferrer"
          className="px-4 py-2 bg-[#102949] border border-[#D4A437]/40 hover:border-[#F2C14E] text-[#F2C14E] hover:bg-[#F2C14E] hover:text-[#081C35] text-xs font-bold rounded-xl transition-all shadow-md"
        >
          VIEW ON GOOGLE MAPS
        </a>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-400 font-medium gap-3">
        <div>
          © {new Date().getFullYear()} MAHA CONSTRUCTIONS. Er. Maha Rajan (Government Registered Engineer). All Rights Reserved.
        </div>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-[#F2C14E] transition-colors">Privacy Policy</Link>
          <span className="text-slate-700">|</span>
          <Link to="/terms" className="hover:text-[#F2C14E] transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
