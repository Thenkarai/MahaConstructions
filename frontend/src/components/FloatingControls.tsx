import { useState, useEffect } from "react";
import { FiPhone, FiArrowUp, FiFileText, FiCalendar } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function FloatingControls() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const scrollToGuide = () => {
    const guideSection = document.getElementById("guide-section");
    if (guideSection) {
      guideSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {/* Floating Action Buttons Container */}
      <div className="flex flex-col gap-3 items-end">
        {/* Book Free Consultation Gold Floating Pill */}
        <Link
          to="/contact"
          className="group relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#F2C14E] via-[#D4A437] to-[#B8860B] hover:from-[#FBE395] hover:to-[#E2B242] text-[#081C35] rounded-2xl border-2 border-[#FFF099] shadow-[0_0_25px_rgba(242,193,78,0.7)] transition-all duration-300 hover:scale-110 hover:-translate-x-1 cursor-pointer"
          title="Book Free Consultation"
        >
          <FiCalendar size={22} className="stroke-[2.5] text-[#081C35]" />
          
          <span className="absolute right-14 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none bg-[#081C35] text-[#F2C14E] border border-[#D4A437]/40 text-[10px] font-black tracking-wider uppercase px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap">
            Book Free Consultation
          </span>
        </Link>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/919488888758?text=Hello%20Er.%20Maha%20Rajan,%20I%20want%20to%20consult%20for%20my%20luxury%20home%20construction."
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-12 h-12 bg-[#081C35] hover:bg-[#25D366] text-white rounded-2xl border-2 border-[#D4A437]/50 hover:border-[#25D366] shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 hover:-translate-x-1 cursor-pointer backdrop-blur-md"
          title="WhatsApp Us"
        >
          <FaWhatsapp size={22} className="text-[#25D366] group-hover:text-white transition-colors" />
          
          {/* Tooltip */}
          <span className="absolute right-14 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none bg-[#081C35] text-[#F2C14E] border border-[#D4A437]/40 text-[10px] font-black tracking-wider uppercase px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap">
            WhatsApp Direct
          </span>
        </a>

        {/* Call Button */}
        <a
          href="tel:+919488888758"
          className="group relative flex items-center justify-center w-12 h-12 bg-[#081C35] hover:bg-gradient-to-r hover:from-[#F2C14E] hover:to-[#D4A437] text-white rounded-2xl border-2 border-[#D4A437]/50 hover:border-[#F2C14E] shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 hover:-translate-x-1 cursor-pointer backdrop-blur-md"
          title="Call Engineer Directly"
        >
          <FiPhone size={20} className="text-[#F2C14E] group-hover:text-[#081C35] transition-colors" />
          
          <span className="absolute right-14 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none bg-[#081C35] text-[#F2C14E] border border-[#D4A437]/40 text-[10px] font-black tracking-wider uppercase px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap">
            Call Engineer
          </span>
        </a>

        {/* Free Guide PDF Button */}
        <button
          onClick={scrollToGuide}
          className="group relative flex items-center justify-center w-12 h-12 bg-[#081C35] hover:bg-[#102949] text-white rounded-2xl border-2 border-[#D4A437]/50 hover:border-[#F2C14E] shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-110 hover:-translate-x-1 cursor-pointer backdrop-blur-md"
          title="Download Free Builder Guide"
        >
          <FiFileText size={20} className="text-[#F2C14E] transition-colors" />
          
          <span className="absolute right-14 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none bg-[#081C35] text-[#F2C14E] border border-[#D4A437]/40 text-[10px] font-black tracking-wider uppercase px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap">
            Free Home Guide
          </span>
        </button>
      </div>

      {/* Back to top button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="mt-2 w-12 h-12 bg-gradient-to-r from-[#F2C14E] to-[#D4A437] text-[#081C35] hover:from-[#FBE395] hover:to-[#E2B242] rounded-2xl flex items-center justify-center shadow-[0_10px_25px_rgba(212,164,55,0.4)] transition-all duration-300 hover:scale-110 cursor-pointer border-2 border-[#F2C14E]"
          aria-label="Scroll to top"
        >
          <FiArrowUp size={20} className="stroke-[3]" />
        </button>
      )}
    </div>
  );
}
