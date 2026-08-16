import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMaximize2, FiVideo, FiRotateCw } from "react-icons/fi";
import ImageViewer from "../components/ImageViewer";

export default function Gallery() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  
  // Lightbox control states
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const localFallbackGallery = [
    { id: 1, title: "Living Room Minimalist Plaster", category: "interior", image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80", is_video: false },
    { id: 2, title: "Board Formed Concrete Facade", category: "residential", image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", is_video: false },
    { id: 3, title: "Skyscraper Steel Framing", category: "commercial", image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", is_video: false },
    { id: 4, title: "Travertine Floating Stairs", category: "interior", image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80", is_video: false },
    { id: 5, title: "Oceanfront Pool Overhang", category: "residential", image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", is_video: false }
  ];

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        setGallery(data.length > 0 ? data : localFallbackGallery);
      })
      .catch(() => {
        setGallery(localFallbackGallery);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleOpenViewer = (idx: number) => {
    setViewerIndex(idx);
    setViewerOpen(true);
  };

  const filtered = filter === "all"
    ? gallery
    : gallery.filter(item => item.category === filter);

  // Extract urls list for viewer
  const imageUrls = filtered.map(item => item.image_url);

  return (
    <div className="w-full pt-32 pb-24 bg-white min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title */}
        <div className="mb-20 text-center md:text-left">
          <span className="text-[10px] tracking-[0.4em] text-[#D4A437] font-semibold uppercase">VISUAL PORTFOLIO</span>
          <h1 className="text-3xl md:text-5xl font-black font-heading text-[#081C35] mt-3 mb-6 uppercase">
            STRUCTURAL GALLERY
          </h1>
          <p className="text-xs md:text-sm text-slate-700 font-medium max-w-2xl leading-relaxed">
            A curated photographic feed of our structural envelope connections, raw plaster interior finish mockups, and construction site frameworks.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-4 mb-16 text-[10px] tracking-widest font-semibold justify-center md:justify-start">
          {["all", "residential", "commercial", "interior"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 border rounded transition-all cursor-pointer ${
                filter === cat
                  ? "bg-[#081C35] border-[#081C35] text-white"
                  : "border-slate-200 text-[#081C35]/60 hover:border-[#081C35] hover:text-[#081C35]"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="w-full flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4A437]" />
          </div>
        ) : (
          /* Masonry Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleOpenViewer(idx)}
                className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer h-[260px] md:h-[320px] bg-slate-50 border border-slate-200"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 filter brightness-95"
                />
                
                {/* Hover overlay details */}
                <div className="absolute inset-0 bg-[#081C35]/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-white">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] tracking-widest font-semibold text-[#D4A437] uppercase border border-[#D4A437]/30 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <div className="flex gap-2">
                      {item.is_video && <FiVideo size={14} className="text-white" />}
                      <FiMaximize2 size={14} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-wider font-heading uppercase mb-1">{item.title}</h3>
                    <span className="text-[10px] text-white/50 tracking-widest font-medium">EXPAND ASSET</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Screen viewer */}
      {viewerOpen && (
        <ImageViewer
          images={imageUrls}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
}


