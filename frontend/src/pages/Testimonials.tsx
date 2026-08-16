import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlay, FiX, FiArrowRight, FiVideo, FiMapPin, FiUser, FiCalendar } from "react-icons/fi";
import { getEmbedVideoUrl, isYouTubeUrl } from "../utils/videoUtils";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    // 1. Try reading from backend API first
    fetch("http://localhost:8000/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        } else {
          throw new Error("No backend data");
        }
      })
      .catch(() => {
        // 2. Fallback to localStorage
        const localVideoReviews = localStorage.getItem("maha_video_testimonials");
        if (localVideoReviews) {
          try {
            const parsed = JSON.parse(localVideoReviews);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setTestimonials(parsed);
              return;
            }
          } catch (e) {}
        }

        // 3. Fallback to uploaded video reviews
        setTestimonials([
          {
            id: "vt1",
            client_name: "Mr. Suresh Kumar & Family",
            client_role: "Homeowner, Nagercoil",
            project_name: "3,200 sq.ft Luxury Villa",
            video_url: "http://localhost:8000/uploads/1785710590_WhatsApp%20Video%202026-07-29%20at%2011.16.33%20PM.mp4",
            image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
            duration: "2:45"
          },
          {
            id: "vt2",
            client_name: "Er. Rajesh K. & Family",
            client_role: "Client, Marthandam",
            project_name: "2,400 sq.ft Modern Home",
            video_url: "http://localhost:8000/uploads/1785710633_Maha%20Construction.mp4",
            image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            duration: "3:10"
          },
          {
            id: "vt3",
            client_name: "Pudhugramam Homeowner",
            client_role: "Villa Client, Kanyakumari",
            project_name: "Pudhugramam Site Review",
            video_url: "http://localhost:8000/uploads/1785710665_Pudhugramam%20site%20video.mp4",
            image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
            duration: "4:15"
          }
        ]);
      });
  }, []);

  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F8F8] pt-32 pb-24 text-[#071B35]">
      {/* Background Grids */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <div className="absolute left-0 top-0 w-full h-full bg-[linear-gradient(to_right,#C99A3A_1px,transparent_1px),linear-gradient(to_bottom,#C99A3A_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8F8F8] border border-[#E6C36A] text-[11px] font-black tracking-[0.25em] text-[#C99A3A] uppercase mb-4">
            <FiVideo size={14} /> CLIENT VIDEO TESTIMONIALS
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-heading text-[#071B35] uppercase leading-tight mb-4">
            LIVE CLIENT <span className="text-[#C99A3A]">VIDEO REVIEWS</span>
          </h1>
          <div className="w-20 h-1 bg-[#C99A3A] mx-auto mb-6 rounded-full" />
          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
            Watch real video walkthroughs and authentic video reviews from homeowners, business leaders, and clients who commissioned Maha Constructions.
          </p>
        </div>

        {/* Video Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((test, index) => {
            const videoUrl = test.videoUrl || test.video_url || "";
            const thumbnail = test.thumbnail || test.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
            const clientName = test.name || test.client_name || "Valued Client";
            const location = test.location || test.client_role || "Tamil Nadu";
            const projectName = test.project_name || test.title || "Custom Home Construction";
            const duration = test.duration || "2:30";

            return (
              <motion.div
                key={test.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white border border-[#E8E8E8] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                onClick={() => videoUrl && setActiveVideoUrl(videoUrl)}
              >
                {/* Video Thumbnail Box */}
                <div className="relative h-56 md:h-64 overflow-hidden bg-black">
                  {videoUrl && !isYouTubeUrl(videoUrl) ? (
                    <video
                      src={videoUrl}
                      preload="metadata"
                      className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <img
                      src={thumbnail}
                      alt={clientName}
                      className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  )}
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 m-auto w-16 h-16 bg-[#C99A3A] hover:bg-[#D8AA47] text-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <FiPlay size={26} className="ml-1" />
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/85 backdrop-blur-md rounded-lg text-[11px] font-black text-white tracking-wider">
                    {duration}
                  </div>

                  {/* Project Tag */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-[#071B35]/90 backdrop-blur-md rounded-full text-[10px] font-extrabold text-[#E6C36A] uppercase tracking-wider border border-[#E6C36A]/30">
                    {projectName}
                  </div>
                </div>

                {/* Client & Video Metadata */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black font-heading text-[#071B35] uppercase tracking-wide group-hover:text-[#C99A3A] transition-colors flex items-center gap-2">
                        <FiUser size={14} className="text-[#C99A3A]" /> {clientName}
                      </h3>
                      <p className="text-xs text-slate-500 font-bold tracking-wider mt-1 flex items-center gap-1.5">
                        <FiMapPin size={12} className="text-[#C99A3A]" /> {location}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        videoUrl && setActiveVideoUrl(videoUrl);
                      }}
                      className="px-4 py-2 bg-[#F8F8F8] hover:bg-[#C99A3A] text-[#C99A3A] hover:text-white border border-[#E6C36A] rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <FiPlay size={12} /> WATCH REVIEW
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA consultative Section */}
        <section className="bg-[#071B35] text-white mt-24 py-16 px-8 rounded-3xl relative overflow-hidden text-center border border-white/10 shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-[11px] tracking-[0.3em] text-[#E6C36A] font-black uppercase block">
              START YOUR DREAM HOME TODAY
            </span>
            <h2 className="text-2xl md:text-3xl font-black font-heading uppercase leading-tight">
              Ready to Join Our Happy Homeowners?
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed max-w-md mx-auto">
              Consult directly with Er. Maha Rajan (Government Registered Engineer) for a transparent quote and 3D plan.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#F2C14E] via-[#D4A437] to-[#B8860B] hover:from-[#FBE395] hover:to-[#E2B242] text-[#081C35] font-black text-xs md:text-sm tracking-widest rounded-2xl transition-all duration-300 cursor-pointer shadow-[0_10px_35px_rgba(242,193,78,0.5)] border-2 border-[#FFF099] hover:scale-105 uppercase"
              >
                <FiCalendar size={18} className="stroke-[2.5]" /> REQUEST FREE CONSULTATION <FiArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideoUrl && (
          <div className="fixed inset-0 bg-[#071B35]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-black border border-white/20 rounded-3xl relative shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-4 right-4 text-white hover:text-[#E6C36A] cursor-pointer bg-white/20 hover:bg-white/30 p-2.5 rounded-full z-10 transition-colors"
              >
                <FiX size={20} />
              </button>

              {isYouTubeUrl(activeVideoUrl) ? (
                <iframe
                  src={getEmbedVideoUrl(activeVideoUrl)}
                  title="Client Video Testimonial"
                  className="w-full h-[60vh] md:h-[75vh] border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={getEmbedVideoUrl(activeVideoUrl)}
                  controls
                  autoPlay
                  playsInline
                  className="w-full max-h-[80vh] object-contain"
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
