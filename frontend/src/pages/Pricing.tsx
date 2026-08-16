import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck, FiX, FiArrowRight, FiStar, FiShield, FiClock,
  FiChevronDown, FiZap, FiHome, FiBriefcase
} from "react-icons/fi";

const FALLBACK_PACKAGES = [
  {
    id: 1, division: "residential", tier: "basic",
    title: "Basic Plan", subtitle: "Solid & Affordable",
    price_per_sqft: 1999,
    description: "A solid, cost-effective residential build using quality materials, standard-grade finishes, and proven structural systems — ideal for budget-conscious homeowners.",
    features: ["Fe-500 TMT Steel", "Coromandel / ACC Cement", "M-Sand Blockwork", "Vitrified Tiles (2×2 ft)", "Parryware CP Fittings", "Kundan / Anchor Wiring", "Flush Door Entry", "Asian Paints Emulsion"],
    inclusions: ["Site supervision", "Civil structural work", "Plastering & waterproofing", "Electrical wiring (concealed)", "Plumbing works", "Toilet sanitary fixtures", "Main door with frame"],
    exclusions: ["Interior design", "Modular kitchen", "Landscaping", "Smart home systems"],
    is_highlighted: false, warranty_years: 10, delivery_months: 12,
  },
  {
    id: 2, division: "residential", tier: "premium",
    title: "Premium Plan", subtitle: "Quality & Elegance",
    price_per_sqft: 2399,
    description: "Superior materials, polished finishes, and enhanced structural systems — built for growing families seeking elevated quality and lasting value.",
    features: ["Fe-550 TMT (JSW / Vizag Steel)", "Ultratech Premium / Dalmia Cement", "Double-washed M-Sand", "Kajaria Tiles (4×2 ft)", "Jaquar Sanitary & CP Sets", "Polycab Wires & Roma Switches", "Teak Wood Entry Door", "Asian Paints Apex Ultima"],
    inclusions: ["All Basic inclusions", "Modular kitchen carcass", "Premium tile work", "CCTV provision", "Power backup provision", "Gypsum ceiling (living areas)"],
    exclusions: ["Interior furniture", "Landscaping", "Smart automation"],
    is_highlighted: true, warranty_years: 15, delivery_months: 14,
  },
  {
    id: 3, division: "residential", tier: "luxury",
    title: "Luxury Plan", subtitle: "Elite Craftsmanship",
    price_per_sqft: 2999,
    description: "A fully bespoke luxury residential build using world-class materials, custom architectural details, and premium brand fixtures — crafted for discerning homeowners.",
    features: ["Fe-550 TMT (Tata Tiscon / JSPL)", "Birla Super / ACC Gold Cement", "Premium River Sand", "Italian Travertine / Marble Slabs", "Kohler / Grohe Collection", "Finolex & Legrand Switches", "First-Grade Carved Teak Doors", "Royale Textured / Custom Finish"],
    inclusions: ["All Premium inclusions", "Full modular kitchen", "Smart home pre-wiring", "Home theatre provision", "Landscape design (basic)", "Custom ceiling designs", "Premium bathroom accessories"],
    exclusions: ["Smart home devices", "Furniture & furnishings"],
    is_highlighted: false, warranty_years: 20, delivery_months: 18,
  },
  {
    id: 4, division: "commercial", tier: "basic",
    title: "Standard Shell", subtitle: "Functional & Efficient",
    price_per_sqft: 2199,
    description: "A functional, code-compliant commercial shell ideal for office spaces, retail outlets, and light commercial use — efficient and cost-effective at scale.",
    features: ["Fe-500 TMT Structural Steel", "OPC 53 Grade Cement", "RCC Framed Structure", "Vitrified Floor Tiles", "Standard Plumbing Systems", "Industrial-Grade Wiring", "Aluminium Doors & Windows", "Exterior Cement Texture Paint"],
    inclusions: ["Core structural work", "Basic MEP (Electrical & Plumbing)", "Slab & Column Concrete", "External Plastering", "Staircase with MS Railing", "Commercial Flooring", "Terrace Waterproofing"],
    exclusions: ["Interior partitions", "HVAC systems", "False ceiling", "Fire safety systems"],
    is_highlighted: false, warranty_years: 10, delivery_months: 14,
  },
  {
    id: 5, division: "commercial", tier: "premium",
    title: "Premium Corporate", subtitle: "Professional & Polished",
    price_per_sqft: 2799,
    description: "A professional-grade commercial building with premium structural detailing, enhanced MEP systems, and modern facade finishes — suited for corporate offices and retail centres.",
    features: ["Fe-550 TMT (JSW Steel)", "Ultratech / Ambuja Cement", "RCC Frame + Shear Walls", "Granite / Double Charged Vitrified", "Jaquar / Hindware Fixtures", "Polycab Wires + RCCB MCB Panel", "Anodized Aluminium UPVC", "Texture + Reflective Glass Curtain"],
    inclusions: ["All Shell inclusions", "False ceiling provision", "Lift pit & motor room", "HVAC duct provision", "Fire hydrant system", "CCTV & access control provision", "DG set provision"],
    exclusions: ["Fit-out interiors", "IT infrastructure", "Furniture"],
    is_highlighted: true, warranty_years: 15, delivery_months: 18,
  },
  {
    id: 6, division: "commercial", tier: "luxury",
    title: "Elite Commercial", subtitle: "Iconic Architecture",
    price_per_sqft: 3499,
    description: "An iconic high-end commercial tower built to global standards — with curtain wall facades, high-capacity MEP systems, and architectural features that define city skylines.",
    features: ["Fe-550D TMT (SAIL / JSPL)", "Birla Aditya / ACC Gold Cement", "Post-Tensioned Slabs", "Stone Cladding / Premium Marble", "Geberit / TOTO Fixtures", "Legrand Mosaic / Schneider Systems", "Structural Glazing Curtain Wall", "EIFS / Metal Composite Facade"],
    inclusions: ["All Premium inclusions", "Intelligent BMS System", "Full Fire Suppression System", "VRF HVAC System", "High-Speed Elevator System", "Basement Parking Structure", "LEED Compliance", "Architectural Lighting Design"],
    exclusions: ["Tenant fit-out works", "IT & AV systems"],
    is_highlighted: false, warranty_years: 20, delivery_months: 24,
  },
];

