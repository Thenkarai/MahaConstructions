import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function PrivacyPolicy() {
  return (
    <div className="w-full pt-32 pb-24 bg-white min-h-[90vh]">
      <div className="max-w-2xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-1 text-xs tracking-widest text-[#D4A437] font-semibold mb-8 hover:text-[#081C35] transition-colors">
          <FiArrowLeft /> BACK
        </Link>
        <span className="text-[10px] tracking-[0.3em] text-[#D4A437] font-semibold uppercase">LEGAL SPEC</span>
        <h1 className="text-3xl font-heading font-medium text-[#081C35] uppercase tracking-wide mt-2 mb-8">PRIVACY DISCLOSURES</h1>
        
        <div className="text-xs text-slate-700 leading-relaxed font-medium space-y-6">
          <p>Last updated: July 2026</p>
          <p>
            Maha Construction is committed to protecting your privacy. This statement explains our practices regarding data collected through contact inquiries, estimate calculators, and newsletter subscriptions.
          </p>
          <h3 className="text-xs font-bold tracking-widest text-[#081C35] uppercase pt-4">1. DATA LOGGING</h3>
          <p>
            We process parameters submitted directly by you (name, email, telephone coordinates) solely to compile project blueprints and estimate schedules.
          </p>
          <h3 className="text-xs font-bold tracking-widest text-[#081C35] uppercase pt-4">2. SECURITY CRITERIA</h3>
          <p>
            All submitted payloads are stored behind encrypted database parameters. Access credentials to admin dashboard databases are limited to certified engineering managers.
          </p>
        </div>
      </div>
    </div>
  );
}

