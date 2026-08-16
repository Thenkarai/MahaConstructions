import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight, FiCheck, FiAward, FiShield, FiUsers, FiClock,
  FiPhone, FiPlay, FiChevronLeft, FiChevronRight, FiX, FiCheckCircle,
  FiDownload, FiStar, FiMail, FiMapPin, FiGlobe, FiVideo, FiCalendar,
  FiHome, FiBriefcase
} from "react-icons/fi";
import { FaWhatsapp, FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa";
import { getEmbedVideoUrl, isYouTubeUrl } from "../utils/videoUtils";

export default function Home() {

  // State for interactive modals & carousels
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [activeVideoList, setActiveVideoList] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Slideshow & Slider state
  const [projectSlide, setProjectSlide] = useState(0);
  const [testimonialSlide, setTestimonialSlide] = useState(0);
  const [ytSlide, setYtSlide] = useState(0);

  // Home packages tab bar state (Residential vs Commercial)
  const [homePackageDivision, setHomePackageDivision] = useState<"residential" | "commercial">("residential");

  // Helper: open video modal with full list context for in-modal navigation
  const openVideoModal = (list: any[], index: number, urlFn: (item: any) => string) => {
    setActiveVideoList(list.map(item => ({ ...item, _url: urlFn(item) })));
    setActiveVideoIndex(index);
    setActiveVideoUrl(list[index] ? urlFn(list[index]) : null);
  };
  const modalPrev = () => {
    const newIdx = (activeVideoIndex - 1 + activeVideoList.length) % activeVideoList.length;
    setActiveVideoIndex(newIdx);
    setActiveVideoUrl(activeVideoList[newIdx]._url);
  };
  const modalNext = () => {
    const newIdx = (activeVideoIndex + 1) % activeVideoList.length;
    setActiveVideoIndex(newIdx);
    setActiveVideoUrl(activeVideoList[newIdx]._url);
  };

  // Lead Form state
  const [guideName, setGuideName] = useState("");
  const [guidePhone, setGuidePhone] = useState("");
  const [guideEmail, setGuideEmail] = useState("");
  const [guideSubmitted, setGuideSubmitted] = useState(false);

  // Quick Contact Form state
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // State for dynamic content managed by Admin Panel
  const [packagesData, setPackagesData] = useState<any[]>(() => {
    const saved = localStorage.getItem("maha_packages");
    return saved ? JSON.parse(saved) : [
      { id: 1, division: "residential", tier: "basic", title: "Basic Plan", subtitle: "Solid & Affordable", tagline: "Solid & Affordable", price_per_sqft: 1999, price: "₹1,999", popular: false, is_highlighted: false, features: ["Fe-500 TMT steel", "Coromandel / ACC cement", "M-Sand blockwork", "Vitrified floor tiles (2'×2')", "Parryware CP fittings"] },
      { id: 2, division: "residential", tier: "premium", title: "Premium Plan", subtitle: "Quality & Elegance", tagline: "Quality & Elegance", price_per_sqft: 2399, price: "₹2,399", popular: true, is_highlighted: true, features: ["Fe-550 TMT (JSW / Vizag Steel)", "Ultratech Premium / Dalmia cement", "Double-washed M-Sand", "Kajaria double charged tiles (4'×2')"] },
      { id: 3, division: "residential", tier: "luxury", title: "Luxury Plan", subtitle: "Elite Craftsmanship", tagline: "Elite Craftsmanship", price_per_sqft: 2999, price: "₹2,999", popular: false, is_highlighted: false, features: ["Fe-550 TMT (Tata Tiscon / JSPL)", "Birla Super / ACC Gold cement", "Italian Travertine / marble slabs"] },
      { id: 4, division: "commercial", tier: "basic", title: "Standard Shell", subtitle: "Functional & Efficient", tagline: "Functional & Efficient", price_per_sqft: 2199, price: "₹2,199", popular: false, is_highlighted: false, features: ["Fe-500 TMT structural steel", "OPC 53 grade cement", "RCC framed structure"] },
      { id: 5, division: "commercial", tier: "premium", title: "Premium Corporate", subtitle: "Professional & Polished", tagline: "Professional & Polished", price_per_sqft: 2799, price: "₹2,799", popular: true, is_highlighted: true, features: ["Fe-550 TMT (JSW Steel)", "Ultratech / Ambuja cement", "Granite / double charged vitrified"] },
      { id: 6, division: "commercial", tier: "luxury", title: "Elite Commercial", subtitle: "Iconic Architecture", tagline: "Iconic Architecture", price_per_sqft: 3499, price: "₹3,499", popular: false, is_highlighted: false, features: ["Fe-550D TMT (SAIL / JSPL)", "Birla Aditya / ACC Gold cement", "Post-tensioned slabs"] }
    ];
  });

  useEffect(() => {
    const syncPackages = () => {
      const saved = localStorage.getItem("maha_packages");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setPackagesData(parsed);
            return;
          }
        } catch (e) {}
      }
    };

    syncPackages();
    window.addEventListener("storage", syncPackages);

    // If no local packages, fetch from backend
    const saved = localStorage.getItem("maha_packages");
    if (!saved) {
      fetch("http://localhost:8000/api/packages")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((pkg: any) => ({
              id: pkg.id,
              title: pkg.title || pkg.tier?.toUpperCase(),
              tagline: pkg.subtitle || pkg.tagline || (pkg.is_highlighted ? "Most Popular Choice" : "Turnkey Package"),
              price: pkg.price_per_sqft ? `₹${pkg.price_per_sqft.toLocaleString()}` : pkg.price,
              popular: pkg.is_highlighted || pkg.popular || false,
              features: pkg.features || []
            }));
            setPackagesData(mapped);
            localStorage.setItem("maha_packages", JSON.stringify(mapped));
          }
        })
        .catch(() => {});
    }

    return () => window.removeEventListener("storage", syncPackages);
  }, []);

  const [completedProjects] = useState<any[]>(() => {
    const saved = localStorage.getItem("maha_projects");
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Royal Palm Villa", location: "Nagercoil, Kanyakumari", type: "Luxury Residential", sqft: "3,200 sq.ft", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-swimming-pool-42352-large.mp4" },
      { id: 2, title: "Emerald Heights Home", location: "Marthandam, Tamil Nadu", type: "Modern Villa", sqft: "2,400 sq.ft", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-city-skyscrapers-business-district-41920-large.mp4" },
      { id: 3, title: "Sunview Residence", location: "Trivandrum Highway, Nagercoil", type: "Contemporary Home", sqft: "2,850 sq.ft", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-swimming-pool-42352-large.mp4" },
      { id: 4, title: "Heritage Horizon Villa", location: "Kanyakumari", type: "Premium Bungalow", sqft: "4,100 sq.ft", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80", videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-city-skyscrapers-business-district-41920-large.mp4" }
    ];
  });

  // Project carousel auto-play
  useEffect(() => {
    if (!activeVideoUrl) {
      const t = setInterval(() => {
        setProjectSlide(s => (s + 1) % (completedProjects.length || 1));
      }, 5000);
      return () => clearInterval(t);
    }
  }, [activeVideoUrl, completedProjects.length]);

  const [youtubeVideos, setYoutubeVideos] = useState<any[]>(() => {
    const saved = localStorage.getItem("maha_youtube_videos");
    return saved ? JSON.parse(saved) : [
      { id: "v1", title: "Luxury 3D Villa Walkthrough & Interior Inspection", duration: "4:15", youtubeId: "dQw4w9WgXcQ", thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80" },
      { id: "v2", title: "Site Soil Testing & Foundation Engineering Explanation", duration: "6:30", youtubeId: "dQw4w9WgXcQ", thumbnail: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80" },
      { id: "v3", title: "Customer House Handover & Client Experience Review", duration: "3:45", youtubeId: "dQw4w9WgXcQ", thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" }
    ];
  });

  const [channelUrl, setChannelUrl] = useState<string>("https://www.youtube.com/@mahaconstructions2013");

  // Dynamic Guidebook PDF URL (managed via Admin Panel)
  const [guidePdfUrl, setGuidePdfUrl] = useState<string>(() => {
    return localStorage.getItem("maha_guide_pdf_url") || "/guide.pdf";
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/settings/guide_pdf_url")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.value) {
          setGuidePdfUrl(data.value);
          localStorage.setItem("maha_guide_pdf_url", data.value);
        }
      })
      .catch(() => {});
  }, []);

  // Intro Video URL (managed via Admin Panel)
  const [introVideoUrl, setIntroVideoUrl] = useState<string>(() => {
    return localStorage.getItem("maha_intro_video_url") || "";
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/settings/intro_video_url")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.value) {
          setIntroVideoUrl(data.value);
          localStorage.setItem("maha_intro_video_url", data.value);
        }
      })
      .catch(() => {});
  }, []);

  // 60-Second Engineer Intro Video URL (managed via Admin Panel)
  const [engineerVideoUrl, setEngineerVideoUrl] = useState<string>(() => {
    return localStorage.getItem("maha_engineer_video_url") || "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/settings/engineer_video_url")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.value) {
          setEngineerVideoUrl(data.value);
          localStorage.setItem("maha_engineer_video_url", data.value);
        }
      })
      .catch(() => {});
  }, []);

  // 60-Second Engineer Cover Image / Owner Cover (managed via Admin Panel)
  const [engineerCoverImage, setEngineerCoverImage] = useState<string>(() => {
    return localStorage.getItem("maha_engineer_cover_image") || "";
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/settings/engineer_cover_image")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.value) {
          setEngineerCoverImage(data.value);
          localStorage.setItem("maha_engineer_cover_image", data.value);
        }
      })
      .catch(() => {});
  }, []);

  // Live YouTube Channel Feed Auto-Fetch
  useEffect(() => {
    const savedChannel = localStorage.getItem("maha_youtube_channel_url");
    if (savedChannel) setChannelUrl(savedChannel);

    fetch("http://localhost:8000/api/youtube/channel-videos")
      .then((res) => res.json())
      .then((data) => {
        if (data.channel_url) setChannelUrl(data.channel_url);
        if (Array.isArray(data.videos) && data.videos.length > 0) {
          setYoutubeVideos(data.videos);
        }
      })
      .catch(() => {});

    // Fetch video testimonials from API
    fetch("http://localhost:8000/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item: any) => ({
            id: item.id,
            name: item.client_name || item.name || "Valued Client",
            location: item.client_role || item.location || "Tamil Nadu",
            videoUrl: item.video_url || item.videoUrl,
            thumbnail: item.image_url || item.thumbnail || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
            duration: item.duration || "2:30"
          }));
          setVideoTestimonials(formatted);
        }
      })
      .catch(() => {});
  }, []);

  const [videoTestimonials, setVideoTestimonials] = useState<any[]>(() => {
    const saved = localStorage.getItem("maha_video_testimonials");
    return saved ? JSON.parse(saved) : [
      {
        id: "vt1",
        name: "Mr. Suresh Kumar & Family",
        location: "Nagercoil (3,200 sq.ft Villa)",
        videoUrl: "http://localhost:8000/uploads/1785710590_WhatsApp%20Video%202026-07-29%20at%2011.16.33%20PM.mp4",
        thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
        duration: "2:45"
      },
      {
        id: "vt2",
        name: "Er. Rajesh K. & Family",
        location: "Kanyakumari (2,400 sq.ft Home)",
        videoUrl: "http://localhost:8000/uploads/1785710633_Maha%20Construction.mp4",
        thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
        duration: "3:10"
      },
      {
        id: "vt3",
        name: "Pudhugramam Site Review",
        location: "Pudhugramam (Site Walkthrough)",
        videoUrl: "http://localhost:8000/uploads/1785710665_Pudhugramam%20site%20video.mp4",
        thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
        duration: "4:15"
      }
    ];
  });

  const transparentSteps = [
    { step: "01", title: "Consultation", desc: "Initial discussion on requirements, budget, & home layout dreams." },
    { step: "02", title: "Site Visit & Assessment", desc: "Detailed soil testing, plot measurement, & orientation check." },
    { step: "03", title: "Planning & Design", desc: "2D Floor plan, 3D Elevation modeling, & Vastu optimization." },
    { step: "04", title: "Estimate & Agreement", desc: "Transparent cost breakdown & legal contract signed." },
    { step: "05", title: "Construction & Supervision", desc: "Rigorous daily site execution by certified structural engineers." },
    { step: "06", title: "Quality Checks", desc: "100+ quality checklist inspections for steel, cement, & MEP." },
    { step: "07", title: "Handover", desc: "Timely key handover with structural warranty certificates." }
  ];

  const handleGuideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideName || !guidePhone || !guideEmail) {
      alert("Please fill in all required fields (Name, Phone, and Email).");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/leads/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: guideName,
          phone: guidePhone,
          email: guideEmail,
          message: "Downloaded Free Home Builder's Guide: Nam Kanavu Illam",
        }),
      });

      if (response.ok) {
        setGuideSubmitted(true);
        const link = document.createElement("a");
        link.href = guidePdfUrl;
        link.download = "Nam_Kanavu_Illam_Guide.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.detail || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting guide request:", error);
      alert("Failed to submit request. Please check your connection.");
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;
    setContactSubmitted(true);
  };


  return (
    <div className="bg-[#081C35] text-[#E8E8E8] min-h-screen overflow-x-hidden pt-[86px]">

      {/* ── 1. ULTRA-LUXURY HERO SECTION ── */}
      <section className="relative min-h-[90vh] flex items-center pt-10 pb-20 md:py-28 overflow-hidden bg-[#081C35]">
        
        {/* Full-width Luxury Modern House Image/Video Background */}
        <div className="absolute inset-0 z-0">
          {introVideoUrl ? (
            <video
              key={introVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center scale-105 filter brightness-90"
            >
              <source src={introVideoUrl} type="video/mp4" />
              <source src={introVideoUrl} type="video/webm" />
              {/* Fallback image if video can't play */}
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
                alt="Luxury Architectural Residence Background"
                className="w-full h-full object-cover object-center scale-105 filter brightness-90"
              />
            </video>
          ) : (
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
              alt="Luxury Architectural Residence Background"
              className="w-full h-full object-cover object-center scale-105 filter brightness-90"
            />
          )}
          
          {/* Dark Blue Luxury Overlay (50-70%) + Radial Lighting Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#081C35] via-[#081C35]/90 to-[#081C35]/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081C35] via-transparent to-[#081C35]/70" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#081C35]/40 to-[#081C35]" />
        </div>

        {/* Ambient Floating Glow & Decorative Lighting */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4A437]/15 rounded-full blur-[140px] pointer-events-none animate-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-[#102949]/40 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT SIDE: Dominant Typography & CTA Actions */}
            <div className="lg:col-span-7 space-y-8 text-left">
              
              {/* Badge Pill */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#102949]/90 border border-[#D4A437]/40 shadow-xl backdrop-blur-md"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#F2C14E] animate-ping" />
                <span className="text-[11px] font-black tracking-[0.2em] text-[#F2C14E] uppercase">
                  GOVERNMENT REGISTERED ENGINEER • EST. 2013
                </span>
              </motion.div>

              {/* Dominant Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl md:text-5xl lg:text-6xl font-black font-heading tracking-tight text-white leading-[1.08] uppercase"
              >
                BUILDING LUXURY <span className="text-gold-gradient">ARCHITECTURAL MASTERPIECES</span> WITH UNCOMPROMISING EXCELLENCE
              </motion.h1>

              {/* Short Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-100 text-sm md:text-base leading-relaxed max-w-2xl font-medium"
              >
                Tamil Nadu's premier government-registered engineering firm delivering custom luxury villas, residential residences, and architectural homes with itemized material transparency and 15-year structural warranties.
              </motion.p>

              {/* Horizontal Trust Points */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-x-5 gap-y-2.5 pt-2 text-xs md:text-sm font-extrabold text-white"
              >
                <span className="flex items-center gap-1.5 bg-[#102949]/70 px-3 py-1.5 rounded-xl border border-[#D4A437]/30">
                  <FiCheck className="text-[#F2C14E] stroke-[3]" size={15} /> Premium Materials
                </span>
                <span className="flex items-center gap-1.5 bg-[#102949]/70 px-3 py-1.5 rounded-xl border border-[#D4A437]/30">
                  <FiCheck className="text-[#F2C14E] stroke-[3]" size={15} /> Transparent Pricing
                </span>
                <span className="flex items-center gap-1.5 bg-[#102949]/70 px-3 py-1.5 rounded-xl border border-[#D4A437]/30">
                  <FiCheck className="text-[#F2C14E] stroke-[3]" size={15} /> On-Time Delivery
                </span>
                <span className="flex items-center gap-1.5 bg-[#102949]/70 px-3 py-1.5 rounded-xl border border-[#D4A437]/30">
                  <FiCheck className="text-[#F2C14E] stroke-[3]" size={15} /> Expert Engineers
                </span>
                <span className="flex items-center gap-1.5 bg-[#102949]/70 px-3 py-1.5 rounded-xl border border-[#D4A437]/30">
                  <FiCheck className="text-[#F2C14E] stroke-[3]" size={15} /> Lifetime Support
                </span>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 pt-4"
              >
                {/* Primary CTA */}
                <a
                  href="tel:+919488888758"
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#F2C14E] via-[#D4A437] to-[#B8860B] hover:from-[#FBE395] hover:to-[#E2B242] text-[#081C35] font-black text-xs md:text-sm tracking-widest uppercase rounded-2xl transition-all duration-300 shadow-[0_10px_35px_rgba(242,193,78,0.6)] hover:shadow-[0_15px_45px_rgba(242,193,78,0.85)] border-2 border-[#FFF099] hover:-translate-y-1 cursor-pointer"
                >
                  <FiPhone size={18} className="stroke-[2.5]" /> BOOK FREE CONSULTATION
                </a>

                {/* Secondary CTA */}
                <a
                  href="https://wa.me/919488888758?text=Hello%20Er.%20Maha%20Rajan,%20I%20want%20to%20consult%20for%20my%20luxury%20home."
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-8 py-4 bg-[#102949]/90 hover:bg-[#25D366] text-white border-2 border-[#25D366] font-black text-xs md:text-sm tracking-widest uppercase rounded-2xl transition-all duration-300 shadow-xl hover:-translate-y-1 cursor-pointer backdrop-blur-md"
                >
                  <FaWhatsapp size={20} /> WHATSAPP DIRECT
                </a>
              </motion.div>

            </div>

            {/* RIGHT SIDE: Founder / Engineer Image & Floating Luxury Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4A437]/50 shadow-[0_25px_60px_rgba(0,0,0,0.6)] group bg-[#102949]">
                
                {/* Hero Banner / Founder Portrait */}
                <img
                  src="/hero-banner.png"
                  alt="Er. Maha Rajan - Government Registered Engineer"
                  className="w-full h-[450px] md:h-[520px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80";
                  }}
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#081C35] via-transparent to-transparent opacity-90" />

                {/* Floating Profile Badge Overlay */}
                <div className="absolute bottom-5 left-5 right-5 p-5 bg-[#081C35]/90 backdrop-blur-xl rounded-2xl border border-[#D4A437]/40 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-[#F2C14E] uppercase tracking-widest block">
                        LEAD STRUCTURAL ENGINEER
                      </span>
                      <h3 className="text-xl font-black text-white font-heading uppercase mt-0.5">
                        Er. Maha Rajan
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 font-medium">
                        Government Registered Engineer (TAMIL NADU)
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#D4A437] to-[#F2C14E] text-[#081C35] flex items-center justify-center font-black text-sm shadow-lg shrink-0">
                      <FiShield size={26} />
                    </div>
                  </div>
                </div>

              </div>

              {/* Floating Stat Badge — Top Right */}
              <div className="absolute -top-4 -right-4 bg-[#102949] p-4 rounded-2xl border-2 border-[#D4A437] shadow-2xl hidden md:flex items-center gap-3 z-20 backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-[#F2C14E]/20 text-[#F2C14E] flex items-center justify-center font-bold">
                  <FiAward size={22} />
                </div>
                <div>
                  <div className="text-xl font-black text-white font-heading">10+ YEARS</div>
                  <div className="text-[9px] font-extrabold text-[#D4A437] uppercase tracking-wider">PROVEN EXCELLENCE</div>
                </div>
              </div>

            </motion.div>

          </div>

        </div>
      </section>


      {/* ── 2. TRUST STATISTICS SECTION (Immediately below Hero) ── */}
      <section className="py-12 bg-[#102949] border-y border-[#D4A437]/30 relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            
            {/* Card 1 */}
            <div className="glass-navy-card p-5 rounded-2xl border border-[#D4A437]/30 hover:border-[#F2C14E] transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#F2C14E]/15 text-[#F2C14E] flex items-center justify-center mb-3 shadow-inner">
                <FiAward size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white font-heading">10+</h3>
              <p className="text-[11px] font-bold text-[#D4A437] uppercase tracking-wider mt-1">Years Experience</p>
            </div>

            {/* Card 2 */}
            <div className="glass-navy-card p-5 rounded-2xl border border-[#D4A437]/30 hover:border-[#F2C14E] transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#F2C14E]/15 text-[#F2C14E] flex items-center justify-center mb-3 shadow-inner">
                <FiUsers size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white font-heading">150+</h3>
              <p className="text-[11px] font-bold text-[#D4A437] uppercase tracking-wider mt-1">Happy Families</p>
            </div>

            {/* Card 3 */}
            <div className="glass-navy-card p-5 rounded-2xl border border-[#D4A437]/30 hover:border-[#F2C14E] transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#F2C14E]/15 text-[#F2C14E] flex items-center justify-center mb-3 shadow-inner">
                <FiCheckCircle size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white font-heading">100+</h3>
              <p className="text-[11px] font-bold text-[#D4A437] uppercase tracking-wider mt-1">Completed Projects</p>
            </div>

            {/* Card 4 */}
            <div className="glass-navy-card p-5 rounded-2xl border border-[#D4A437]/30 hover:border-[#F2C14E] transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#F2C14E]/15 text-[#F2C14E] flex items-center justify-center mb-3 shadow-inner">
                <FiShield size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white font-heading">15-Yr</h3>
              <p className="text-[11px] font-bold text-[#D4A437] uppercase tracking-wider mt-1">Structural Warranty</p>
            </div>

            {/* Card 5 */}
            <div className="glass-navy-card p-5 rounded-2xl border border-[#D4A437]/30 hover:border-[#F2C14E] transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center col-span-2 md:col-span-1">
              <div className="w-12 h-12 rounded-xl bg-[#F2C14E]/15 text-[#F2C14E] flex items-center justify-center mb-3 shadow-inner">
                <FiShield size={24} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white font-heading">100%</h3>
              <p className="text-[11px] font-bold text-[#D4A437] uppercase tracking-wider mt-1">Quality Audit Guarantee</p>
            </div>

          </div>
        </div>
      </section>


      {/* ── 3. COMPLETED PROJECTS PHOTO CAROUSEL (Soft Off-White Background) ── */}
      <section className="py-20 md:py-28 bg-[#FAFAFA] text-[#081C35] border-b border-[#E8E8E8] relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[11px] font-black tracking-[0.25em] text-[#D4A437] uppercase bg-white px-4 py-1.5 rounded-full border border-[#D4A437]/40 shadow-xs">
              OUR COMPLETED PROJECTS
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-heading text-[#081C35] mt-4 uppercase">
              Homes We've Proudly Delivered
            </h2>
            <p className="text-slate-700 text-sm md:text-base mt-3 font-semibold">
              Explore our landmark residential homes and luxury villas engineered across Tamil Nadu.
            </p>
          </div>

          {/* Full-width Photo Carousel */}
          {completedProjects.length > 0 && (
            <div className="relative group/carousel">
              <div className="relative w-full h-[360px] md:h-[520px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4A437]/30 bg-[#081C35]">
                <AnimatePresence mode="wait">
                  {completedProjects[projectSlide]?.videoUrl && !completedProjects[projectSlide]?.videoUrl.includes("youtube.com") && !completedProjects[projectSlide]?.videoUrl.includes("youtu.be") ? (
                    <motion.video
                      key={completedProjects[projectSlide]?.videoUrl + projectSlide}
                      src={completedProjects[projectSlide]?.videoUrl}
                      preload="metadata"
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  ) : (
                    <motion.img
                      key={projectSlide}
                      src={completedProjects[projectSlide]?.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"}
                      alt={completedProjects[projectSlide]?.title}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  )}
                </AnimatePresence>

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#081C35]/90 via-[#081C35]/30 to-transparent" />

                {/* Play Video Central Overlay Button (Icon Only, No Text) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => {
                      const curr = completedProjects[projectSlide];
                      openVideoModal(completedProjects, projectSlide, (item) => item.videoUrl || item.video_url || item.image);
                    }}
                    className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-[#F2C14E] to-[#D4A437] hover:scale-110 text-[#081C35] rounded-full flex items-center justify-center shadow-2xl transition-all cursor-pointer border-2 border-white/50"
                  >
                    <FiPlay size={30} className="ml-1 fill-current" />
                  </button>
                </div>

                {/* Slide counter badge */}
                <div className="absolute top-5 right-5 px-4 py-2 bg-[#081C35]/80 backdrop-blur-md rounded-full text-white text-xs font-black tracking-wider border border-[#D4A437]/40">
                  {projectSlide + 1} / {completedProjects.length}
                </div>

                {/* Project info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 pointer-events-none">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F2C14E] bg-[#102949]/90 px-3.5 py-1.5 rounded-full border border-[#D4A437]/40 backdrop-blur-md">
                    {completedProjects[projectSlide]?.type}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-black text-white font-heading mt-3 uppercase">
                    {completedProjects[projectSlide]?.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-slate-300 font-semibold flex items-center gap-1.5">📍 {completedProjects[projectSlide]?.location}</span>
                    <span className="text-xs font-black text-[#F2C14E] bg-[#102949]/90 px-3 py-1 rounded-full border border-[#D4A437]/40">
                      {completedProjects[projectSlide]?.sqft}
                    </span>
                  </div>
                </div>

                {/* Arrow nav — Left */}
                <button
                  onClick={() => setProjectSlide(s => (s - 1 + completedProjects.length) % completedProjects.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#081C35]/70 hover:bg-[#D4A437] hover:text-[#081C35] backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 shadow-lg cursor-pointer border border-[#D4A437]/40"
                >
                  <FiChevronLeft size={22} />
                </button>
                {/* Arrow nav — Right */}
                <button
                  onClick={() => setProjectSlide(s => (s + 1) % completedProjects.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#081C35]/70 hover:bg-[#D4A437] hover:text-[#081C35] backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 shadow-lg cursor-pointer border border-[#D4A437]/40"
                >
                  <FiChevronRight size={22} />
                </button>
              </div>

              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mt-5">
                {completedProjects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setProjectSlide(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === projectSlide ? "w-8 bg-[#D4A437]" : "w-2.5 bg-[#D4A437]/30 hover:bg-[#D4A437]/60"
                    }`}
                  />
                ))}
              </div>

              {/* Thumbnail strip */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                {completedProjects.map((project, i) => (
                  <button
                    key={project.id}
                    onClick={() => setProjectSlide(i)}
                    className={`relative rounded-2xl overflow-hidden h-20 md:h-28 transition-all duration-300 cursor-pointer border ${
                      i === projectSlide ? "border-2 border-[#D4A437] shadow-lg scale-[1.02]" : "border-[#E8E8E8] opacity-60 hover:opacity-100"
                    }`}
                  >
                    {(project.videoUrl || project.video_url) && !(project.videoUrl || project.video_url)?.includes("youtube.com") && !(project.videoUrl || project.video_url)?.includes("youtu.be") ? (
                      <video src={project.videoUrl || project.video_url} preload="metadata" className="w-full h-full object-cover" />
                    ) : (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    )}
                    {(project.videoUrl || project.video_url) && (
                      <div className="absolute top-1.5 left-1.5 w-6 h-6 bg-[#D4A437] text-[#081C35] rounded-full flex items-center justify-center shadow-md">
                        <FiPlay size={10} className="ml-0.5 fill-current" />
                      </div>
                    )}
                    {i === projectSlide && (
                      <div className="absolute inset-0 bg-[#D4A437]/20" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#F2C14E] via-[#D4A437] to-[#B8860B] hover:from-[#FBE395] hover:to-[#E2B242] text-[#081C35] font-black text-xs md:text-sm tracking-widest uppercase rounded-2xl transition-all shadow-xl hover:-translate-y-0.5"
            >
              VIEW ALL PROJECTS <FiArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>


      {/* ── 4. OUR CONSTRUCTION PACKAGES (Dark Luxury Navy Background) ── */}
      <section className="py-20 md:py-28 bg-[#081C35] text-white border-b border-[#D4A437]/30 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[11px] font-black tracking-[0.25em] text-[#F2C14E] uppercase bg-[#102949] px-4 py-1.5 rounded-full border border-[#D4A437]/40 shadow-md">
              TURNKEY PACKAGES
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-heading text-white mt-4 uppercase">
              Choose the Right Package for Your Construction
            </h2>
            <p className="text-slate-100 text-sm md:text-base mt-3 font-medium">
              Clear turnkey pricing per sq.ft with 100% material transparency and registered engineer supervision.
            </p>

            {/* ── 2-TAB SWITCHER BAR (Residential vs Commercial) ── */}
            <div className="flex items-center justify-center gap-3 mt-8 p-1.5 bg-[#102949] rounded-2xl border border-[#D4A437]/40 max-w-md mx-auto shadow-2xl">
              <button
                onClick={() => setHomePackageDivision("residential")}
                className={`flex-1 py-3 px-5 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  homePackageDivision === "residential"
                    ? "bg-gradient-to-r from-[#F2C14E] via-[#D4A437] to-[#B8860B] text-[#081C35] shadow-lg scale-[1.02]"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <FiHome size={18} /> Residential
              </button>
              <button
                onClick={() => setHomePackageDivision("commercial")}
                className={`flex-1 py-3 px-5 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  homePackageDivision === "commercial"
                    ? "bg-gradient-to-r from-[#F2C14E] via-[#D4A437] to-[#B8860B] text-[#081C35] shadow-lg scale-[1.02]"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <FiBriefcase size={18} /> Commercial
              </button>
            </div>
          </div>

          {/* Filtered Packages Grid */}
          {(() => {
            const filteredPackages = packagesData.filter(
              (pkg) => (pkg.division || "residential") === homePackageDivision
            );

            return (
              <div
                className={`grid gap-6 justify-center ${
                  filteredPackages.length === 1
                    ? "grid-cols-1 max-w-md mx-auto"
                    : filteredPackages.length === 2
                    ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
                }`}
              >
                {filteredPackages.map((pkg) => {
                  const isPopular = pkg.popular || pkg.is_highlighted;
                  return (
                    <div
                      key={pkg.id}
                      className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${
                        isPopular
                          ? "bg-[#102949] border-2 border-[#F2C14E] shadow-[0_20px_50px_rgba(212,164,55,0.25)] scale-[1.03]"
                          : "glass-navy-card border border-[#D4A437]/30 hover:border-[#D4A437]"
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#F2C14E] to-[#D4A437] text-[#081C35] text-[10px] font-black tracking-widest uppercase rounded-full shadow-lg flex items-center gap-1">
                          <FiStar size={12} /> MOST POPULAR
                        </div>
                      )}

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-[#081C35] text-[#F2C14E] uppercase border border-[#D4A437]/40 tracking-wider">
                            {pkg.tier ? `${pkg.tier} Tier` : (homePackageDivision === "residential" ? "Home Tier" : "Commercial Tier")}
                          </span>
                          {(pkg.warranty_years || pkg.delivery_months) && (
                            <span className="text-[10px] text-slate-300 font-semibold">
                              {pkg.warranty_years || 10} Yrs Warranty
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-black text-white font-heading uppercase tracking-wider text-center pt-1">
                          {pkg.title}
                        </h3>
                        <p className="text-center text-xs text-slate-300 mt-1 mb-4 font-medium">
                          {pkg.subtitle || pkg.tagline}
                        </p>

                        <div className="py-3.5 px-4 bg-[#081C35] rounded-2xl text-center border border-[#D4A437]/40 mb-6">
                          <span className="text-3xl font-black text-[#F2C14E] font-heading">{pkg.price}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider"> / sq.ft</span>
                        </div>

                        <ul className="space-y-3 mb-6">
                          {Array.isArray(pkg.features)
                            ? pkg.features.map((feat: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 font-medium">
                                  <FiCheck className="text-[#F2C14E] shrink-0 mt-0.5" size={15} />
                                  <span>{feat}</span>
                                </li>
                              ))
                            : null}
                        </ul>
                      </div>

                      <button
                        onClick={() => setSelectedPackage(pkg)}
                        className={`w-full py-3.5 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all cursor-pointer ${
                          isPopular
                            ? "bg-gradient-to-r from-[#F2C14E] to-[#D4A437] text-[#081C35] hover:opacity-95 shadow-lg"
                            : "bg-[#102949] hover:bg-[#D4A437] hover:text-[#081C35] border border-[#D4A437]/40 text-white"
                        }`}
                      >
                        VIEW DETAILS
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          <div className="text-center mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCompareModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#102949] hover:bg-[#D4A437] hover:text-[#081C35] text-[#F2C14E] font-black text-xs tracking-widest uppercase rounded-2xl border-2 border-[#D4A437]/50 transition-all cursor-pointer shadow-xl"
            >
              <FiAward size={16} /> COMPARE PACKAGES
            </button>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#F2C14E] via-[#D4A437] to-[#B8860B] hover:opacity-95 text-[#081C35] font-black text-xs tracking-widest uppercase rounded-2xl transition-all shadow-xl"
            >
              EXPLORE ALL PRICING & SPECS <FiArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>


      {/* ── 5. MEET YOUR ENGINEER (Soft Off-White Background) ── */}
      <section className="py-20 md:py-28 bg-[#FAFAFA] text-[#081C35] border-b border-[#E8E8E8] relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6">
              <div 
                onClick={() => openVideoModal([{ videoUrl: engineerVideoUrl, title: "60-Second Engineer Introduction" }], 0, (item) => item.videoUrl)}
                className="relative rounded-3xl overflow-hidden border-2 border-[#D4A437]/50 shadow-2xl group bg-[#081C35] cursor-pointer"
              >
                {engineerCoverImage ? (
                  <img
                    src={engineerCoverImage}
                    alt="Engineer Introduction Cover"
                    className="w-full h-80 md:h-[420px] object-cover brightness-95 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : engineerVideoUrl && !engineerVideoUrl.includes("youtube.com") && !engineerVideoUrl.includes("youtu.be") ? (
                  <video
                    key={engineerVideoUrl}
                    src={engineerVideoUrl}
                    preload="metadata"
                    className="w-full h-80 md:h-[420px] object-cover brightness-95 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                    alt="Architectural Home Cover"
                    className="w-full h-80 md:h-[420px] object-cover brightness-95 group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openVideoModal([{ videoUrl: engineerVideoUrl, title: "60-Second Engineer Introduction" }], 0, (item) => item.videoUrl);
                  }}
                  className="absolute inset-0 m-auto w-20 h-20 bg-gradient-to-r from-[#F2C14E] to-[#D4A437] text-[#081C35] rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
                >
                  <FiPlay size={32} className="ml-1" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#081C35]/90 backdrop-blur-md rounded-2xl text-center border border-[#D4A437]/40 shadow-md group-hover:bg-[#D4A437] group-hover:text-[#081C35] transition-colors">
                  <span className="text-xs font-black text-[#F2C14E] group-hover:text-[#081C35] uppercase tracking-wider flex items-center justify-center gap-2">
                    <FiPlay size={14} /> Watch 60-Second Engineer Introduction
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[11px] font-black tracking-[0.25em] text-[#081C35] uppercase bg-[#F2C14E] px-4 py-1.5 rounded-full border border-[#D4A437] shadow-sm">
                  MEET YOUR ENGINEER
                </span>
                <h2 className="text-3xl md:text-4xl font-black font-heading text-[#081C35] mt-4 uppercase">
                  Meet the Engineer Behind Every Project
                </h2>
                <p className="text-xs sm:text-sm font-black text-[#081C35] uppercase tracking-wider mt-2 bg-[#F2C14E]/15 inline-block px-3 py-1 rounded-lg border border-[#D4A437]/30">
                  GOVERNMENT REGISTERED ENGINEER (TAMIL NADU)
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-3xl bg-white border-2 border-[#D4A437]/40 relative shadow-lg">
                <span className="text-6xl font-serif text-[#D4A437]/40 absolute top-2 left-4 select-none">“</span>
                <p className="text-[#081C35] text-sm md:text-base leading-relaxed italic relative z-10 pt-4 font-bold">
                  Building a home is one of the biggest investments in your life. My commitment is to deliver quality, transparency and luxury residences that families are proud to live in for generations.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200 text-right">
                  <span className="text-xs sm:text-sm font-black text-[#B8860B] uppercase tracking-wider">Er. Maha Rajan</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-md">
                  <h4 className="text-2xl md:text-3xl font-black text-[#B8860B] font-heading">10+</h4>
                  <p className="text-xs font-black text-[#081C35] uppercase mt-1">Years Exp</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-md">
                  <h4 className="text-2xl md:text-3xl font-black text-[#B8860B] font-heading">150+</h4>
                  <p className="text-xs font-black text-[#081C35] uppercase mt-1">Families</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-md">
                  <h4 className="text-2xl md:text-3xl font-black text-[#B8860B] font-heading">100+</h4>
                  <p className="text-xs font-black text-[#081C35] uppercase mt-1">Projects</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ── 6. CLIENT VIDEO TESTIMONIALS (Dark Luxury Navy Background) ── */}
      <section className="py-20 md:py-28 bg-[#081C35] text-white border-b border-[#D4A437]/30 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-[11px] font-black tracking-[0.25em] text-[#F2C14E] uppercase bg-[#102949] px-4 py-1.5 rounded-full border border-[#D4A437]/40 inline-flex items-center gap-1.5">
                <FiVideo size={14} /> CLIENT STORIES
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-white mt-4 uppercase">
                What Our Clients Say
              </h2>
              <p className="text-slate-300 text-sm mt-2 font-medium">
                Real video testimonials from families across Tamil Nadu.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setTestimonialSlide(s => Math.max(0, s - 1))} disabled={testimonialSlide === 0}
                className="w-10 h-10 rounded-full border border-[#D4A437]/40 bg-[#102949] flex items-center justify-center text-white hover:bg-[#D4A437] hover:text-[#081C35] transition-all disabled:opacity-30 cursor-pointer shadow-md">
                <FiChevronLeft size={18} />
              </button>
              <span className="text-xs font-black text-slate-400">{testimonialSlide + 1} / {Math.max(1, videoTestimonials.length)}</span>
              <button onClick={() => setTestimonialSlide(s => Math.min(videoTestimonials.length - 1, s + 1))} disabled={testimonialSlide >= videoTestimonials.length - 1}
                className="w-10 h-10 rounded-full border border-[#D4A437]/40 bg-[#102949] flex items-center justify-center text-white hover:bg-[#D4A437] hover:text-[#081C35] transition-all disabled:opacity-30 cursor-pointer shadow-md">
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Slider track */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: `-${testimonialSlide * (100 / 3)}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              style={{ width: `${Math.max(100, (videoTestimonials.length / 3) * 100)}%` }}
            >
              {videoTestimonials.map((vt: any, idx: number) => (
                <div
                  key={vt.id || idx}
                  className="flex-shrink-0 cursor-pointer group"
                  style={{ width: `${100 / Math.max(videoTestimonials.length, 3)}%` }}
                  onClick={() => vt.videoUrl && openVideoModal(
                    videoTestimonials.filter((v: any) => v.videoUrl),
                    videoTestimonials.filter((v: any) => v.videoUrl).findIndex((v: any) => (v.id || '') === (vt.id || '')),
                    (v: any) => v.videoUrl
                  )}
                >
                  <div className="bg-[#102949] rounded-3xl overflow-hidden border border-[#D4A437]/30 hover:border-[#F2C14E] shadow-xl transition-all h-full">
                    <div className="relative h-56 overflow-hidden bg-black">
                      {vt.videoUrl && !vt.videoUrl.includes("youtube.com") && !vt.videoUrl.includes("youtu.be") ? (
                        <video
                          src={vt.videoUrl}
                          preload="metadata"
                          className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <img
                          src={vt.thumbnail || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"}
                          alt={vt.name}
                          className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"; }}
                        />
                      )}

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#F2C14E] to-[#D4A437] text-[#081C35] rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <FiPlay size={24} className="ml-1" />
                        </div>
                      </div>

                      <div className="absolute top-3 left-3 px-3 py-1 bg-[#081C35]/90 backdrop-blur-md rounded-full text-[9px] font-black text-[#F2C14E] uppercase tracking-wider border border-[#D4A437]/30">
                        CLIENT STORY
                      </div>

                      <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-md text-[10px] font-bold text-white">
                        {vt.duration || "2:45"}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-black text-white font-heading uppercase group-hover:text-[#F2C14E] transition-colors">
                        {vt.name}
                      </h3>
                      <p className="text-xs text-[#F2C14E] font-bold mt-1 flex items-center gap-1">
                        📍 {vt.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {videoTestimonials.map((_: any, i: number) => (
              <button key={i} onClick={() => setTestimonialSlide(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${ i === testimonialSlide ? "w-8 bg-[#F2C14E]" : "w-2 bg-[#F2C14E]/30 hover:bg-[#F2C14E]/60" }`} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/testimonials"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#F2C14E] via-[#D4A437] to-[#B8860B] text-[#081C35] font-black text-xs tracking-widest uppercase rounded-2xl transition-all shadow-xl">
              WATCH ALL CLIENT STORIES <FiArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>


      {/* ── 7. YOUTUBE VIDEOS (Soft Off-White Background) ── */}
      <section className="py-20 md:py-28 bg-[#FAFAFA] text-[#081C35] border-b border-[#E8E8E8] relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-[11px] font-black tracking-[0.25em] text-[#EF4444] uppercase bg-white px-4 py-1.5 rounded-full border border-red-200 inline-flex items-center gap-1.5 shadow-xs">
                <FaYoutube size={13} /> YOUTUBE VIDEOS & SITE TOURS
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-heading text-[#081C35] mt-4 uppercase">
                Learn Before You Build
              </h2>
              <p className="text-slate-600 text-sm mt-2 font-medium">
                Real site walkthroughs, structural testing, and villa showcases.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setYtSlide(s => Math.max(0, s - 1))} disabled={ytSlide === 0}
                className="w-10 h-10 rounded-full border border-[#E8E8E8] bg-white flex items-center justify-center text-[#081C35] hover:bg-[#D4A437] hover:text-white hover:border-[#D4A437] transition-all disabled:opacity-30 cursor-pointer shadow-sm">
                <FiChevronLeft size={18} />
              </button>
              <span className="text-xs font-black text-slate-400">{ytSlide + 1} / {Math.max(1, youtubeVideos.length)}</span>
              <button onClick={() => setYtSlide(s => Math.min(youtubeVideos.length - 1, s + 1))} disabled={ytSlide >= youtubeVideos.length - 1}
                className="w-10 h-10 rounded-full border border-[#E8E8E8] bg-white flex items-center justify-center text-[#081C35] hover:bg-[#D4A437] hover:text-white hover:border-[#D4A437] transition-all disabled:opacity-30 cursor-pointer shadow-sm">
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: `-${ytSlide * (100 / 3)}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              style={{ width: `${(youtubeVideos.length / 3) * 100}%` }}
            >
              {youtubeVideos.map((video, idx) => (
                <div
                  key={video.id}
                  className="flex-shrink-0 cursor-pointer group"
                  style={{ width: `${100 / youtubeVideos.length}%` }}
                  onClick={() => openVideoModal(
                    youtubeVideos,
                    idx,
                    v => `https://www.youtube.com/embed/${v.youtubeId}?autoplay=1`
                  )}
                >
                  <div className="bg-white rounded-3xl overflow-hidden border border-[#E8E8E8] hover:border-[#D4A437] shadow-md hover:shadow-xl transition-all">
                    <div className="relative h-48 overflow-hidden bg-black">
                      <img src={video.thumbnail} alt={video.title}
                        className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-[#EF4444] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <FiPlay size={22} className="ml-1 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-md text-[10px] font-bold text-white">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#EF4444] uppercase mb-1">
                        <FaYoutube size={14} /> MAHA CONSTRUCTIONS CHANNEL
                      </div>
                      <h3 className="text-sm font-black text-[#081C35] font-heading group-hover:text-[#D4A437] transition-colors leading-snug">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {youtubeVideos.map((_, i) => (
              <button key={i} onClick={() => setYtSlide(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${ i === ytSlide ? "w-8 bg-[#EF4444]" : "w-2 bg-[#EF4444]/25 hover:bg-[#EF4444]/50" }`} />
            ))}
          </div>

          <div className="text-center mt-8">
            <a href={channelUrl} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#EF4444] hover:bg-red-700 text-white font-black text-xs tracking-widest uppercase rounded-2xl shadow-md transition-all">
              <FaYoutube size={16} /> SUBSCRIBE ON YOUTUBE
            </a>
          </div>

        </div>
      </section>


      {/* ── 8. BANKING PARTNERS & VENDORS (Dark Luxury Navy Background) ── */}
      <section className="py-16 md:py-24 bg-[#081C35] border-b border-[#D4A437]/30 relative overflow-hidden"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            rgba(212,164,55,0.02) 10px,
            rgba(212,164,55,0.02) 11px
          )`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="flex-1 max-w-[80px] h-px bg-[#D4A437]" />
            <span className="text-[11px] font-black tracking-[0.25em] text-[#F2C14E] uppercase">
              FINANCE & LOANS
            </span>
            <span className="flex-1 max-w-[80px] h-px bg-[#D4A437]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-heading text-white">
            Our Banking <span className="text-[#F2C14E]">Partners</span>
          </h2>
          <p className="text-slate-300 text-sm mt-3 max-w-xl mx-auto">
            Get your home loan sanctioned easily through our trusted banking network — fast approvals & low interest rates.
          </p>
        </div>

        {/* Marquee Track */}
        <div className="marquee-wrapper mb-14">
          <div className="marquee-track gap-5">
            {[
              { name: "HDFC Home Loans", color: "#003580", abbr: "HDFC" },
              { name: "Axis Bank", color: "#800000", abbr: "AXIS" },
              { name: "ICICI Bank", color: "#F37B20", abbr: "ICICI" },
              { name: "Indian Bank", color: "#FF6600", abbr: "IND" },
              { name: "SBI Home Loans", color: "#22357A", abbr: "SBI" },
              { name: "IDFC First Bank", color: "#FF4F00", abbr: "IDFC" },
              { name: "UCO Bank", color: "#005F9E", abbr: "UCO" },
              { name: "Bank of India", color: "#0F4FA8", abbr: "BOI" },
              { name: "Canara Bank", color: "#006CA7", abbr: "CAN" },
              { name: "PNB Housing", color: "#003087", abbr: "PNB" },
              { name: "HDFC Home Loans", color: "#003580", abbr: "HDFC" },
              { name: "Axis Bank", color: "#800000", abbr: "AXIS" },
              { name: "ICICI Bank", color: "#F37B20", abbr: "ICICI" },
              { name: "Indian Bank", color: "#FF6600", abbr: "IND" },
              { name: "SBI Home Loans", color: "#22357A", abbr: "SBI" },
              { name: "IDFC First Bank", color: "#FF4F00", abbr: "IDFC" },
              { name: "UCO Bank", color: "#005F9E", abbr: "UCO" },
              { name: "Bank of India", color: "#0F4FA8", abbr: "BOI" },
              { name: "Canara Bank", color: "#006CA7", abbr: "CAN" },
              { name: "PNB Housing", color: "#003087", abbr: "PNB" },
            ].map((bank, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-44 h-22 bg-[#102949] rounded-2xl border border-[#D4A437]/30 hover:border-[#F2C14E] shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-1.5 px-4 cursor-default select-none"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-black shadow-md"
                  style={{ backgroundColor: bank.color }}
                >
                  {bank.abbr}
                </div>
                <span className="text-[11px] font-bold text-white text-center leading-tight">{bank.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vendors Marquee */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="flex-1 max-w-[80px] h-px bg-[#D4A437]" />
            <span className="text-[11px] font-black tracking-[0.25em] text-[#F2C14E] uppercase">
              TRUSTED BRANDS
            </span>
            <span className="flex-1 max-w-[80px] h-px bg-[#D4A437]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-heading text-white">
            Our Material <span className="text-[#F2C14E]">Vendors</span>
          </h2>
        </div>

        <div className="marquee-wrapper">
          <div className="marquee-track-reverse gap-5">
            {[
              { name: "Kajaria Tiles", color: "#B22222", abbr: "KAJ" },
              { name: "Ramco Supergrade", color: "#1A4480", abbr: "RAM" },
              { name: "Parryware", color: "#005F9E", abbr: "PAR" },
              { name: "Nippon Paint", color: "#003087", abbr: "NIP" },
              { name: "Jaquar", color: "#000000", abbr: "JAQ" },
              { name: "Tata Tiscon", color: "#1D407F", abbr: "TATA" },
              { name: "UltraTech", color: "#E87722", abbr: "UTC" },
              { name: "ACC Cement", color: "#004B8D", abbr: "ACC" },
              { name: "JSW Steel", color: "#003F87", abbr: "JSW" },
              { name: "Asian Paints", color: "#CC0000", abbr: "AP" },
              { name: "Kajaria Tiles", color: "#B22222", abbr: "KAJ" },
              { name: "Ramco Supergrade", color: "#1A4480", abbr: "RAM" },
              { name: "Parryware", color: "#005F9E", abbr: "PAR" },
              { name: "Nippon Paint", color: "#003087", abbr: "NIP" },
              { name: "Jaquar", color: "#000000", abbr: "JAQ" },
              { name: "Tata Tiscon", color: "#1D407F", abbr: "TATA" },
              { name: "UltraTech", color: "#E87722", abbr: "UTC" },
              { name: "ACC Cement", color: "#004B8D", abbr: "ACC" },
              { name: "JSW Steel", color: "#003F87", abbr: "JSW" },
              { name: "Asian Paints", color: "#CC0000", abbr: "AP" },
            ].map((brand, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-44 h-22 bg-[#102949] rounded-2xl border border-[#D4A437]/30 hover:border-[#F2C14E] shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-1.5 px-4 cursor-default select-none"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-black shadow-md"
                  style={{ backgroundColor: brand.color }}
                >
                  {brand.abbr}
                </div>
                <span className="text-[11px] font-bold text-white text-center leading-tight">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── 9. CONSTRUCTION PROCESS (Soft Off-White Background) ── */}
      <section id="process" className="py-20 md:py-28 bg-[#FAFAFA] text-[#081C35] border-b border-[#E8E8E8] relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-black tracking-[0.25em] text-[#D4A437] uppercase bg-white px-4 py-1.5 rounded-full border border-[#D4A437]/40 shadow-xs">
              OUR 7 STEP TRANSPARENT PROCESS
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-heading text-[#081C35] mt-4 uppercase">
              Our Step-by-Step Construction Process
            </h2>
            <p className="text-slate-700 text-sm mt-3 font-semibold">
              Clear step-by-step roadmap ensuring zero cost overruns and 100% material quality control.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {transparentSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-[#E8E8E8] hover:border-[#D4A437] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#F2C14E] to-[#D4A437] text-[#081C35] font-black text-sm flex items-center justify-center font-heading mb-4 shadow-md">
                    {step.step}
                  </div>
                  <h3 className="text-xs font-black text-[#081C35] uppercase font-heading tracking-wider leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[12px] text-slate-700 font-semibold mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#F2C14E] via-[#D4A437] to-[#B8860B] hover:from-[#FBE395] hover:to-[#E2B242] text-[#081C35] font-black text-xs md:text-sm tracking-widest uppercase rounded-2xl transition-all duration-300 cursor-pointer shadow-[0_10px_35px_rgba(242,193,78,0.5)] border-2 border-[#FFF099] hover:scale-105"
            >
              <FiCalendar size={18} className="stroke-[2.5]" /> BOOK A FREE CONSULTATION
            </Link>
          </div>

        </div>
      </section>


      {/* ── 10. GET HOME GUIDE (Dark Luxury Navy Background) ── */}
      <section id="guide-section" className="py-20 md:py-28 bg-[#081C35] text-white border-b border-[#D4A437]/30 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#102949] p-8 md:p-12 rounded-3xl border border-[#D4A437]/40 shadow-2xl">
            
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-6 items-center lg:items-start text-center lg:text-left">
              <div className="w-40 sm:w-48 lg:w-56 shrink-0 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4A437]/40 transition-all hover:scale-[1.03] duration-300">
                <img
                  src="/guide-cover.jpg"
                  alt="Nam Kanavu Illam Guide Cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-r from-[#F2C14E] to-[#D4A437] text-[#081C35] rounded-xl inline-block shadow-md">
                  <span className="text-xs font-black tracking-widest uppercase">
                    THE HOME BUILDER'S GUIDE
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black font-heading text-white uppercase">
                  📘 Free Home Builder's Guide
                </h2>
                <p className="text-slate-300 text-xs md:text-sm">
                  Written by Er. Maha Rajan (Government Registered Engineer). Practical tips to save lakhs and guarantee structural quality.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#081C35] p-6 md:p-8 rounded-2xl border border-[#D4A437]/40 shadow-inner">
              <h3 className="text-lg font-black text-[#F2C14E] font-heading uppercase mb-2">
                GET YOUR FREE HOME BUILDER'S GUIDE!
              </h3>
              <p className="text-xs text-slate-300 mb-6">
                Avoid costly mistakes and save lakhs in your construction. Practical tips from a Government Registered Engineer. Enter your details to get the full PDF document immediately.
              </p>

              {guideSubmitted ? (
                <div className="p-6 bg-[#22C55E]/10 border border-[#22C55E] rounded-2xl text-center">
                  <FiCheckCircle size={36} className="text-[#22C55E] mx-auto mb-2" />
                  <h4 className="text-base font-bold text-white">Guide Sent Successfully!</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Thank you {guideName}! Your download has started automatically. If it didn't start, please click the button below to download it manually:
                  </p>
                  <a
                    href={guidePdfUrl}
                    download="Nam_Kanavu_Illam_Guide.pdf"
                    className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F2C14E] to-[#D4A437] text-[#081C35] font-black text-xs tracking-widest uppercase rounded-xl transition-all cursor-pointer shadow-lg"
                  >
                    <FiDownload size={14} /> Download PDF Again
                  </a>
                </div>
              ) : (
                <form onSubmit={handleGuideSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={guideName}
                      onChange={(e) => setGuideName(e.target.value)}
                      className="w-full bg-[#102949] border border-[#D4A437]/40 text-white text-xs px-4 py-3.5 rounded-xl outline-none focus:border-[#F2C14E] transition-colors placeholder:text-slate-500"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Mobile Number *"
                      value={guidePhone}
                      onChange={(e) => setGuidePhone(e.target.value)}
                      className="w-full bg-[#102949] border border-[#D4A437]/40 text-white text-xs px-4 py-3.5 rounded-xl outline-none focus:border-[#F2C14E] transition-colors placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <input
                    type="email"
                    placeholder="Gmail Address / Email *"
                    value={guideEmail}
                    onChange={(e) => setGuideEmail(e.target.value)}
                    className="w-full bg-[#102949] border border-[#D4A437]/40 text-white text-xs px-4 py-3.5 rounded-xl outline-none focus:border-[#F2C14E] transition-colors placeholder:text-slate-500"
                    required
                  />

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#F2C14E] via-[#D4A437] to-[#B8860B] text-[#081C35] font-black text-xs tracking-widest uppercase rounded-xl transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2"
                  >
                    <FiDownload size={16} /> SEND & DOWNLOAD MY FREE GUIDE
                  </button>
                  <p className="text-[10px] text-slate-400 text-center">We respect your privacy. No spam ever.</p>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>


      {/* ── 11. SOCIAL MEDIA FOLLOW CARDS (Soft Off-White Background) ── */}
      <section className="py-20 md:py-28 border-b border-[#E8E8E8] bg-[#FAFAFA] text-[#081C35] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[11px] font-black tracking-[0.25em] text-[#D4A437] uppercase bg-white px-4 py-1.5 rounded-full border border-[#D4A437]/40 shadow-xs">
              JOIN OUR COMMUNITY
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-heading text-[#081C35] mt-4 uppercase">
              Follow Our Construction Journey
            </h2>
            <p className="text-slate-600 text-sm mt-3 font-medium">
              Stay updated with live site walkthroughs, structural engineering tips, and home designs across Tamil Nadu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">

            {/* 1. INSTAGRAM CARD */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#E8E8E8] shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              <div className="h-2.5 w-full bg-gradient-to-r from-[#F09433] via-[#DC2743] to-[#BC1888]" />

              <div className="p-7 text-center flex flex-col items-center flex-grow">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#F09433] via-[#DC2743] to-[#BC1888] shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-white p-1.5 flex items-center justify-center overflow-hidden">
                      <img
                        src="/logo.png"
                        alt="MAHA CONSTRUCTIONS"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-[#081C35] font-black text-xs uppercase font-heading">MAHA</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#1877F2] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <FiCheck size={14} className="stroke-[3]" />
                  </div>
                </div>

                <span className="text-[11px] font-black tracking-[0.2em] text-[#DC2743] uppercase mb-1">
                  INSTAGRAM
                </span>
                <h3 className="text-base font-black text-[#081C35] font-heading">
                  @mahaconstructions_2013
                </h3>

                <div className="h-1 w-10 bg-gradient-to-r from-[#F09433] to-[#BC1888] rounded-full my-4" />

                <div className="mt-auto">
                  <div className="text-3xl font-black text-[#DC2743] font-heading tracking-tight">
                    15K+
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase">
                    FOLLOWERS
                  </span>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href="https://www.instagram.com/mahaconstructions_2013?igsh=amF2M2VhMmFwMnU0"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 bg-gradient-to-r from-[#F09433] via-[#DC2743] to-[#BC1888] hover:opacity-95 text-white font-black text-xs tracking-widest uppercase rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaInstagram size={17} /> Follow Us
                </a>
              </div>
            </div>


            {/* 2. FACEBOOK CARD */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#E8E8E8] shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              <div className="h-2.5 w-full bg-[#1877F2]" />

              <div className="p-7 text-center flex flex-col items-center flex-grow">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full p-1 bg-[#1877F2] shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-white p-1.5 flex items-center justify-center overflow-hidden">
                      <img
                        src="/logo.png"
                        alt="MAHA CONSTRUCTIONS"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-[#081C35] font-black text-xs uppercase font-heading">MAHA</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#1877F2] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <FiCheck size={14} className="stroke-[3]" />
                  </div>
                </div>

                <span className="text-[11px] font-black tracking-[0.2em] text-[#1877F2] uppercase mb-1">
                  FACEBOOK
                </span>
                <h3 className="text-base font-black text-[#081C35] font-heading">
                  mahaconstructions
                </h3>

                <div className="h-1 w-10 bg-[#1877F2] rounded-full my-4" />

                <div className="mt-auto">
                  <div className="text-3xl font-black text-[#1877F2] font-heading tracking-tight">
                    20K+
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase">
                    FOLLOWERS
                  </span>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href="https://www.facebook.com/share/17Adgojfej/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 bg-[#1877F2] hover:bg-[#166FE5] text-white font-black text-xs tracking-widest uppercase rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaFacebookF size={16} /> Like Page
                </a>
              </div>
            </div>


            {/* 3. YOUTUBE CARD */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#E8E8E8] shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              <div className="h-2.5 w-full bg-[#FF0000]" />

              <div className="p-7 text-center flex flex-col items-center flex-grow">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full p-1 bg-[#FF0000] shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-white p-1.5 flex items-center justify-center overflow-hidden">
                      <img
                        src="/logo.png"
                        alt="MAHA CONSTRUCTIONS"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-[#081C35] font-black text-xs uppercase font-heading">MAHA</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#FF0000] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <FiCheck size={14} className="stroke-[3]" />
                  </div>
                </div>

                <span className="text-[11px] font-black tracking-[0.2em] text-[#FF0000] uppercase mb-1">
                  YOUTUBE
                </span>
                <h3 className="text-base font-black text-[#081C35] font-heading">
                  @mahaconstructions2013
                </h3>

                <div className="h-1 w-10 bg-[#FF0000] rounded-full my-4" />

                <div className="mt-auto">
                  <div className="text-3xl font-black text-[#FF0000] font-heading tracking-tight">
                    30K+
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase">
                    SUBSCRIBERS
                  </span>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href="https://www.youtube.com/@mahaconstructions2013"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 bg-[#FF0000] hover:bg-[#D90000] text-white font-black text-xs tracking-widest uppercase rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaYoutube size={18} /> Subscribe
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ── MODALS ── */}
      {/* 1. FULLSCREEN VIDEO MODAL */}
      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-md flex flex-col items-center justify-center"
            onClick={() => setActiveVideoUrl(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setActiveVideoUrl(null); }}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-10 h-10 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-all border border-white/20 cursor-pointer"
            >
              <FiX size={20} />
            </button>

            <div
              className="relative w-full max-w-5xl px-4 md:px-8"
              onClick={(e) => e.stopPropagation()}
            >
              {activeVideoList.length > 0 && (
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F2C14E] bg-[#102949] px-3 py-1 rounded-full border border-[#D4A437]/40">
                    CLIENT STORY
                  </span>
                </div>
              )}

              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black" style={{ paddingBottom: "56.25%" }}>
                <div className="absolute inset-0">
                  {activeVideoUrl.includes("youtube.com") || activeVideoUrl.includes("youtu.be") ? (
                    <iframe
                      key={activeVideoUrl}
                      width="100%"
                      height="100%"
                      src={activeVideoUrl}
                      title="Video Player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <video
                      key={activeVideoUrl}
                      src={activeVideoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>

              {activeVideoList.length > 1 && (
                <div className="flex items-center justify-center gap-4 mt-5">
                  <button
                    onClick={modalPrev}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D4A437] hover:text-[#081C35] text-white flex items-center justify-center transition-all border border-white/20 cursor-pointer"
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  <span className="text-white/80 text-sm font-black tracking-wider px-4 py-2 bg-white/10 rounded-full border border-white/20">
                    {activeVideoIndex + 1} / {activeVideoList.length}
                  </span>
                  <button
                    onClick={modalNext}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D4A437] hover:text-[#081C35] text-white flex items-center justify-center transition-all border border-white/20 cursor-pointer"
                  >
                    <FiChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* 2. PACKAGE DETAILS MODAL */}
      <AnimatePresence>
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#081C35]/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-lg bg-[#102949] border-2 border-[#D4A437] rounded-3xl overflow-hidden shadow-2xl p-6 text-white">
              <button
                onClick={() => setSelectedPackage(null)}
                className="absolute top-4 right-4 text-white bg-[#081C35] p-2 rounded-full border border-[#D4A437]/40 hover:bg-[#D4A437] hover:text-[#081C35]"
              >
                <FiX size={20} />
              </button>

              <span className="text-[10px] font-black tracking-widest text-[#F2C14E] uppercase">
                PACKAGE DETAILS
              </span>
              <h3 className="text-2xl font-black font-heading uppercase text-white mt-1">
                {selectedPackage.title} PACKAGE
              </h3>
              <p className="text-xs text-slate-300 font-medium mb-4">{selectedPackage.tagline}</p>

              <div className="p-4 bg-[#081C35] rounded-2xl border border-[#D4A437]/40 text-center mb-6">
                <span className="text-3xl font-black text-[#F2C14E] font-heading">{selectedPackage.price}</span>
                <span className="text-xs text-slate-400 uppercase"> / sq.ft</span>
              </div>

              <h4 className="text-xs font-black text-[#F2C14E] uppercase tracking-wider mb-3">
                KEY INCLUDED FEATURES
              </h4>
              <ul className="space-y-2.5 mb-6 text-xs text-slate-200">
                {selectedPackage.features.map((feat: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <FiCheck className="text-[#F2C14E] shrink-0 mt-0.5" size={15} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-3">
                <a
                  href="https://wa.me/919488888758"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3.5 bg-[#25D366] text-white font-black text-xs uppercase rounded-xl text-center shadow-lg"
                >
                  ENQUIRE ON WHATSAPP
                </a>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="px-6 py-3.5 bg-[#081C35] border border-[#D4A437]/40 text-white font-bold text-xs uppercase rounded-xl"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* 3. COMPARE PACKAGES MODAL */}
      <AnimatePresence>
        {compareModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#081C35]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="relative w-full max-w-4xl bg-[#102949] border-2 border-[#D4A437] rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 my-8 text-white">
              <button
                onClick={() => setCompareModalOpen(false)}
                className="absolute top-4 right-4 text-white bg-[#081C35] p-2 rounded-full border border-[#D4A437]/40 hover:bg-[#D4A437] hover:text-[#081C35]"
              >
                <FiX size={20} />
              </button>

              <h3 className="text-2xl font-black text-white font-heading uppercase text-center mb-6">
                Construction Packages Comparison Matrix
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-200">
                  <thead className="text-[11px] text-[#F2C14E] uppercase bg-[#081C35] border-b border-[#D4A437]/40">
                    <tr>
                      <th className="p-3">Feature</th>
                      <th className="p-3">BASIC (₹1,850)</th>
                      <th className="p-3">STANDARD (₹2,250)</th>
                      <th className="p-3">PREMIUM (₹2,750)</th>
                      <th className="p-3">LUXURY (₹3,450)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    <tr>
                      <td className="p-3 font-bold text-white">Steel Grade</td>
                      <td className="p-3">Fe-500 TMT</td>
                      <td className="p-3 text-[#F2C14E] font-bold">Fe-550 JSW/Tata</td>
                      <td className="p-3">Tata Tiscon</td>
                      <td className="p-3">Tata Tiscon Super</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Flooring</td>
                      <td className="p-3">Vitrified Tiles (₹55/sqft)</td>
                      <td className="p-3">Kajaria Tiles (₹85/sqft)</td>
                      <td className="p-3">Granite / Vitrified (₹130/sqft)</td>
                      <td className="p-3 text-[#F2C14E] font-bold">Italian Marble (₹250+/sqft)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Sanitary Fittings</td>
                      <td className="p-3">Parryware / Cera</td>
                      <td className="p-3">Jaquar Collection</td>
                      <td className="p-3">Kohler Collection</td>
                      <td className="p-3 text-[#F2C14E] font-bold">Grohe / Kohler Imported</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Main Door</td>
                      <td className="p-3">Flush Door</td>
                      <td className="p-3">Teak Wood Frame</td>
                      <td className="p-3">Solid Teak Wood</td>
                      <td className="p-3 text-[#F2C14E] font-bold">Custom Carved Luxury Teak</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Warranty</td>
                      <td className="p-3">10 Years</td>
                      <td className="p-3">10 Years</td>
                      <td className="p-3 text-[#F2C14E] font-bold">15 Years</td>
                      <td className="p-3 text-[#F2C14E] font-bold">20 Years Registered</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setCompareModalOpen(false)}
                  className="px-8 py-3 bg-[#081C35] hover:bg-[#D4A437] hover:text-[#081C35] border border-[#D4A437]/40 text-white font-black text-xs uppercase rounded-xl transition-all"
                >
                  CLOSE COMPARISON
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
