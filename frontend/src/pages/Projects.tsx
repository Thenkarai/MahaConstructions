import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiMapPin, FiCalendar, FiDollarSign, FiClock, FiLayers, FiPlay, FiX, FiDownload } from "react-icons/fi";
import { getEmbedVideoUrl, isYouTubeUrl } from "../utils/videoUtils";

export default function Projects() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State variables
  const [projects, setProjects] = useState<any[]>([]);
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Carousel and media states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [filterCat, setFilterCat] = useState("all");
  const [videoOpen, setVideoOpen] = useState(false);

  // Local fallback data
  const localFallbackProjects = [
    {
      id: 1,
      name: "The Glass Pavilion",
      client: "Alexander Vance",
      location: "Alibaug, Maharashtra",
      budget: "₹12.4 Crore",
      completion_date: "October 2025",
      duration: "18 Months",
      architecture_style: "Modernist Minimalism",
      description: "Perched on a coastal cliff, this residential masterpiece features floor-to-ceiling structural glass, raw board-formed concrete, and a cantilevered infinity pool that merges seamlessly with the Arabian Sea horizon.",
      image_urls: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
      ],
      video_url: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-swimming-pool-42352-large.mp4",
      timeline: [
        { phase: "Foundation", duration: "3 Months", description: "Deep-pile anchoring into coastal rock." },
        { phase: "Steel Framing", duration: "4 Months", description: "Super-slim structural steel layout." },
        { phase: "Glass Installation", duration: "3 Months", description: "Double-laminated structural glass fitment." },
        { phase: "Finishes & Handover", duration: "8 Months", description: "Travertine tiling and smart-home programming." }
      ],
      category: "residential",
      is_featured: true
    },
    {
      id: 2,
      name: "Aura Commercial Center",
      client: "Aura Group Holdings",
      location: "Worli, Mumbai",
      budget: "₹48.5 Crore",
      completion_date: "March 2026",
      duration: "24 Months",
      architecture_style: "Parametric High-Tech",
      description: "An architectural statement featuring a twisted dynamic steel structure, double-skin self-ventilating facade, and multi-level sky gardens serving as communal workspace hubs in Mumbai.",
      image_urls: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1200&q=80"
      ],
      video_url: "https://assets.mixkit.co/videos/preview/mixkit-modern-city-skyscrapers-business-district-41920-large.mp4",
      timeline: [
        { phase: "Excavation", duration: "5 Months", description: "Three-level underground parking excavation." },
        { phase: "Concrete Core", duration: "7 Months", description: "Slipformed central elevator structural concrete core." },
        { phase: "Steel Facade", duration: "6 Months", description: "Curtain-wall shell and structural steel assembly." },
        { phase: "Interior Systems", duration: "6 Months", description: "HVAC and mechanical networks." }
      ],
      category: "commercial",
      is_featured: true
    },
    {
      id: 3,
      name: "Zen Horizon Villa",
      client: "Dr. Liam Thorne",
      location: "Udaipur, Rajasthan",
      budget: "₹6.8 Crore",
      completion_date: "December 2024",
      duration: "14 Months",
      architecture_style: "Japanese Organic Modernism",
      description: "Blending traditional courtyard architecture with modern structural concrete. Features custom cedar wood screens, tatami lounge integration, and a central rock garden with trickling spring water in Udaipur.",
      image_urls: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80"
      ],
      video_url: "",
      timeline: [
        { phase: "Grading", duration: "2 Months", description: "Terraced hillside grading and retaining walls." },
        { phase: "Wood Joinery", duration: "5 Months", description: "Traditional mortarless joinery assembly." },
        { phase: "Interior Trim", duration: "4 Months", description: "Shoji screens and custom tatami mats placement." },
        { phase: "Landscaping", duration: "3 Months", description: "Authentic Zen stone garden arrangement." }
      ],
      category: "villa",
      is_featured: true
    }
  ];

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.length > 0 ? data : localFallbackProjects);
      })
      .catch(() => {
        setProjects(localFallbackProjects);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (id && projects.length > 0) {
      const match = projects.find((p) => p.id === parseInt(id));
      setActiveProject(match || null);
      setActiveImageIndex(0);
    } else {
      setActiveProject(null);
    }
  }, [id, projects]);

  const handlePrevImage = () => {
    if (!activeProject?.image_urls) return;
    setActiveImageIndex((prev) => 
      prev === 0 ? activeProject.image_urls.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!activeProject?.image_urls) return;
    setActiveImageIndex((prev) => 
      prev === activeProject.image_urls.length - 1 ? 0 : prev + 1
    );
  };

  const handleDownloadBrochure = () => {
    // Generate mock PDF trigger download alert
    alert("Your premium architectural brochure is being compiled. Sourcing BIM coordinates. Check your downloads panel shortly.");
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center pt-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4A437]" />
      </div>
    );
  }

  // --- PROJECT DETAILED VIEW ---
  if (id && activeProject) {
    const related = projects
      .filter((p) => p.id !== activeProject.id && p.category === activeProject.category)
      .slice(0, 2);

    return (
      <div className="w-full bg-white relative pt-24">
        {/* Dynamic Image Carousel Slider */}
        <section className="relative w-full h-[65vh] md:h-[80vh] bg-[#081C35] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                src={activeProject.image_urls?.[activeImageIndex]}
                className="w-full h-full object-cover filter grayscale"
                alt="Slider background"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-primary/40" />
          </div>

          {/* Left/Right Slider controls */}
          {activeProject.image_urls && activeProject.image_urls.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-[#081C35]/40 border border-white/10 hover:bg-[#D4A437] hover:text-[#081C35] text-white rounded-full transition-colors cursor-pointer z-10"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-[#081C35]/40 border border-white/10 hover:bg-[#D4A437] hover:text-[#081C35] text-white rounded-full transition-colors cursor-pointer z-10"
              >
                <FiChevronRight size={20} />
              </button>
            </>
          )}

          {/* Banner Overlap info */}
          <div className="absolute bottom-12 left-6 md:left-12 max-w-2xl text-white z-10">
            <span className="text-[10px] tracking-[0.4em] text-[#D4A437] font-semibold uppercase mb-3 block">MONUMENT DETAILS</span>
            <h1 className="text-3xl md:text-5xl font-black font-heading uppercase tracking-wide leading-none text-white drop-shadow-lg">
              {activeProject.name}
            </h1>
          </div>
        </section>

        {/* Technical Specifications Grid */}
        <section className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-6 gap-8">
            <div className="flex items-center gap-3">
              <FiMapPin className="text-[#D4A437] shrink-0" size={18} />
              <div>
                <span className="text-[9px] text-slate-700 block tracking-wider font-semibold">LOCATION</span>
                <span className="text-xs text-[#081C35] font-bold">{activeProject.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiLayers className="text-[#D4A437] shrink-0" size={18} />
              <div>
                <span className="text-[9px] text-slate-700 block tracking-wider font-semibold">STYLE</span>
                <span className="text-xs text-[#081C35] font-bold">{activeProject.architecture_style}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiDollarSign className="text-[#D4A437] shrink-0" size={18} />
              <div>
                <span className="text-[9px] text-slate-700 block tracking-wider font-semibold">BUDGET</span>
                <span className="text-xs text-[#081C35] font-bold">{activeProject.budget}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiCalendar className="text-[#D4A437] shrink-0" size={18} />
              <div>
                <span className="text-[9px] text-slate-700 block tracking-wider font-semibold">DATE</span>
                <span className="text-xs text-[#081C35] font-bold">{activeProject.completion_date}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiClock className="text-[#D4A437] shrink-0" size={18} />
              <div>
                <span className="text-[9px] text-slate-700 block tracking-wider font-semibold">DURATION</span>
                <span className="text-xs text-[#081C35] font-bold">{activeProject.duration}</span>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={handleDownloadBrochure}
                className="px-4 py-3 bg-[#D4A437] text-[#081C35] text-[10px] tracking-widest font-semibold rounded flex items-center gap-1.5 hover:bg-[#081C35] hover:text-white transition-colors cursor-pointer"
              >
                <FiDownload size={12} /> BROCHURE
              </button>
            </div>
          </div>
        </section>

        {/* Narrative & Video tour overlay */}
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-[10px] tracking-[0.25em] text-[#D4A437] font-semibold uppercase">THE BRIEF</span>
            <h2 className="text-2xl md:text-3xl font-black font-heading tracking-widest text-[#081C35] mt-3 mb-6 uppercase">ARCHITECTURAL INTENT</h2>
            <p className="text-sm md:text-base text-slate-800 font-semibold leading-relaxed mb-6">
              {activeProject.description}
            </p>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center">
            {activeProject.video_url ? (
              <div className="relative w-full h-[280px] rounded-lg overflow-hidden shadow-2xl group border border-slate-200">
                <img
                  src={activeProject.image_urls?.[0]}
                  className="w-full h-full object-cover filter brightness-75 group-hover:scale-102 transition-transform duration-500"
                  alt="Video thumbnail"
                />
                <button
                  onClick={() => setVideoOpen(true)}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#D4A437]/90 text-[#081C35] flex items-center justify-center shadow-lg hover:bg-white transition-colors cursor-pointer"
                >
                  <FiPlay size={20} className="ml-1" />
                </button>
                <div className="absolute bottom-4 left-4 text-xs font-semibold tracking-widest text-white uppercase pointer-events-none">
                  CINEMATIC VIDEO TOUR
                </div>
              </div>
            ) : (
              <div className="w-full h-[280px] rounded-lg bg-slate-50 border border-slate-200 border-dashed flex flex-col justify-center items-center p-6 text-center text-slate-700">
                <FiPlay size={24} className="text-[#D4A437]/40 mb-3" />
                <span className="text-[10px] tracking-widest font-semibold uppercase mb-1">CINEMATIC WALKTHROUGH</span>
                <p className="text-[10px] font-medium">Drone coordinates compile pending handover completions.</p>
              </div>
            )}
          </div>
        </section>

        {/* Project Timeline tracker */}
        {activeProject.timeline && (
          <section className="py-20 bg-slate-50 border-t border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="text-center max-w-xl mx-auto mb-16">
                <span className="text-[10px] tracking-[0.3em] text-[#D4A437] font-semibold uppercase">MILESTONE TRACKING</span>
                <h2 className="text-2xl font-medium font-heading tracking-widest text-[#081C35] mt-2 uppercase">THE CHRONICLE TIMELINE</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {activeProject.timeline.map((phase: any, idx: number) => (
                  <div key={idx} className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] tracking-widest text-[#D4A437] font-bold uppercase">{phase.phase}</span>
                      <span className="text-[10px] bg-slate-100 text-[#081C35] font-semibold px-2 py-0.5 rounded">{phase.duration}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Projects list */}
        {related.length > 0 && (
          <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
            <h3 className="text-xs font-bold tracking-widest text-[#081C35] uppercase mb-12">RELATED PORTFOLIO WORKS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {related.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/projects/${item.id}`)}
                  className="group cursor-pointer flex flex-col md:flex-row bg-slate-50 border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="w-full md:w-2/5 h-[180px] md:h-full overflow-hidden">
                    <img
                      src={item.image_urls?.[0]}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      alt={item.name}
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold tracking-wider text-[#081C35] uppercase">{item.name}</h4>
                      <p className="text-[10px] text-slate-700 mt-1">{item.location}</p>
                    </div>
                    <span className="text-[9px] tracking-widest text-[#D4A437] font-bold mt-4 block">VIEW SPECS <FiArrowRight size={10} className="inline ml-1" /></span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cinematic Video Modal Overlay */}
        <AnimatePresence>
          {videoOpen && activeProject.video_url && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#081C35]/95 backdrop-blur-md z-9999 flex items-center justify-center p-6"
            >
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute top-8 right-8 text-white/90 hover:text-white cursor-pointer"
              >
                <FiX size={28} />
              </button>
              <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                {isYouTubeUrl(activeProject.video_url) ? (
                  <iframe
                    src={getEmbedVideoUrl(activeProject.video_url)}
                    title={activeProject.name || "Project Video Walkthrough"}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={getEmbedVideoUrl(activeProject.video_url)}
                    autoPlay
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- GENERAL PORTFOLIO INDEX ---
  const filtered = filterCat === "all"
    ? projects
    : projects.filter(p => p.category === filterCat);

  return (
    <div className="w-full pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div className="mb-20 text-center md:text-left">
          <span className="text-[10px] tracking-[0.4em] text-[#D4A437] font-semibold uppercase">PORTFOLIO DEPARTMENTS</span>
          <h1 className="text-4xl md:text-6xl font-black font-heading mt-3 mb-6 uppercase text-[#081C35] tracking-tight">
            ARCHITECTURAL BLUEPRINTS
          </h1>
          <p className="text-sm md:text-base text-slate-700 font-semibold max-w-2xl leading-relaxed">
            From modern cliffside villas to twisting corporate skyscrapers. We execute with structural truth and material honesty.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-16 justify-center md:justify-start">
          {["all", "residential", "commercial", "villa"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-6 py-2.5 border-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-200 cursor-pointer ${
                filterCat === cat
                  ? "bg-[#081C35] border-[#081C35] text-white shadow-lg"
                  : "border-[#081C35]/40 text-[#081C35] hover:border-[#081C35] hover:bg-[#081C35] hover:text-white bg-white"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              onClick={() => navigate(`/projects/${proj.id}`)}
              className="group bg-[#F8F8F8]/50 border border-slate-200/80 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
            >
              <div className="h-[280px] overflow-hidden relative">
                <img
                  src={proj.image_urls?.[0]}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
                <div className="absolute inset-0 bg-[#081C35]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="px-4 py-2.5 bg-white/95 text-[#081C35] text-[10px] tracking-[0.2em] font-bold rounded uppercase shadow-lg">
                    EXPLORE SPECS
                  </span>
                </div>
              </div>
              <div className="p-6">
                <span className="text-[9px] tracking-widest text-[#D4A437] font-semibold uppercase block mb-1">
                  {proj.category}
                </span>
                <h3 className="text-base font-bold font-heading text-[#081C35] uppercase group-hover:text-[#D4A437] transition-colors duration-300">
                  {proj.name}
                </h3>
                <span className="text-[12px] text-slate-700 font-semibold mt-1 block">
                  {proj.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


