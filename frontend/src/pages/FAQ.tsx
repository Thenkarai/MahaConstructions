import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiSearch } from "react-icons/fi";

export default function FAQ() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFAQIndex, setActiveFAQIndex] = useState<number | null>(null);

  const localFallbackFAQs = [
    { id: 1, question: "What is Maha Construction's design-build philosophy?", answer: "We believe in 'honest materialism'—letting raw board-formed concrete, structural steel, natural stone, and cedar timber speak for themselves. We operate a fully integrated architectural and engineering service to minimize site revisions.", category: "Process" },
    { id: 2, question: "Do you build in international jurisdictions?", answer: "Yes, we construct high-end residential and commercial landmarks globally, utilizing regional craft masters while maintaining strict oversight through our central engineering and project management office.", category: "Operations" },
    { id: 3, question: "How is sustainability incorporated?", answer: "We construct carbon-neutral systems. By implementing thick geothermal slabs, high-performance insulated glazing, and solar photovoltaic pergolas, our buildings routinely achieve top green building standard ratings.", category: "Sustainability" },
    { id: 4, question: "What is the typical pricing structure for custom estates?", answer: "We construct exclusively custom, high-end landmarks. Budget estimates are generated after structural engineering assessments. Standard design fees represent a percentage of core material procurement costs.", category: "Process" }
  ];

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/faqs")
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data.length > 0 ? data : localFallbackFAQs);
      })
      .catch(() => {
        setFaqs(localFallbackFAQs);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = faqs.filter((faq) => {
    const matchSearch = faq.question.toLowerCase().includes(search.toLowerCase()) || faq.answer.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "all" || faq.category.toLowerCase() === activeCategory.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div className="w-full pt-32 pb-24 bg-white min-h-[90vh]">
      <div className="max-w-4xl mx-auto px-6">
        {/* Title */}
        <div className="mb-16 text-center">
          <span className="text-[10px] tracking-[0.4em] text-[#D4A437] font-semibold uppercase">SUPPORT CENTER</span>
          <h1 className="text-3xl md:text-5xl font-black font-heading text-[#081C35] mt-3 mb-6 uppercase">
            COMMON INQUIRIES
          </h1>
          <div className="w-16 h-[2px] bg-[#D4A437] mx-auto mb-6" />
          <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed max-w-xl mx-auto">
            Search our documented specifications and processes regarding structural planning, sustainable ratings, and client consult handovers.
          </p>
        </div>

        {/* Search bar & Category filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap gap-2 text-[9px] tracking-widest font-semibold justify-center">
            {["all", "process", "operations", "sustainability"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setActiveFAQIndex(null);
                }}
                className={`px-4 py-2 border rounded transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#081C35] border-[#081C35] text-white"
                    : "border-slate-200 text-[#081C35]/65 hover:border-[#081C35] hover:text-[#081C35]"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search FAQ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs px-4 py-3 pl-10 rounded outline-none focus:border-[#D4A437] transition-colors text-[#081C35]"
            />
            <FiSearch className="absolute left-3.5 top-3.5 text-slate-700" size={14} />
          </div>
        </div>

        {loading ? (
          <div className="w-full flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4A437]" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((faq, idx) => (
              <div
                key={faq.id}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFAQIndex(activeFAQIndex === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-6 text-left font-heading text-sm font-semibold tracking-wider text-[#081C35] outline-none cursor-pointer uppercase"
                >
                  <span>{faq.question}</span>
                  <FiChevronDown className={`text-[#D4A437] transition-transform duration-300 ${activeFAQIndex === idx ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {activeFAQIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-xs text-slate-700 font-medium leading-relaxed border-t border-slate-50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-700 font-medium text-xs">
            No matching questions found in this category. For urgent assistance, contact our office.
          </div>
        )}
      </div>
    </div>
  );
}


