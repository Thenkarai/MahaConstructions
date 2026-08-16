import { motion } from "framer-motion";
import { FiAward, FiShield, FiHeart, FiTrendingUp } from "react-icons/fi";

export default function About() {
  const leadership = [
    { name: "Julian Sterling", role: "Principal Architect & Founder", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80" },
    { name: "Marcus Vane", role: "Chief of Structural Engineering", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80" },
    { name: "Elena Rostova", role: "Director of Interior Architecture", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80" }
  ];

  const milestones = [
    { year: "2012", title: "FOUNDATION", desc: "Julian Sterling establishes Maha in LA, focusing on custom architectural structures." },
    { year: "2016", title: "EXPANSION TO COMMERCIAL", desc: "Securing contracts for the Lumina Tech campus core, branching into premium office landmarks." },
    { year: "2020", title: "SUSTAINABILITY INITIATIVE", desc: "Transitioning to a carbon-neutral build process and launching geothermal concrete foundations." },
    { year: "2024", title: "GLOBAL PARTNERSHIP", desc: "Setting up European and Japanese hubs to coordinate global luxury estates construction." }
  ];

  const awards = [
    { name: "Pritzker Structural Award", organization: "Global Design Guild", year: "2023" },
    { name: "Excellence in Sustainable Building", organization: "Green Building Alliance", year: "2021" },
    { name: "Best Residential Concept", organization: "Architectural Review", year: "2019" }
  ];

  return (
    <div className="w-full pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Block */}
        <div className="mb-20 text-center md:text-left">
          <span className="text-[10px] tracking-[0.4em] text-[#D4A437] font-semibold uppercase">WHO WE ARE</span>
          <h1 className="text-3xl md:text-5xl font-black font-heading text-[#081C35] mt-3 mb-6 uppercase">
            A LEGACY OF STRUCTURAL ARTISTRY
          </h1>
          <p className="text-xs md:text-sm text-slate-700 font-medium max-w-2xl leading-relaxed">
            Maha Construction is a global design-build collective. We unify avant-garde architectural schematics, absolute structural engineering, and artisan finishes under a single execution model to create living landmarks.
          </p>
        </div>

        {/* Philosophy, Mission, Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-20 border-b border-slate-200">
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] font-heading text-[#081C35] mb-4 uppercase">OUR MISSION</h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              To construct timeless architecture that represents structural honesty. We refuse to compromise on material purity, structural safety tolerances, or client-tailored exclusivity.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] font-heading text-[#081C35] mb-4 uppercase">OUR VISION</h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              To define the luxury skyline of the next century, blending carbon-neutral green technologies with sculptural forms that elevate the human experience of space.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] font-heading text-[#081C35] mb-4 uppercase">CONSTRUCTION PHILOSOPHY</h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              We stand for "honest materialism." Travertine stone is left raw, steel maintains its charcoal matte scale, and board-formed concrete retains the wood-grain imprint of its casting form.
            </p>
          </div>
        </div>

        {/* Milestones History Timeline */}
        <div className="py-20 border-b border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[10px] tracking-[0.3em] text-[#D4A437] font-semibold uppercase">JOURNEY MAP</span>
            <h2 className="text-2xl font-medium font-heading tracking-widest text-[#081C35] mt-2">OUR CHRONOLOGICAL TIMELINE</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {milestones.map((ms, idx) => (
              <div key={idx} className="relative">
                <div className="text-3xl font-bold font-heading text-[#D4A437]/30 border-b border-[#D4A437]/25 pb-4 mb-4">
                  {ms.year}
                </div>
                <h4 className="text-xs font-bold tracking-widest text-[#081C35] mb-2 uppercase">
                  {ms.title}
                </h4>
                <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                  {ms.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="py-20 border-b border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[10px] tracking-[0.3em] text-[#D4A437] font-semibold uppercase">THE CRAFTSMEN</span>
            <h2 className="text-2xl font-medium font-heading tracking-widest text-[#081C35] mt-2">LEADERSHIP DIRECTORS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((member, idx) => (
              <div key={idx} className="group flex flex-col items-center text-center">
                <div className="w-full h-[320px] rounded-lg overflow-hidden mb-6 shadow-md relative">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-[#081C35]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-base font-bold font-heading text-[#081C35] uppercase">
                  {member.name}
                </h3>
                <p className="text-[11px] text-slate-700 tracking-wider mt-1">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Office Gallery & Awards Grid */}
        <div className="py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Awards */}
          <div className="lg:col-span-5">
            <span className="text-[10px] tracking-[0.3em] text-[#D4A437] font-semibold uppercase">GLOBAL COMMENDATIONS</span>
            <h2 className="text-2xl font-medium font-heading tracking-widest text-[#081C35] mt-2 mb-8 uppercase">AWARDS & LAURELS</h2>
            <div className="space-y-6">
              {awards.map((award, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <div>
                    <h4 className="text-xs font-bold tracking-wider text-[#081C35] uppercase">{award.name}</h4>
                    <p className="text-[10px] text-slate-700 mt-1">{award.organization}</p>
                  </div>
                  <span className="text-xs font-bold text-[#D4A437] font-heading">{award.year}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Office Gallery */}
          <div className="lg:col-span-7">
            <span className="text-[10px] tracking-[0.3em] text-[#D4A437] font-semibold uppercase">CREATIVE HQS</span>
            <h2 className="text-2xl font-medium font-heading tracking-widest text-[#081C35] mt-2 mb-8 uppercase">OUR CREATIVE CULTURE</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-[220px] rounded-lg overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=80"
                  className="w-full h-full object-cover filter brightness-95"
                  alt="Office Meeting"
                />
              </div>
              <div className="h-[220px] rounded-lg overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=500&q=80"
                  className="w-full h-full object-cover filter brightness-95"
                  alt="Office Desk"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


