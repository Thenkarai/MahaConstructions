import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiCalendar, FiUser, FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function Blog() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // State variables
  const [posts, setPosts] = useState<any[]>([]);
  const [activePost, setActivePost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const localFallbackBlogs = [
    {
      id: 1,
      title: "The Poetics of Concrete: raw textures in luxury design",
      slug: "poetics-of-concrete",
      summary: "Exploring how board-formed concrete and untreated surfaces define modern minimal residences, bringing visual warmth without paint overlays.",
      content: `
        Honest materialism is the core foundation of high-end architectural landmarks. In contemporary design, concrete has transitioned from a hidden structural core to the primary visual surface.
        
        Board-formed concrete is created by pouring concrete into timber frame molds. Once cured, the wood panels are stripped away, leaving a tactile wood-grain imprint on the stone face.
        
        By retaining these markings, we celebrate the chronicle of the building's construction. Combined with expansive sliding glass panels and direct natural light, raw concrete gains a visual softness and tactile depth that synthetic paint can never achieve.
      `,
      author: "Julian Sterling",
      category: "Architecture",
      tags: "Concrete,Minimalism,Design",
      image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      created_at: "2026-06-12T00:00:00Z"
    },
    {
      id: 2,
      title: "BIM twins: engineering precision under tight schedules",
      slug: "bim-twins-precision",
      summary: "How digital twin mockups prevent structural conflicts and optimize supply line delivery before on-site concrete castings start.",
      content: `
        Developing complex architectural forms requires rigorous pre-construction coordination. Building Information Modeling (BIM) allows our structural engineers to construct full digital twins of projects.
        
        By mapping HVAC plumbing conduits, steel framing connectors, and concrete load points in a virtual 3D canvas, we detect and resolve spatial conflicts before any site machinery starts.
        
        This process guarantees that high-tolerance luxury elements—like custom frameless sliding windows and floating stone stairs—align perfectly with the cast concrete foundations.
      `,
      author: "Marcus Vane",
      category: "Engineering",
      tags: "BIM,Technology,Construction",
      image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      created_at: "2026-05-24T00:00:00Z"
    }
  ];

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.length > 0 ? data : localFallbackBlogs);
      })
      .catch(() => {
        setPosts(localFallbackBlogs);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (slug && posts.length > 0) {
      const match = posts.find((p) => p.slug === slug);
      setActivePost(match || null);
    } else {
      setActivePost(null);
    }
  }, [slug, posts]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center pt-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4A437]" />
      </div>
    );
  }

  // --- BLOG DETAILED READER ---
  if (slug && activePost) {
    const related = posts.filter((p) => p.id !== activePost.id).slice(0, 2);

    return (
      <div className="w-full bg-white relative pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          {/* Back trigger */}
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-xs tracking-widest text-[#D4A437] font-bold mb-8 hover:text-[#081C35] transition-colors cursor-pointer"
          >
            <FiArrowLeft size={14} /> BACK TO DIRECTORY
          </button>

          {/* Metadata banner */}
          <span className="text-[10px] tracking-[0.25em] text-[#D4A437] font-semibold uppercase block mb-3">
            {activePost.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-heading font-medium tracking-tight text-[#081C35] leading-tight uppercase mb-6">
            {activePost.title}
          </h1>

          <div className="flex items-center gap-6 text-xs text-slate-700 pb-8 border-b border-slate-200 mb-8">
            <span className="flex items-center gap-1.5"><FiCalendar /> {new Date(activePost.created_at).toLocaleDateString()}</span>
            <span className="flex items-center gap-1.5"><FiUser /> BY {activePost.author.toUpperCase()}</span>
          </div>

          {/* Main article image */}
          <div className="w-full h-[320px] md:h-[480px] rounded-lg overflow-hidden mb-8 shadow-md">
            <img src={activePost.image_url} className="w-full h-full object-cover filter brightness-95" alt="Blog cover" />
          </div>

          {/* Content panel */}
          <div className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium space-y-6 whitespace-pre-line">
            {activePost.content}
          </div>

          {/* Tags */}
          {activePost.tags && (
            <div className="flex flex-wrap gap-2 mt-12 pt-6 border-t border-slate-200">
              {activePost.tags.split(",").map((tag: string, idx: number) => (
                <span key={idx} className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-[10px] text-[#081C35] tracking-wider uppercase font-semibold">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="mt-20 pt-12 border-t border-slate-200">
              <h3 className="text-xs font-bold tracking-widest text-[#081C35] uppercase mb-8">FURTHER INSIGHTS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {related.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="group cursor-pointer flex flex-col justify-between"
                  >
                    <div className="h-[180px] rounded overflow-hidden mb-4">
                      <img src={post.image_url} className="w-full h-full object-cover filter brightness-95" alt="Related post" />
                    </div>
                    <h4 className="text-xs font-bold tracking-wider text-[#081C35] uppercase line-clamp-2 group-hover:text-[#D4A437] transition-colors">
                      {post.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- BLOG INDEX DIRECTORY ---
  const filtered = posts.filter((post) => {
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase()) || post.summary.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || post.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div className="w-full pt-32 pb-24 bg-white min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Title */}
        <div className="mb-20 text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <span className="text-[10px] tracking-[0.4em] text-[#D4A437] font-semibold uppercase">MAHA INSIGHTS</span>
            <h1 className="text-3xl md:text-5xl font-black font-heading text-[#081C35] mt-3 mb-6 uppercase">
              JOURNAL & TRENDS
            </h1>
            <p className="text-xs md:text-sm text-slate-700 font-medium max-w-xl leading-relaxed">
              Read essays regarding architectural minimalism, sustainable concrete framing, parametric layouts, and project updates.
            </p>
          </div>

          {/* Search form */}
          <div className="relative w-full max-w-xs self-center">
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs px-4 py-3 pl-10 rounded outline-none focus:border-[#D4A437] transition-colors text-[#081C35]"
            />
            <FiSearch className="absolute left-3.5 top-3.5 text-slate-700" size={14} />
          </div>
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-4 mb-16 text-[10px] tracking-widest font-semibold justify-center md:justify-start">
          {["all", "architecture", "engineering"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-5 py-2 border rounded transition-all cursor-pointer ${
                categoryFilter === cat
                  ? "bg-[#081C35] border-[#081C35] text-white"
                  : "border-slate-200 text-[#081C35]/60 hover:border-[#081C35] hover:text-[#081C35]"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Articles Grid list */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="group bg-slate-50 border border-slate-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col md:flex-row h-auto md:h-[240px]"
              >
                <div className="w-full md:w-2/5 h-[180px] md:h-full overflow-hidden">
                  <img
                    src={post.image_url}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    alt="Article cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] tracking-widest text-[#D4A437] font-semibold uppercase block mb-1">
                      {post.category}
                    </span>
                    <h3 className="text-sm font-bold tracking-wider font-heading text-[#081C35] uppercase group-hover:text-[#D4A437] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-[11px] text-slate-700 font-medium leading-relaxed mt-2 line-clamp-2">
                      {post.summary}
                    </p>
                  </div>
                  <span className="text-[9px] tracking-widest font-bold text-[#D4A437] mt-4 block uppercase group-hover:text-[#081C35] transition-colors">
                    READ INSIGHT <FiArrowRight size={10} className="inline ml-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-700 font-medium">
            No articles match your search keywords or categories filters.
          </div>
        )}
      </div>
    </div>
  );
}


