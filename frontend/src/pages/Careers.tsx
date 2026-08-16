import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBriefcase, FiMapPin, FiClock, FiX, FiCheck } from "react-icons/fi";

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const jobs = [
    {
      id: 1,
      title: "Senior Parametric Architect",
      department: "Design & Architectural Modeling",
      location: "Los Angeles, CA",
      type: "Full-Time",
      desc: "Lead schematic and form-finding drafts for coastal villas and commercial towers. Expert proficiency in Rhino, Grasshopper, and Revit BIM systems is required.",
      requirements: [
        "Master of Architecture (M.Arch) or equivalent",
        "5+ years of design experience in parametric structures",
        "Expert BIM Revit modeling coordination",
        "Strong portfolio of minimalist residential designs"
      ]
    },
    {
      id: 2,
      title: "Lead Structural Concrete Engineer",
      department: "Structural Engineering",
      location: "Chicago, IL",
      type: "Full-Time",
      desc: "Oversee seismic calculations, board-formed casting quality controls, and deep-foundation coastal anchors for complex cliffside villas.",
      requirements: [
        "PE or SE licensure required",
        "BS or MS in Civil/Structural Engineering",
        "Experience executing high-strength architectural concrete pours",
        "Deep familiarity with wind load seismic modeling software"
      ]
    }
  ];

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setSelectedJob(null);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="w-full pt-32 pb-24 bg-white min-h-[90vh]">
      <div className="max-w-4xl mx-auto px-6">
        {/* Title */}
        <div className="mb-20 text-center md:text-left">
          <span className="text-[10px] tracking-[0.4em] text-[#D4A437] font-semibold uppercase">JOIN THE MASTERS</span>
          <h1 className="text-3xl md:text-5xl font-black font-heading text-[#081C35] mt-3 mb-6 uppercase">
            CAREER OPENINGS
          </h1>
          <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed max-w-xl">
            We are looking for elite structural engineers, BIM architects, and luxury project managers who value precision, raw material integrity, and innovative designs.
          </p>
        </div>

        {/* Job Openings Grid List */}
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-50 border border-slate-200 p-8 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow"
            >
              <div>
                <span className="text-[9px] tracking-widest text-[#D4A437] font-bold uppercase block mb-1">
                  {job.department}
                </span>
                <h3 className="text-base font-bold font-heading text-[#081C35] uppercase mb-3">
                  {job.title}
                </h3>
                <div className="flex gap-4 text-[10px] text-slate-700 font-medium mb-4">
                  <span className="flex items-center gap-1.5"><FiMapPin /> {job.location}</span>
                  <span className="flex items-center gap-1.5"><FiBriefcase /> {job.type}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed max-w-xl">
                  {job.desc}
                </p>
              </div>

              <button
                onClick={() => setSelectedJob(job)}
                className="px-6 py-3.5 bg-[#081C35] hover:bg-[#D4A437] text-white hover:text-[#081C35] text-[10px] tracking-widest font-semibold rounded shrink-0 transition-colors cursor-pointer"
              >
                APPLY SPEC
              </button>
            </div>
          ))}
        </div>

        {/* Application form popup modal */}
        <AnimatePresence>
          {selectedJob && (
            <div className="fixed inset-0 bg-[#081C35]/45 backdrop-blur-sm z-50 flex items-center justify-center p-6 text-white">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-lg bg-[#081C35] border border-white/10 rounded-xl p-8 relative shadow-2xl"
              >
                <button
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer"
                >
                  <FiX size={18} />
                </button>

                <span className="text-[9px] tracking-[0.25em] text-[#D4A437] font-bold uppercase block mb-1">
                  APPLICATION SPEC
                </span>
                <h3 className="text-xl font-bold font-heading uppercase mb-6 leading-tight">
                  {selectedJob.title}
                </h3>

                {formSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-green-500/10 border border-green-500 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <FiCheck size={20} />
                    </div>
                    <h4 className="text-sm font-bold tracking-widest uppercase mb-1">DOSSIER SUBMITTED</h4>
                    <p className="text-[10px] text-white/50">Our engineering directors will review your files.</p>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    <div>
                      <label className="text-[9px] tracking-widest text-white/50 font-bold block mb-1.5 uppercase">FULL NAME</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-xs px-4 py-3 rounded outline-none focus:border-[#D4A437]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest text-white/50 font-bold block mb-1.5 uppercase">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        required
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-xs px-4 py-3 rounded outline-none focus:border-[#D4A437]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest text-white/50 font-bold block mb-1.5 uppercase">PORTFOLIO LINK</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        required
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-xs px-4 py-3 rounded outline-none focus:border-[#D4A437]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-widest text-white/50 font-bold block mb-1.5 uppercase">COVER COVERAGE</label>
                      <textarea
                        rows={3}
                        placeholder="Briefly state your alignment with our design philosophy..."
                        required
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-xs px-4 py-3 rounded outline-none focus:border-[#D4A437] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-[#D4A437] hover:bg-white text-[#081C35] hover:text-[#081C35] text-[10px] tracking-widest font-semibold rounded transition-colors uppercase cursor-pointer"
                    >
                      {submitting ? "UPLOADING DOSSIER..." : "SUBMIT APPLICATION"}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


