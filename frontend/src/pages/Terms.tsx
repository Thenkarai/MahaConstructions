import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function Terms() {
  return (
    <div className="w-full pt-32 pb-24 bg-white min-h-[90vh]">
      <div className="max-w-2xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-1 text-xs tracking-widest text-[#D4A437] font-semibold mb-8 hover:text-[#081C35] transition-colors">
          <FiArrowLeft /> BACK
        </Link>
        <span className="text-[10px] tracking-[0.3em] text-[#D4A437] font-semibold uppercase">LEGAL SPEC</span>
        <h1 className="text-3xl font-heading font-medium text-[#081C35] uppercase tracking-wide mt-2 mb-8">TERMS OF SERVICE</h1>
        
        <div className="text-xs text-slate-700 leading-relaxed font-medium space-y-6">
          <p>Last updated: July 2026</p>
          <p>
            Welcome to Maha Construction. By navigating this site or submitting request payloads, you accept the guidelines listed below.
          </p>
          <h3 className="text-xs font-bold tracking-widest text-[#081C35] uppercase pt-4">1. ESTIMATE VALUATIONS</h3>
          <p>
            Estimates logged through form calculators represent mock ranges. Certified construction contracts are executed separately under formal engineering specs and legal agreements.
          </p>
          <h3 className="text-xs font-bold tracking-widest text-[#081C35] uppercase pt-4">2. INTELLECTUAL MONUMENTS</h3>
          <p>
            All architectural layouts, drawings, BIM coordinates, and photographic renders presented on this site are private property and protected under international copyright codes.
          </p>
        </div>
      </div>
    </div>
  );
}