const SPEC_TABLE: Record<string, { spec: string; basic: string; premium: string; luxury: string }[]> = {
  residential: [
    { spec: "Structural Steel", basic: "Fe-500 TMT (Standard)", premium: "Fe-550 TMT (JSW / Vizag)", luxury: "Fe-550 TMT (Tata Tiscon / JSPL)" },
    { spec: "Cement Quality", basic: "Coromandel / ACC", premium: "Ultratech Premium / Dalmia", luxury: "Birla Super / ACC Gold" },
    { spec: "Sand & Aggregates", basic: "M-Sand blockwork", premium: "Double-washed M-Sand", luxury: "Premium river sand" },
    { spec: "Floor Tiles", basic: "Vitrified tiles (2×2 ft)", premium: "Kajaria double charged (4×2 ft)", luxury: "Italian Travertine / Marble slabs" },
    { spec: "Bathroom Fittings", basic: "Parryware / Metro CP", premium: "Jaquar sanitary & CP sets", luxury: "Kohler / Grohe premium" },
    { spec: "Electrical Wiring", basic: "Kundan / Anchor wires", premium: "Polycab + Roma switches", luxury: "Finolex + Legrand switches" },
    { spec: "Main Door", basic: "Solid flush door", premium: "Teak wood luxury door", luxury: "First-grade carved Teak" },
    { spec: "Wall Finish", basic: "Asian Paints Emulsion", premium: "Apex Ultima weather coat", luxury: "Royale textured / custom panels" },
    { spec: "Structural Warranty", basic: "10 Years", premium: "15 Years", luxury: "20 Years" },
    { spec: "Delivery Timeline", basic: "12 Months", premium: "14 Months", luxury: "18 Months" },
  ],
  commercial: [
    { spec: "Structural Steel", basic: "Fe-500 TMT (Standard)", premium: "Fe-550 TMT (JSW Steel)", luxury: "Fe-550D (SAIL / JSPL)" },
    { spec: "Cement Quality", basic: "OPC 53 Grade", premium: "Ultratech / Ambuja", luxury: "Birla Aditya / ACC Gold" },
    { spec: "Slab System", basic: "RCC Flat Slab", premium: "RCC + Shear walls", luxury: "Post-tensioned slabs" },
    { spec: "Floor Finish", basic: "Vitrified tiles", premium: "Granite / double-charged", luxury: "Stone cladding / marble" },
    { spec: "Plumbing Fixtures", basic: "Standard commercial", premium: "Jaquar / Hindware", luxury: "Geberit / TOTO" },
    { spec: "Electrical", basic: "Industrial-grade wiring", premium: "Polycab + RCCB MCB", luxury: "Legrand Mosaic / Schneider" },
    { spec: "Facade / Windows", basic: "Aluminium system", premium: "Anodized Aluminium UPVC", luxury: "Structural glazing curtain wall" },
    { spec: "MEP Systems", basic: "Basic MEP bundle", premium: "HVAC duct + fire hydrant", luxury: "VRF HVAC + BMS" },
    { spec: "Structural Warranty", basic: "10 Years", premium: "15 Years", luxury: "20 Years" },
    { spec: "Delivery Timeline", basic: "14 Months", premium: "18 Months", luxury: "24 Months" },
  ],
};

