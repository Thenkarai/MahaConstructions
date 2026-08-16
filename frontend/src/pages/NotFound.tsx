import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center bg-[#081C35] text-white p-6 relative overflow-hidden">
      {/* Background architectural grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute left-0 top-0 w-full h-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        <span className="text-[10px] tracking-[0.4em] text-[#D4A437] font-semibold block mb-4">CODE 404</span>
        <h1 className="text-6xl md:text-8xl font-heading font-medium tracking-tighter text-[#D4A437] select-none mb-6">
          EMPTY CORE
        </h1>
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-4">THE STRUCTURE DOES NOT EXIST</h2>
        <p className="text-xs text-white/50 leading-relaxed font-medium mb-8">
          The architectural coordinates you requested are outside our registered blueprint boundary. The page may have been relocated.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#D4A437] hover:bg-white text-[#081C35] hover:text-[#081C35] font-semibold text-xs tracking-widest rounded transition-colors uppercase cursor-pointer"
        >
          RETURN HOME <FiArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

