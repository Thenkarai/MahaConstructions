import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize2, FiRotateCw } from "react-icons/fi";

interface ImageViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
  isThreeSixty?: boolean;
}

export default function ImageViewer({ images, initialIndex, onClose, isThreeSixty = false }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [panMode, setPanMode] = useState(isThreeSixty);
  const [dragOffset, setDragOffset] = useState(0);
  const panContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const activeImage = images[currentIndex] || "";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setDragOffset(0);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setDragOffset(0);
  };

  // Drag panning math for 360-degree mockup
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!panMode) return;
    isDragging.current = true;
    startX.current = e.clientX - dragOffset;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !panMode) return;
    const offset = e.clientX - startX.current;
    // Bound the pan offset between visual limits
    setDragOffset(Math.max(-400, Math.min(400, offset)));
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#081C35]/98 z-9999 flex flex-col justify-between p-6 select-none"
      >
        {/* Top bar controls */}
        <div className="flex justify-between items-center text-white z-10">
          <div className="text-xs tracking-widest text-white/50">
            {currentIndex + 1} / {images.length}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setPanMode(!panMode)}
              className={`p-2 rounded border transition-colors flex items-center gap-1.5 text-xs font-semibold tracking-wider cursor-pointer ${
                panMode
                  ? "bg-[#D4A437] border-[#D4A437] text-[#081C35]"
                  : "border-white/10 text-white/70 hover:text-white"
              }`}
              title="Toggle interactive panorama mode"
            >
              <FiRotateCw size={14} /> 360° MOCK
            </button>
            <button
              onClick={onClose}
              className="p-2 border border-white/10 hover:border-white/30 rounded text-white/70 hover:text-white cursor-pointer"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Center Canvas */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
          {/* Navigation Arrows */}
          {images.length > 1 && !panMode && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 p-4 border border-white/10 bg-[#081C35]/40 hover:bg-[#D4A437] text-white hover:text-[#081C35] rounded-full z-10 transition-all cursor-pointer"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 p-4 border border-white/10 bg-[#081C35]/40 hover:bg-[#D4A437] text-white hover:text-[#081C35] rounded-full z-10 transition-all cursor-pointer"
              >
                <FiChevronRight size={24} />
              </button>
            </>
          )}

          {/* Interactive display area */}
          <div
            ref={panContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`w-full max-w-5xl h-[70vh] flex items-center justify-center relative overflow-hidden ${
              panMode ? "cursor-grab active:cursor-grabbing" : ""
            }`}
          >
            {panMode ? (
              <div
                style={{
                  transform: `translateX(${dragOffset}px) scale(1.3)`,
                  transition: isDragging.current ? "none" : "transform 0.4s ease-out"
                }}
                className="absolute w-[180%] h-full flex items-center justify-center"
              >
                <img
                  src={activeImage}
                  alt="360 View"
                  className="w-full h-full object-cover pointer-events-none filter brightness-95"
                />
              </div>
            ) : (
              <motion.img
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={activeImage}
                alt="Architecture presentation"
                className="max-w-full max-h-full object-contain pointer-events-none rounded shadow-2xl"
              />
            )}

            {panMode && (
              <div className="absolute bottom-4 bg-[#081C35]/70 backdrop-blur text-[10px] text-[#D4A437] tracking-[0.2em] font-semibold border border-white/10 px-4 py-2 rounded pointer-events-none">
                DRAG LEFT/RIGHT TO EXPLORE WIDE VIEW
              </div>
            )}
          </div>
        </div>

        {/* Bottom gallery tray */}
        <div className="flex justify-center gap-2 overflow-x-auto py-2 z-10 no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setDragOffset(0);
              }}
              className={`w-14 h-10 md:w-20 md:h-14 rounded overflow-hidden shrink-0 border transition-all cursor-pointer ${
                idx === currentIndex ? "border-[#D4A437] scale-105" : "border-white/10 opacity-40 hover:opacity-75"
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

