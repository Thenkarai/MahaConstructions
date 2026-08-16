import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiCheck, FiChevronDown } from "react-icons/fi";

export default function Services() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // State for dynamic content
  const [services, setServices] = useState<any[]>([]);
  const [activeService, setActiveService] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFAQIndex, setActiveFAQIndex] = useState<number | null>(null);

  // Local fallback database to make sure it runs beautifully stand-alone
  const localFallbackServices = [
    {
      id: 1,
      name: "Residential Construction",
      slug: "residential-construction",
      overview: "Crafting bespoke luxury estates designed for multi-generational comfort. Every residence is built as a work of art, merging architectural elegance with sustainable materials.",
      benefits: ["Custom tailormade design", "Eco-friendly structural framing", "Smart home systems integration", "Premium Italian marble and custom joinery"],
      process: [
        { step: "1", title: "Concept Design", description: "Collaborative sketching and layout refinement with our principal architects." },
        { step: "2", title: "Engineering & Approvals", description: "Rigorous structural engineering assessments and municipal permitting." },
        { step: "3", title: "Construction Phase", description: "Precision construction executed by our certified craftsmen." },
        { step: "4", title: "Handover & Warranty", description: "White-glove walkthrough and custom manuals delivery." }
      ],
      image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      category: "Residential"
    },
    {
      id: 2,
      name: "Commercial Construction",
      slug: "commercial-construction",
      overview: "Developing iconic corporate headquarters, high-end retail structures, and premium office facilities that inspire progress and optimize functional workflow.",
      benefits: ["LEED-certified standard builds", "Optimized open-plan floorplates", "Advanced seismic load designs", "Fast-track scheduling control"],
      process: [
        { step: "1", title: "Strategic Planning", description: "Aligning space design with commercial operational flow and branding." },
        { step: "2", title: "Rapid Prefabrication", description: "Leveraging modular off-site assembly for minimal on-site timeline." },
        { step: "3", title: "Core & Shell Assembly", description: "High-strength concrete and custom curtain-wall execution." },
        { step: "4", title: "Tenant Fit-Out", description: "Custom high-end interior finishes tailored for occupancy." }
      ],
      image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      category: "Commercial"
    },
    {
      id: 3,
      name: "Architecture",
      slug: "architecture",
      overview: "Pioneering minimalist and sculptural building structures. We design with light, shadow, raw concrete, steel, and timber to form emotional connections with space.",
      benefits: ["Award-winning design philosophy", "Passive heating & cooling design", "BIM 3D modeling standard", "Custom structural engineering integration"],
      process: [
        { step: "1", title: "Site & Flow Analysis", "description": "Analyzing sun pathways, elevations, and views to optimize site layout." },
        { step: "2", title: "Schematic Projections", "description": "Initial hand-sketches and basic form-finding studies." },
        { step: "3", title: "Detailed Spatial Layouts", "description": "Perfecting proportions and defining primary material selections." },
        { step: "4", title: "BIM Integration", "description": "Creating full digital twins of the construction blueprint." }
      ],
      image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      category: "Design"
    },
    {
      id: 4,
      name: "Interior Design",
      slug: "interior-design",
      overview: "Curating minimalist interiors that embody tactile warmth. We combine bespoke furniture, textured plaster, and subtle indirect lighting for a serene setting.",
      benefits: ["Custom furniture curation", "Natural material palettes", "Ergonomic lighting schemes", "Acoustic spatial engineering"],
      process: [
        { step: "1", title: "Moodboards & Textures", description: "Defining the sensory palette: wood, stone, and plaster selection." },
        { step: "2", title: "Bespoke Joinery Drafts", description: "Designing custom closets, kitchens, and architectural screens." },
        { step: "3", title: "Furniture Procurement", description: "Sourcing rare fabrics and designer pieces globally." },
        { step: "4", title: "Styling & Setup", description: "Art curation, precise lighting adjustment, and hand-over." }
      ],
      image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      category: "Design"
    }
  ];

  const fallbackFAQs = [
    { question: "How long does a typical build process take?", answer: "Project durations depend entirely on structural scale: a luxury residential estate typically spans 12 to 18 months, whereas large-scale commercial skyscrapers take 24 to 36 months." },
    { question: "Do you supply pre-construction renderings?", answer: "Yes, we construct high-fidelity 3D visualization files and BIM models prior to material procurement to ensure spatial alignment." }
  ];

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data.length > 0 ? data : localFallbackServices);
      })
      .catch(() => {
        setServices(localFallbackServices);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (slug && services.length > 0) {
      const match = services.find((s) => s.slug === slug);
      setActiveService(match || null);
    } else {
      setActiveService(null);
    }
  }, [slug, services]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center pt-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4A437]" />
      </div>
    );
  }

  // --- SERVICE DETAILED VIEW ---
  if (slug && activeService) {
    return (
      <div className="w-full bg-white relative">
        {/* Banner Section */}
        <section className="relative w-full h-[60vh] flex items-center justify-center bg-[#081C35] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={activeService.image_url}
              className="w-full h-full object-cover opacity-45 filter grayscale scale-105"
              alt={activeService.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-primary/30 to-transparent" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
            <span className="text-[10px] tracking-[0.4em] text-[#D4A437] font-semibold uppercase mb-4 block">EXPERT SERVICE</span>
            <h1 className="text-3xl md:text-5xl font-black font-heading text-[#081C35] uppercase tracking-wide leading-none">
              {activeService.name}
            </h1>
            <div className="w-16 h-[2px] bg-[#D4A437] mx-auto mt-6" />
          </div>
        </section>

        {/* Overview & Benefits */}
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <span className="text-[10px] tracking-[0.25em] text-[#D4A437] font-semibold uppercase">OVERVIEW</span>
            <h2 className="text-2xl font-medium font-heading tracking-widest text-[#081C35] mt-3 mb-6 uppercase">CRAFT SPECIFICATION</h2>
            <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
              {activeService.overview}
            </p>
          </div>

          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 p-8 rounded-lg">
            <h3 className="text-xs font-bold tracking-widest text-[#081C35] uppercase mb-6">PREMIUM ADVANTAGES</h3>
            <ul className="space-y-4">
              {activeService.benefits?.map((benefit: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <FiCheck className="text-[#D4A437] mt-0.5 shrink-0" />
                  <span className="text-xs text-[#081C35] font-medium tracking-wide">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Dynamic Timeline Process */}
        {activeService.process && (
          <section className="py-20 bg-slate-50 border-t border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="text-center max-w-xl mx-auto mb-16">
                <span className="text-[10px] tracking-[0.3em] text-[#D4A437] font-semibold uppercase">BUILD BLUEPRINT</span>
                <h2 className="text-2xl font-medium font-heading tracking-widest text-[#081C35] mt-2">STEP BY STEP PIPELINE</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {activeService.process.map((step: any, idx: number) => (
                  <div key={idx} className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
                    <span className="text-3xl font-bold font-heading text-[#D4A437]/30 block mb-4">
                      0{step.step || idx + 1}
                    </span>
                    <h4 className="text-xs font-bold tracking-widest text-[#081C35] uppercase mb-2">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Dynamic FAQ list */}
        <section className="py-24 max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-[0.3em] text-[#D4A437] font-semibold uppercase">FAQ</span>
            <h2 className="text-2xl font-medium font-heading tracking-widest text-[#081C35] mt-2 mb-4">SERVICE SPECIFIC INQUIRIES</h2>
            <div className="w-16 h-[2px] bg-[#D4A437] mx-auto" />
          </div>

          <div className="space-y-4">
            {fallbackFAQs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveFAQIndex(activeFAQIndex === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-6 text-left font-heading text-xs font-semibold tracking-wider text-[#081C35] outline-none uppercase cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <FiChevronDown className={`text-[#D4A437] transition-transform ${activeFAQIndex === idx ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeFAQIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-50 pt-4"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#081C35] text-white py-20 text-center">
          <div className="max-w-2xl mx-auto px-6">
            <span className="text-[10px] tracking-[0.3em] text-[#D4A437] font-semibold uppercase mb-3 block">INITIATE CONSULTATION</span>
            <h3 className="text-xl font-bold tracking-widest font-heading uppercase mb-6">READY TO BRING YOUR PROJECT TO LIFE?</h3>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-[#D4A437] text-[#081C35] font-semibold text-xs tracking-widest rounded hover:bg-white transition-colors cursor-pointer"
            >
              REQUEST A DETAILED ESTIMATE
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // --- GENERAL SERVICES CATALOG INDEX ---
  return (
    <div className="w-full pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Title */}
        <div className="mb-20 text-center md:text-left">
          <span className="text-[10px] tracking-[0.4em] text-[#D4A437] font-semibold uppercase">SERVICES INDEX</span>
          <h1 className="text-3xl md:text-5xl font-black font-heading text-[#081C35] mt-3 mb-6 uppercase">
            OUR DISCIPLINES & EXPERTISE
          </h1>
          <p className="text-xs md:text-sm text-slate-700 font-medium max-w-2xl leading-relaxed">
            Unifying architectural vision, modern high-tech structural systems engineering, and custom interior design. We shape spaces that inspire.
          </p>
        </div>

        {/* Services Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => navigate(`/services/${service.slug}`)}
              className="group bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col md:flex-row h-auto md:h-[260px]"
            >
              {/* Photo preview */}
              <div className="w-full md:w-2/5 h-[180px] md:h-full overflow-hidden relative">
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
              </div>
              
              {/* Context preview */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] tracking-widest text-[#D4A437] font-semibold uppercase block mb-1">
                    {service.category || "Design"}
                  </span>
                  <h3 className="text-base font-bold font-heading text-[#081C35] uppercase group-hover:text-[#D4A437] transition-colors duration-300">
                    {service.name}
                  </h3>
                  <p className="text-[11px] text-slate-700 font-medium leading-relaxed mt-3 line-clamp-3">
                    {service.overview}
                  </p>
                </div>
                <div className="text-[10px] tracking-widest font-semibold text-[#D4A437] flex items-center gap-1 group-hover:text-[#081C35] transition-colors mt-4">
                  VIEW FULL SPECS <FiArrowRight size={10} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