const FAQS = [
  {
    q: "What does the per-square-foot rate include?",
    a: "The rate covers the complete turnkey construction — structural civil work, MEP systems (electrical, plumbing, sanitary), flooring, plastering, painting, and handover — as detailed per package tier."
  },
  {
    q: "Are material brands fixed, or can we upgrade?",
    a: "The listed brands are the minimum standard for each tier. You may upgrade individual specifications at a differential cost, with written approval from both parties."
  },
  {
    q: "Is the warranty written and legally binding?",
    a: "Yes. All structural warranties are backed by a registered warranty certificate delivered at handover. Civil structural defects are remedied at zero additional cost during the warranty period."
  },
  {
    q: "How is payment scheduled during construction?",
    a: "Payments follow a 10-phase milestone model — Booking → Foundation → Plinth → Slab → Brickwork → Plastering → Flooring → Painting → Fixtures → Handover — tied to verified physical progress."
  },
  {
    q: "What is excluded from all packages?",
    a: "External landscaping beyond the compound wall, interior furniture and furnishings, smart home automation devices, and statutory approval fees are outside the package scope."
  },
  {
    q: "Can I get a custom quotation for my plot?",
    a: "Absolutely. Use our Cost Calculator for an instant estimate, or contact us for a detailed custom quotation from our principal engineers — completely free of charge."
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [division, setDivision] = useState<"residential" | "commercial">("residential");
  const [packages, setPackages] = useState<any[]>(FALLBACK_PACKAGES);
  const [showTable, setShowTable] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/packages")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setPackages(data); })
      .catch(() => {});
  }, []);

  const visiblePackages = packages
    .filter((p) => p.division === division)
    .sort((a, b) => a.price_per_sqft - b.price_per_sqft);

  const tierGradient = (tier: string) =>
    tier === "basic" ? "from-slate-400 to-slate-600" :
    tier === "premium" ? "from-amber-400 to-amber-600" :
    "from-violet-400 to-violet-700";

  const tierBadge = (tier: string) =>
    tier === "basic" ? "bg-slate-100 text-slate-700" :
    tier === "premium" ? "bg-amber-100 text-amber-800" :
    "bg-violet-100 text-violet-800";

  return (
    <div className="w-full bg-slate-50">

      {/* ── Hero ── */}
      <section className="relative bg-[#081C35] text-white overflow-hidden pt-40 pb-28">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#D4A437]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-[11px] tracking-[0.4em] text-[#D4A437] font-bold uppercase block mb-4"
          >
            Maha Construction — Transparent Pricing
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black font-heading leading-none mb-6 text-white uppercase tracking-tight"
          >
            CONSTRUCTION <span className="text-[#D4A437]">PRICING</span> PLANS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base text-white max-w-2xl mx-auto font-medium leading-relaxed mb-10"
          >
            Honest, all-inclusive per-square-foot construction rates for Residential &amp; Commercial projects — with written warranties, brand-grade materials, and full pricing transparency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 text-white text-[11px] tracking-widest font-semibold"
          >
            {[
              { icon: <FiShield size={14} />, label: "20-Year Warranty" },
              { icon: <FiCheck size={14} />, label: "No Hidden Charges" },
              { icon: <FiClock size={14} />, label: "On-Time Delivery" },
              { icon: <FiStar size={14} />, label: "ISO Certified Quality" },
              { icon: <FiZap size={14} />, label: "Free Site Consultation" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[#D4A437]">{b.icon}</span> {b.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Division + Actions Bar ── */}
      <section className="sticky top-[72px] z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="inline-flex bg-slate-100 p-1 rounded-full border border-slate-200">
            <button
              id="pricing-residential-tab"
              onClick={() => setDivision("residential")}
              className={`flex items-center gap-2 px-7 py-2.5 rounded-full text-[11px] font-heading font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                division === "residential" ? "bg-[#081C35] text-white shadow" : "text-slate-700 hover:text-[#081C35]"
              }`}
            >
              <FiHome size={13} /> Residential
            </button>
            <button
              id="pricing-commercial-tab"
              onClick={() => setDivision("commercial")}
              className={`flex items-center gap-2 px-7 py-2.5 rounded-full text-[11px] font-heading font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                division === "commercial" ? "bg-[#081C35] text-white shadow" : "text-slate-700 hover:text-[#081C35]"
              }`}
            >
              <FiBriefcase size={13} /> Commercial
            </button>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowTable(!showTable)}
              className="px-5 py-2.5 border border-slate-300 hover:border-[#081C35] text-[#081C35] text-[11px] tracking-widest font-bold rounded transition-colors cursor-pointer"
            >
              {showTable ? "HIDE" : "VIEW"} SPEC TABLE
            </button>
            <Link to="/calculator" className="px-5 py-2.5 bg-[#D4A437] hover:bg-[#081C35] text-[#081C35] hover:text-white text-[11px] tracking-widest font-bold rounded transition-colors flex items-center gap-1.5">
              CALCULATE COST <FiArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Package Cards ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={division}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className={`grid gap-8 justify-center ${
                visiblePackages.length === 1
                  ? "grid-cols-1 max-w-md mx-auto"
                  : visiblePackages.length === 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                  : visiblePackages.length === 3
                  ? "grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto"
              }`}
            >
              {visiblePackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white ${
                    pkg.is_highlighted
                      ? "border-[#D4A437] shadow-lg ring-2 ring-[#D4A437] ring-offset-2"
                      : "border-slate-200 shadow-sm"
                  }`}
                >
                  {/* Colour bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${tierGradient(pkg.tier)}`} />

                  {/* Popular Badge */}
                  {pkg.is_highlighted && (
                    <div className="absolute top-5 right-5 bg-[#D4A437] text-[#081C35] text-[9px] tracking-widest font-black py-1 px-3 rounded-full uppercase">
                      ★ MOST POPULAR
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-1">
                    {/* Header */}
                    <div className="mb-5">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 ${tierBadge(pkg.tier)}`}>
                        {pkg.tier} tier
                      </span>
                      <h2 className="text-xl font-black font-heading text-[#081C35] uppercase tracking-wider">{pkg.title}</h2>
                      {pkg.subtitle && (
                        <p className="text-[11px] text-[#D4A437] font-bold tracking-widest uppercase mt-1">{pkg.subtitle}</p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-end gap-1 mb-5 pb-5 border-b border-slate-100">
                      <span className="text-4xl font-black font-heading text-[#081C35] leading-none">
                        ₹{pkg.price_per_sqft?.toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-600 font-semibold mb-1">/sq.ft</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-700 leading-relaxed font-medium mb-6">{pkg.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-slate-50 rounded-xl px-4 py-3 text-center border border-slate-100">
                        <div className="text-base font-black font-heading text-[#081C35]">{pkg.warranty_years} Yrs</div>
                        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">Warranty</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl px-4 py-3 text-center border border-slate-100">
                        <div className="text-base font-black font-heading text-[#081C35]">{pkg.delivery_months} Mo</div>
                        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-0.5">Delivery</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <p className="text-[10px] text-slate-900 font-black uppercase tracking-widest mb-3">Key Materials &amp; Specs</p>
                      <div className="space-y-2">
                        {(pkg.features || []).map((f: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-slate-800 font-medium">
                            <FiCheck size={13} className="text-green-600 shrink-0 mt-0.5" /> {f}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Inclusions */}
                    {(pkg.inclusions || []).length > 0 && (
                      <div className="mb-6">
                        <p className="text-[10px] text-slate-900 font-black uppercase tracking-widest mb-3">What&apos;s Included</p>
                        <div className="space-y-1.5">
                          {(pkg.inclusions || []).map((inc: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-slate-800 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#D4A437] shrink-0 mt-2" /> {inc}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Exclusions */}
                    {(pkg.exclusions || []).length > 0 && (
                      <div className="mb-8">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">Not Included</p>
                        <div className="space-y-1.5">
                          {(pkg.exclusions || []).map((exc: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-slate-500 font-medium">
                              <FiX size={12} className="text-red-400 shrink-0 mt-0.5" /> {exc}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="mt-auto space-y-3">
                      <button
                        onClick={() => navigate("/calculator")}
                        className={`w-full py-3.5 rounded-lg text-[11px] tracking-widest font-black uppercase transition-all cursor-pointer ${
                          pkg.is_highlighted
                            ? "bg-[#D4A437] text-[#081C35] hover:bg-[#081C35] hover:text-white"
                            : "bg-[#081C35] text-white hover:bg-[#D4A437] hover:text-[#081C35]"
                        }`}
                      >
                        Calculate My Cost
                      </button>
                      <Link
                        to="/contact"
                        className="w-full py-3 rounded-lg border-2 border-slate-200 text-[#081C35] hover:border-[#D4A437] hover:text-[#D4A437] text-[11px] tracking-widest font-bold uppercase transition-all block text-center"
                      >
                        Get Free Quote
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Spec Comparison Table ── */}
      <AnimatePresence>
        {showTable && (
          <motion.section
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-[#081C35] text-white"
          >
            <div className="max-w-6xl mx-auto px-6 md:px-12 py-20">
              <div className="text-center mb-12">
                <span className="text-[11px] tracking-[0.4em] text-[#D4A437] font-bold uppercase block mb-3">Material Matrix</span>
                <h2 className="text-2xl font-black font-heading uppercase tracking-wider">Complete Specification Comparison</h2>
              </div>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full border-collapse text-left text-sm text-white min-w-[640px]">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-5 text-[10px] tracking-widest text-[#D4A437] font-black uppercase">Specification</th>
                      <th className="p-5 text-[10px] tracking-widest text-slate-400 font-black uppercase">Basic</th>
                      <th className="p-5 text-[10px] tracking-widest text-amber-400 font-black uppercase">Premium</th>
                      <th className="p-5 text-[10px] tracking-widest text-violet-400 font-black uppercase">Luxury</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(SPEC_TABLE[division] || []).map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="p-5 font-black text-white text-[11px] tracking-wide uppercase">{row.spec}</td>
                        <td className="p-5 text-slate-300 font-medium">{row.basic}</td>
                        <td className="p-5 text-slate-300 font-medium">{row.premium}</td>
                        <td className="p-5 text-slate-300 font-medium">{row.luxury}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Why Our Pricing Is Different ── */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-[11px] tracking-[0.3em] text-[#D4A437] font-bold uppercase">Transparent Billing</span>
            <h2 className="text-3xl md:text-4xl font-black font-heading mt-3 text-[#081C35] uppercase">Why Our Pricing Is Different</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FiCheck size={22} className="text-[#D4A437]" />, title: "Zero Hidden Costs", desc: "Your quoted per-sqft rate is the final rate. No surprise material escalations or hidden labour charges — guaranteed by contract." },
              { icon: <FiShield size={22} className="text-[#D4A437]" />, title: "Written Warranty", desc: "Every project is backed by a registered structural warranty certificate — up to 20 years for Luxury packages." },
              { icon: <FiStar size={22} className="text-[#D4A437]" />, title: "Brand-Grade Materials", desc: "We use only listed brand-grade materials — JSW, Ultratech, Kohler, Legrand — never substituted without your written approval." },
              { icon: <FiClock size={22} className="text-[#D4A437]" />, title: "On-Time Delivery", desc: "Our 10-phase milestone model ensures payment is released only on verified physical completion — protecting your investment." },
              { icon: <FiZap size={22} className="text-[#D4A437]" />, title: "BIM Engineering", desc: "All projects use 3D BIM digital twins to eliminate site conflicts before they happen, saving both time and materials." },
              { icon: <FiArrowRight size={22} className="text-[#D4A437]" />, title: "Free Consultation", desc: "Our principal engineers provide a free site visit and structural feasibility assessment before any agreement is signed." },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:border-[#D4A437] hover:shadow-md transition-all">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-sm font-black font-heading text-[#081C35] uppercase tracking-wider mb-2">{item.title}</h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="text-[11px] tracking-[0.3em] text-[#D4A437] font-bold uppercase">Frequently Asked</span>
            <h2 className="text-3xl md:text-4xl font-black font-heading mt-3 text-[#081C35] uppercase">Pricing Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left text-sm font-heading font-black text-[#081C35] uppercase tracking-wider outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <FiChevronDown className={`text-[#D4A437] shrink-0 transition-transform duration-300 ${openFAQ === idx ? "rotate-180" : ""}`} size={18} />
                </button>
                <AnimatePresence initial={false}>
                  {openFAQ === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-3 text-sm text-slate-700 font-medium leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#081C35] text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[200px] bg-[#D4A437]/10 rounded-full blur-[100px]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <span className="text-[11px] tracking-[0.4em] text-[#D4A437] font-bold uppercase block mb-4">Start Your Build</span>
          <h2 className="text-3xl md:text-4xl font-black font-heading uppercase mb-6 text-white">Ready to Build Your Dream Home?</h2>
          <p className="text-base text-white max-w-xl mx-auto font-medium leading-relaxed mb-8">
            Use our intelligent cost calculator for a detailed estimate in under 2 minutes — or speak directly with our principal engineers for a custom proposal.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/calculator"
              className="px-8 py-4 bg-[#D4A437] text-[#081C35] font-black text-[11px] tracking-widest rounded-xl hover:bg-white hover:text-[#081C35] transition-all flex items-center justify-center gap-2"
            >
              Calculate Cost Now <FiArrowRight size={14} />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border-2 border-white/30 text-white font-black text-[11px] tracking-widest rounded-xl hover:bg-white/10 hover:border-white transition-all"
            >
              Speak With Our Engineers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
