import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPackage, FiStar, FiVideo, FiBriefcase, FiMapPin, FiHome, FiLock, FiKey,
  FiPlus, FiTrash2, FiEdit2, FiLogOut, FiGlobe, FiUpload, FiPlay, FiFileText, FiDownload, FiUsers, FiPhone, FiMail
} from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import { getEmbedVideoUrl, isYouTubeUrl } from "../utils/videoUtils";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("testimonials");
  const [statusMessage, setStatusMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Auth Protection Check
  useEffect(() => {
    const isAuth = sessionStorage.getItem("maha_admin_authenticated") === "true";
    if (!isAuth) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  // Admin Credentials State
  const [adminEmail, setAdminEmail] = useState(() => localStorage.getItem("maha_admin_email") || "Mahaconstructions2013@gmail.com");
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem("maha_admin_password") || "Maharajan@2013");

  // 1. Packages State (Supports Residential & Commercial Divisions)
  const [packages, setPackages] = useState<any[]>(() => {
    const saved = localStorage.getItem("maha_packages");
    return saved ? JSON.parse(saved) : [
      {
        id: 1, division: "residential", tier: "basic", title: "Basic Plan", subtitle: "Solid & Affordable",
        price_per_sqft: 1999, price: "₹1,999", popular: false, is_highlighted: false, warranty_years: 10, delivery_months: 12,
        description: "A solid, cost-effective residential build using quality materials, standard-grade finishes, and proven structural systems.",
        features: ["Fe-500 TMT steel", "Coromandel / ACC cement", "M-Sand blockwork", "Vitrified floor tiles (2'×2')", "Parryware CP fittings"],
        inclusions: ["Site supervision", "Civil structural work", "Plastering & waterproofing"], exclusions: ["Interior design", "Modular kitchen"]
      },
      {
        id: 2, division: "residential", tier: "premium", title: "Premium Plan", subtitle: "Quality & Elegance",
        price_per_sqft: 2399, price: "₹2,399", popular: true, is_highlighted: true, warranty_years: 15, delivery_months: 14,
        description: "A premium residential construction package with superior materials, polished finishes, and enhanced structural systems.",
        features: ["Fe-550 TMT (JSW / Vizag Steel)", "Ultratech Premium / Dalmia cement", "Double-washed M-Sand", "Kajaria double charged tiles (4'×2')"],
        inclusions: ["All Basic inclusions", "Modular kitchen carcass", "Premium tile work"], exclusions: ["Interior furniture", "Landscaping"]
      },
      {
        id: 3, division: "residential", tier: "luxury", title: "Luxury Plan", subtitle: "Elite Craftsmanship",
        price_per_sqft: 2999, price: "₹2,999", popular: false, is_highlighted: false, warranty_years: 20, delivery_months: 18,
        description: "A fully bespoke luxury residential build using world-class materials, custom architectural details, and premium brand fixtures.",
        features: ["Fe-550 TMT (Tata Tiscon / JSPL)", "Birla Super / ACC Gold cement", "Italian Travertine / marble slabs"],
        inclusions: ["All Premium inclusions", "Full modular kitchen", "Smart home pre-wiring"], exclusions: ["Smart home devices", "Furniture"]
      },
      {
        id: 4, division: "commercial", tier: "basic", title: "Standard Shell", subtitle: "Functional & Efficient",
        price_per_sqft: 2199, price: "₹2,199", popular: false, is_highlighted: false, warranty_years: 10, delivery_months: 14,
        description: "A functional, code-compliant commercial shell ideal for office spaces, retail outlets, and light commercial use.",
        features: ["Fe-500 TMT structural steel", "OPC 53 grade cement", "RCC framed structure"],
        inclusions: ["Core structural work", "Basic MEP", "Slab & column concrete"], exclusions: ["Interior partitions", "HVAC systems"]
      },
      {
        id: 5, division: "commercial", tier: "premium", title: "Premium Corporate", subtitle: "Professional & Polished",
        price_per_sqft: 2799, price: "₹2,799", popular: true, is_highlighted: true, warranty_years: 15, delivery_months: 18,
        description: "A professional-grade commercial building with premium structural detailing, enhanced MEP systems, and modern facade finishes.",
        features: ["Fe-550 TMT (JSW Steel)", "Ultratech / Ambuja cement", "Granite / double charged vitrified"],
        inclusions: ["All Shell inclusions", "False ceiling provision", "Lift pit & motor room"], exclusions: ["Fit-out interiors", "IT infrastructure"]
      },
      {
        id: 6, division: "commercial", tier: "luxury", title: "Elite Commercial", subtitle: "Iconic Architecture",
        price_per_sqft: 3499, price: "₹3,499", popular: false, is_highlighted: false, warranty_years: 20, delivery_months: 24,
        description: "An iconic high-end commercial tower built to global standards with curtain wall facades and high-capacity MEP systems.",
        features: ["Fe-550D TMT (SAIL / JSPL)", "Birla Aditya / ACC Gold cement", "Post-tensioned slabs"],
        inclusions: ["All Premium inclusions", "Intelligent BMS system", "VRF HVAC system"], exclusions: ["Tenant fit-out works", "IT & AV systems"]
      }
    ];
  });

  // 2. Video Testimonials State (FULLY VIDEO BASED!)
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

  // 3. YouTube Videos State
  const [videos, setVideos] = useState<any[]>(() => {
    const saved = localStorage.getItem("maha_youtube_videos");
    return saved ? JSON.parse(saved) : [
      { id: "v1", title: "Luxury 3D Villa Walkthrough & Interior Inspection", duration: "4:15", youtubeId: "dQw4w9WgXcQ", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1", thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80" },
      { id: "v2", title: "Site Soil Testing & Foundation Engineering Explanation", duration: "6:30", youtubeId: "dQw4w9WgXcQ", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1", thumbnail: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80" },
      { id: "v3", title: "Customer House Handover & Client Experience Review", duration: "3:45", youtubeId: "dQw4w9WgXcQ", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1", thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" }
    ];
  });

  // 4. Projects State
  const [projects, setProjects] = useState<any[]>(() => {
    const saved = localStorage.getItem("maha_projects");
    return saved ? JSON.parse(saved) : [
      { id: "p1", title: "Royal Palm Villa", location: "Nagercoil, Kanyakumari", type: "Luxury Residential", sqft: "3,200 sq.ft", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" },
      { id: "p2", title: "Emerald Heights Home", location: "Marthandam, Tamil Nadu", type: "Modern Villa", sqft: "2,400 sq.ft", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
      { id: "p3", title: "Sunview Residence", location: "Trivandrum Highway, Nagercoil", type: "Contemporary Home", sqft: "2,850 sq.ft", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
      { id: "p4", title: "Heritage Horizon Villa", location: "Kanyakumari", type: "Premium Bungalow", sqft: "4,100 sq.ft", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80" }
    ];
  });

  // 5. Contact Details State
  const [contactInfo, setContactInfo] = useState<any>(() => {
    const saved = localStorage.getItem("maha_contact_details");
    return saved ? JSON.parse(saved) : {
      phone1: "+91 94888 88758",
      phone2: "+91 90959 29543",
      whatsapp: "+91 90959 29543",
      email: "Mahaconstructions2013@gmail.com",
      address: "Tamilmoni complex, 1st floor, ICICI Bank Upstair, Near kottar police station, Nagercoil",
      mapsUrl: "https://maps.google.com/?q=Tamilmoni+complex,+1st+floor,+ICICI+Bank+Upstair,+Near+kottar+police+station,+Nagercoil"
    };
  });

  // 6. Live YouTube Channel Link State
  const [youtubeChannelUrl, setYoutubeChannelUrl] = useState<string>(() => {
    return localStorage.getItem("maha_youtube_channel_url") || "https://www.youtube.com/@MahaConstructions";
  });
  const [isSyncingChannel, setIsSyncingChannel] = useState(false);

  // 7. Guidebook PDF URL State
  const [guidePdfUrl, setGuidePdfUrl] = useState<string>(() => {
    return localStorage.getItem("maha_guide_pdf_url") || "/guide.pdf";
  });
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // 9. Intro Video URL State
  const [introVideoUrl, setIntroVideoUrl] = useState<string>(() => {
    return localStorage.getItem("maha_intro_video_url") || "";
  });
  const [uploadingIntroVideo, setUploadingIntroVideo] = useState(false);

  // 10. 60-Second Engineer Intro Video State
  const [engineerVideoUrl, setEngineerVideoUrl] = useState<string>(() => {
    return localStorage.getItem("maha_engineer_video_url") || "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
  });
  const [uploadingEngineerVideo, setUploadingEngineerVideo] = useState(false);

  // 11. 60-Second Engineer Video Cover Image / Owner Thumbnail State
  const [engineerCoverImage, setEngineerCoverImage] = useState<string>(() => {
    return localStorage.getItem("maha_engineer_cover_image") || "";
  });
  const [uploadingEngineerCover, setUploadingEngineerCover] = useState(false);

  // 8. Guidebook Downloads / Readers State
  const [guidebookLeads, setGuidebookLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);

  const fetchGuidebookLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await fetch("http://localhost:8000/api/leads/guidebook");
      if (res.ok) {
        const data = await res.json();
        setGuidebookLeads(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    fetchGuidebookLeads();
  }, []);

  const handleDeleteLead = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/leads/guidebook/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setGuidebookLeads(guidebookLeads.filter(l => l.id !== id));
        showNotification("Lead record deleted successfully!");
      }
    } catch (e) {
      console.error(e);
      showNotification("Failed to delete lead record.");
    }
  };

  // Modals State
  const [packageModal, setPackageModal] = useState<any | null>(null);
  const [packageDivision, setPackageDivision] = useState<"all" | "residential" | "commercial">("all");
  const [testimonialModal, setTestimonialModal] = useState<any | null>(null);
  const [videoModal, setVideoModal] = useState<any | null>(null);
  const [projectModal, setProjectModal] = useState<any | null>(null);

  // Fetch packages from backend on mount
  useEffect(() => {
    fetch("http://localhost:8000/api/packages")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPackages(data);
          localStorage.setItem("maha_packages", JSON.stringify(data));
        }
      })
      .catch((e) => console.log("Backend packages fetch info:", e));
  }, []);

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

    // Fetch intro video URL from backend
    fetch("http://localhost:8000/api/settings/intro_video_url")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.value) {
          setIntroVideoUrl(data.value);
          localStorage.setItem("maha_intro_video_url", data.value);
        }
      })
      .catch(() => {});

    // Fetch 60-Second Engineer video URL from backend
    fetch("http://localhost:8000/api/settings/engineer_video_url")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.value) {
          setEngineerVideoUrl(data.value);
          localStorage.setItem("maha_engineer_video_url", data.value);
        }
      })
      .catch(() => {});

    // Fetch Testimonials from backend
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
          localStorage.setItem("maha_video_testimonials", JSON.stringify(formatted));
        }
      })
      .catch(() => {});

    // Fetch 60-Second Engineer cover image from backend
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

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      alert("Please select a valid PDF file.");
      return;
    }

    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.url;
        setGuidePdfUrl(uploadedUrl);
        localStorage.setItem("maha_guide_pdf_url", uploadedUrl);

        // Save setting to backend DB
        await fetch("http://localhost:8000/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "guide_pdf_url", value: uploadedUrl })
        });

        showNotification("Guidebook PDF file uploaded and updated successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to upload PDF to server.");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleDeletePdf = async () => {
    const defaultUrl = "/guide.pdf";
    setGuidePdfUrl(defaultUrl);
    localStorage.setItem("maha_guide_pdf_url", defaultUrl);

    try {
      await fetch("http://localhost:8000/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "guide_pdf_url", value: defaultUrl })
      });
      showNotification("Uploaded PDF document deleted and reset to default!");
    } catch (err) {
      console.error(err);
      showNotification("PDF reset locally!");
    }
  };

  // Intro Video Upload Handler
  const handleIntroVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|mov|webm|avi)$/i)) {
      alert("Please select a valid video file (MP4, MOV, WEBM, or AVI).");
      return;
    }

    setUploadingIntroVideo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.url;
        setIntroVideoUrl(uploadedUrl);
        localStorage.setItem("maha_intro_video_url", uploadedUrl);

        // Save setting to backend DB
        await fetch("http://localhost:8000/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "intro_video_url", value: uploadedUrl })
        });

        showNotification("Intro video uploaded and saved successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to upload intro video to server.");
    } finally {
      setUploadingIntroVideo(false);
    }
  };

  const handleIntroVideoUrlSave = async () => {
    if (!introVideoUrl.trim()) {
      showNotification("Please enter a valid video URL.");
      return;
    }
    try {
      await fetch("http://localhost:8000/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "intro_video_url", value: introVideoUrl })
      });
      localStorage.setItem("maha_intro_video_url", introVideoUrl);
      showNotification("Intro video URL saved successfully!");
    } catch (err) {
      console.error(err);
      showNotification("Failed to save intro video URL.");
    }
  };

  const handleDeleteIntroVideo = async () => {
    setIntroVideoUrl("");
    localStorage.removeItem("maha_intro_video_url");

    try {
      await fetch("http://localhost:8000/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "intro_video_url", value: "" })
      });
      showNotification("Intro video removed and reset!");
    } catch (err) {
      console.error(err);
      showNotification("Intro video removed locally!");
    }
  };

  // 60-Second Engineer Video Upload Handler
  const handleEngineerVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|mov|webm|avi)$/i)) {
      alert("Please select a valid video file (MP4, MOV, WEBM, or AVI).");
      return;
    }

    setUploadingEngineerVideo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.url;
        setEngineerVideoUrl(uploadedUrl);
        localStorage.setItem("maha_engineer_video_url", uploadedUrl);

        // Save setting to backend DB
        await fetch("http://localhost:8000/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "engineer_video_url", value: uploadedUrl })
        });

        showNotification("60-Second Engineer Video uploaded and saved successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to upload Engineer Video to server.");
    } finally {
      setUploadingEngineerVideo(false);
    }
  };

  const handleEngineerVideoUrlSave = async () => {
    if (!engineerVideoUrl.trim()) {
      showNotification("Please enter a valid video URL.");
      return;
    }
    try {
      await fetch("http://localhost:8000/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "engineer_video_url", value: engineerVideoUrl })
      });
      localStorage.setItem("maha_engineer_video_url", engineerVideoUrl);
      showNotification("Engineer Video URL saved successfully!");
    } catch (err) {
      console.error(err);
      showNotification("Failed to save Engineer Video URL.");
    }
  };

  const handleDeleteEngineerVideo = async () => {
    const defaultUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
    setEngineerVideoUrl(defaultUrl);
    localStorage.setItem("maha_engineer_video_url", defaultUrl);

    try {
      await fetch("http://localhost:8000/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "engineer_video_url", value: defaultUrl })
      });
      showNotification("Engineer Video reset to default!");
    } catch (err) {
      console.error(err);
      showNotification("Engineer Video reset locally!");
    }
  };

  // 60-Second Engineer Video Cover Image Handlers
  const handleEngineerCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingEngineerCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.url;
        setEngineerCoverImage(uploadedUrl);
        localStorage.setItem("maha_engineer_cover_image", uploadedUrl);

        // Save setting to backend DB
        await fetch("http://localhost:8000/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "engineer_cover_image", value: uploadedUrl })
        });

        showNotification("Engineer Video Cover Image uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to upload Cover Image to server.");
    } finally {
      setUploadingEngineerCover(false);
    }
  };

  const handleEngineerCoverUrlSave = async () => {
    if (!engineerCoverImage.trim()) {
      showNotification("Please enter a valid cover image URL.");
      return;
    }
    try {
      await fetch("http://localhost:8000/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "engineer_cover_image", value: engineerCoverImage })
      });
      localStorage.setItem("maha_engineer_cover_image", engineerCoverImage);
      showNotification("Engineer Video Cover Image URL saved!");
    } catch (err) {
      console.error(err);
      showNotification("Failed to save Cover Image URL.");
    }
  };

  const handleDeleteEngineerCover = async () => {
    setEngineerCoverImage("");
    localStorage.removeItem("maha_engineer_cover_image");

    try {
      await fetch("http://localhost:8000/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "engineer_cover_image", value: "" })
      });
      showNotification("Engineer Video Cover Image reset!");
    } catch (err) {
      console.error(err);
    }
  };

  // Sync state to localStorage
  useEffect(() => { localStorage.setItem("maha_packages", JSON.stringify(packages)); }, [packages]);
  useEffect(() => { localStorage.setItem("maha_video_testimonials", JSON.stringify(videoTestimonials)); }, [videoTestimonials]);
  useEffect(() => { localStorage.setItem("maha_youtube_videos", JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem("maha_projects", JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem("maha_contact_details", JSON.stringify(contactInfo)); }, [contactInfo]);
  useEffect(() => { localStorage.setItem("maha_youtube_channel_url", youtubeChannelUrl); }, [youtubeChannelUrl]);

  const handleSyncYoutubeChannel = async (urlToSync?: string) => {
    const targetUrl = urlToSync || youtubeChannelUrl;
    if (!targetUrl) return;

    setIsSyncingChannel(true);
    try {
      // 1. Save setting to backend DB
      fetch("http://localhost:8000/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "youtube_channel_url", value: targetUrl })
      }).catch(() => {});

      // 2. Fetch live videos from channel
      const res = await fetch(`http://localhost:8000/api/youtube/channel-videos?url=${encodeURIComponent(targetUrl)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.videos && data.videos.length > 0) {
          setVideos(data.videos);
          showNotification(`Synced ${data.videos.length} live videos from YouTube channel!`);
        } else {
          showNotification("YouTube Channel URL saved! (No live videos found for this handle yet)");
        }
      } else {
        showNotification("YouTube Channel URL saved to Local Storage!");
      }
    } catch (e) {
      showNotification("YouTube Channel URL saved to Local Storage!");
    } finally {
      setIsSyncingChannel(false);
    }
  };

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("maha_admin_authenticated");
    localStorage.removeItem("maha_auth_token");
    navigate("/admin/login", { replace: true });
  };

  // Helper for uploading local files to server or Base64 fallback
  const handleLocalFileUpload = async (file: File, onSuccess: (url: string) => void) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        onSuccess(data.url);
        showNotification(`File "${file.name}" uploaded successfully to server!`);
      } else {
        throw new Error("Server upload failed");
      }
    } catch (err) {
      // Local Base64 FileReader fallback for offline / immediate display
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onSuccess(result);
        showNotification(`File "${file.name}" loaded locally!`);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  // Packages Handlers
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = packageModal.data;

    const toArray = (val: any) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        return val.split(/,|\n/).map((s: string) => s.trim()).filter(Boolean);
      }
      return [];
    };

    const priceNum = Number(data.price_per_sqft || parseInt(String(data.price || "").replace(/[^0-9]/g, '')) || 1999);

    const formattedPkg = {
      division: data.division || "residential",
      tier: data.tier || "basic",
      title: data.title || "",
      subtitle: data.subtitle || data.tagline || "",
      price_per_sqft: priceNum,
      price: `₹${priceNum.toLocaleString()}`,
      description: data.description || "",
      features: toArray(data.features),
      inclusions: toArray(data.inclusions),
      exclusions: toArray(data.exclusions),
      is_highlighted: Boolean(data.is_highlighted || data.popular),
      popular: Boolean(data.is_highlighted || data.popular),
      warranty_years: Number(data.warranty_years || 10),
      delivery_months: Number(data.delivery_months || 12),
    };

    try {
      const token = localStorage.getItem("maha_auth_token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      let savedItem = null;

      if (packageModal.mode === "add") {
        const res = await fetch("http://localhost:8000/api/packages", {
          method: "POST",
          headers,
          body: JSON.stringify(formattedPkg)
        });
        if (res.ok) {
          savedItem = await res.json();
          showNotification("New construction package added to server!");
        }
      } else {
        const pkgId = data.id;
        if (typeof pkgId === "number" || (!isNaN(Number(pkgId)) && !String(pkgId).startsWith("pkg_"))) {
          const res = await fetch(`http://localhost:8000/api/packages/${pkgId}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(formattedPkg)
          });
          if (res.ok) {
            savedItem = await res.json();
            showNotification("Package updated on server!");
          }
        }
      }

      const finalPkg = savedItem || { ...formattedPkg, id: data.id || "pkg_" + Date.now() };

      let updatedPackages = [];
      if (packageModal.mode === "add") {
        updatedPackages = [...packages, finalPkg];
      } else {
        updatedPackages = packages.map(p => String(p.id) === String(data.id) ? { ...p, ...finalPkg } : p);
      }

      setPackages(updatedPackages);
      localStorage.setItem("maha_packages", JSON.stringify(updatedPackages));
      window.dispatchEvent(new Event("storage"));
      setPackageModal(null);

    } catch (err) {
      console.error("Error saving package:", err);
      const localPkg = { ...formattedPkg, id: data.id || "pkg_" + Date.now() };
      let updatedPackages = [];
      if (packageModal.mode === "add") {
        updatedPackages = [...packages, localPkg];
      } else {
        updatedPackages = packages.map(p => String(p.id) === String(data.id) ? { ...p, ...localPkg } : p);
      }
      setPackages(updatedPackages);
      localStorage.setItem("maha_packages", JSON.stringify(updatedPackages));
      window.dispatchEvent(new Event("storage"));
      showNotification("Package saved locally!");
      setPackageModal(null);
    }
  };

  const handleDeletePackage = async (id: any) => {
    const updated = packages.filter(p => String(p.id) !== String(id));
    setPackages(updated);
    localStorage.setItem("maha_packages", JSON.stringify(updated));

    if (typeof id === "number" || (!isNaN(Number(id)) && !String(id).startsWith("pkg_"))) {
      try {
        const token = localStorage.getItem("maha_auth_token");
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        await fetch(`http://localhost:8000/api/packages/${id}`, {
          method: "DELETE",
          headers
        });
      } catch (e) {
        console.error("Error deleting backend package:", e);
      }
    }

    window.dispatchEvent(new Event("storage"));
    showNotification("Package deleted successfully!");
  };

  // Video Testimonials Handlers
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = testimonialModal.data;

    const formatted = {
      client_name: data.name || data.client_name || "Valued Client",
      client_role: data.location || data.client_role || "Tamil Nadu",
      rating: Number(data.rating || 5),
      feedback: data.feedback || "Video Review: High quality construction delivered on time.",
      image_url: data.thumbnail || data.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
      video_url: data.videoUrl || data.video_url || "",
      project_name: data.project_name || data.name || "Luxury Villa Construction",
      duration: data.duration || "2:30"
    };

    try {
      let savedItem = null;
      if (testimonialModal.mode === "add") {
        const res = await fetch("http://localhost:8000/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formatted)
        });
        if (res.ok) savedItem = await res.json();
      } else {
        const tId = data.id;
        if (typeof tId === "number" || (!isNaN(Number(tId)) && !String(tId).startsWith("vt_"))) {
          const res = await fetch(`http://localhost:8000/api/testimonials/${tId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formatted)
          });
          if (res.ok) savedItem = await res.json();
        }
      }

      const finalItem = savedItem || { ...formatted, id: data.id || "vt_" + Date.now(), name: formatted.client_name, location: formatted.client_role, videoUrl: formatted.video_url, thumbnail: formatted.image_url };
      const updated = testimonialModal.mode === "add"
        ? [...videoTestimonials, finalItem]
        : videoTestimonials.map(t => String(t.id) === String(data.id) ? { ...t, ...finalItem } : t);

      setVideoTestimonials(updated);
      localStorage.setItem("maha_video_testimonials", JSON.stringify(updated));
      showNotification(testimonialModal.mode === "add" ? "New video testimonial added!" : "Video testimonial updated!");
    } catch (err) {
      console.error("Error saving testimonial:", err);
      const fallbackItem = { ...formatted, id: data.id || "vt_" + Date.now(), name: formatted.client_name, location: formatted.client_role, videoUrl: formatted.video_url, thumbnail: formatted.image_url };
      const updated = testimonialModal.mode === "add"
        ? [...videoTestimonials, fallbackItem]
        : videoTestimonials.map(t => String(t.id) === String(data.id) ? { ...t, ...fallbackItem } : t);
      setVideoTestimonials(updated);
      localStorage.setItem("maha_video_testimonials", JSON.stringify(updated));
      showNotification("Saved to local storage!");
    } finally {
      setTestimonialModal(null);
    }
  };

  const handleDeleteTestimonial = async (id: any) => {
    const updated = videoTestimonials.filter(t => String(t.id) !== String(id));
    setVideoTestimonials(updated);
    localStorage.setItem("maha_video_testimonials", JSON.stringify(updated));

    if (typeof id === "number" || (!isNaN(Number(id)) && !String(id).startsWith("vt_"))) {
      try {
        await fetch(`http://localhost:8000/api/testimonials/${id}`, {
          method: "DELETE"
        });
      } catch (e) {
        console.error("Error deleting testimonial from backend:", e);
      }
    }
    showNotification("Video review deleted successfully!");
  };

  // YouTube / Site Videos Handlers
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const data = videoModal.data;
    let updated = [];
    if (videoModal.mode === "add") {
      updated = [...videos, { ...data, id: "v_" + Date.now() }];
      showNotification("New site video added!");
    } else {
      updated = videos.map(v => String(v.id) === String(data.id) ? data : v);
      showNotification("Video updated!");
    }
    setVideos(updated);
    localStorage.setItem("maha_youtube_videos", JSON.stringify(updated));
    setVideoModal(null);
  };

  const handleDeleteVideo = (id: any) => {
    const updated = videos.filter(v => String(v.id) !== String(id));
    setVideos(updated);
    localStorage.setItem("maha_youtube_videos", JSON.stringify(updated));
    showNotification("Video deleted successfully!");
  };

  // Projects Handlers
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = projectModal.data;

    const formattedProj = {
      name: data.title || data.name || "Completed Project",
      client: data.client || data.location || "Tamil Nadu",
      location: data.location || "Nagercoil",
      budget: data.budget || "₹50 Lakhs",
      completion_date: data.completion_date || "2026",
      duration: data.duration || "12 Months",
      architecture_style: data.architecture_style || "Contemporary Luxury",
      description: data.description || "High structural standard villa project.",
      image_urls: Array.isArray(data.image_urls) ? data.image_urls : [data.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"],
      video_url: data.videoUrl || data.video_url || "",
      category: data.category || "residential",
      is_featured: Boolean(data.is_featured)
    };

    try {
      let savedItem = null;
      if (projectModal.mode === "add") {
        const res = await fetch("http://localhost:8000/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedProj)
        });
        if (res.ok) savedItem = await res.json();
      } else {
        const pId = data.id;
        if (typeof pId === "number" || (!isNaN(Number(pId)) && !String(pId).startsWith("p_"))) {
          const res = await fetch(`http://localhost:8000/api/projects/${pId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedProj)
          });
          if (res.ok) savedItem = await res.json();
        }
      }

      const finalItem = savedItem || { ...formattedProj, id: data.id || "p_" + Date.now(), title: formattedProj.name };
      const updated = projectModal.mode === "add"
        ? [...projects, finalItem]
        : projects.map(p => String(p.id) === String(data.id) ? { ...p, ...finalItem } : p);

      setProjects(updated);
      localStorage.setItem("maha_projects", JSON.stringify(updated));
      showNotification(projectModal.mode === "add" ? "New project added to database!" : "Project updated in database!");
    } catch (err) {
      console.error("Error saving project:", err);
      const fallbackItem = { ...formattedProj, id: data.id || "p_" + Date.now(), title: formattedProj.name };
      const updated = projectModal.mode === "add"
        ? [...projects, fallbackItem]
        : projects.map(p => String(p.id) === String(data.id) ? { ...p, ...fallbackItem } : p);
      setProjects(updated);
      localStorage.setItem("maha_projects", JSON.stringify(updated));
      showNotification("Saved project to local storage!");
    } finally {
      setProjectModal(null);
    }
  };

  const handleDeleteProject = async (id: any) => {
    const updated = projects.filter(p => String(p.id) !== String(id));
    setProjects(updated);
    localStorage.setItem("maha_projects", JSON.stringify(updated));

    if (typeof id === "number" || (!isNaN(Number(id)) && !String(id).startsWith("p_"))) {
      try {
        await fetch(`http://localhost:8000/api/projects/${id}`, {
          method: "DELETE"
        });
      } catch (e) {
        console.error("Error deleting project from backend:", e);
      }
    }
    showNotification("Project deleted successfully!");
  };

  // Security & Admin Credentials Handler
  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      showNotification("Please enter a valid email and password.");
      return;
    }
    localStorage.setItem("maha_admin_email", adminEmail.trim());
    localStorage.setItem("maha_admin_password", adminPassword.trim());

    fetch("http://localhost:8000/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "admin_email", value: adminEmail.trim() })
    }).catch(() => {});

    showNotification("Admin login credentials saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[#071B35] text-[#F8F8F8] flex flex-col pt-[76px]">
      
      {/* Admin Header */}
      <header className="bg-[#071B35] border-b border-[#102847] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.15)] border border-[#E6C36A]/40 shrink-0">
            <img src="/logo.png" alt="MAHA Logo" className="h-10 w-auto object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div>
            <h1 className="text-lg font-black text-white font-heading uppercase leading-none">
              MAHA CONSTRUCTIONS <span className="text-[#E6C36A]">ADMIN PANEL</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
              Local File Uploads & Live Content Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-[#071B35] hover:bg-[#E6C36A] hover:text-[#071B35] text-[#E6C36A] text-xs font-bold rounded-xl border border-[#E6C36A]/40 transition-all flex items-center gap-1.5"
          >
            <FiGlobe size={14} /> LIVE WEBSITE
          </a>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 text-xs font-bold rounded-xl border border-red-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FiLogOut size={14} /> LOGOUT
          </button>
        </div>
      </header>

      {/* Notification Toast */}
      {statusMessage && (
        <div className="bg-[#E6C36A] text-[#071B35] font-black text-xs text-center py-2.5 px-4 shadow-lg animate-pulse uppercase tracking-wider">
          ✓ {statusMessage}
        </div>
      )}

      {/* Dashboard Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-[#071B35] p-3 rounded-2xl border border-[#102847] space-y-1">
            
            <button
              onClick={() => setActiveTab("testimonials")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all ${
                activeTab === "testimonials" ? "bg-[#E6C36A] text-[#071B35]" : "text-slate-300 hover:bg-[#102847]"
              }`}
            >
              <FiStar size={16} /> Client Video Reviews ({videoTestimonials.length})
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all ${
                activeTab === "projects" ? "bg-[#E6C36A] text-[#071B35]" : "text-slate-300 hover:bg-[#102847]"
              }`}
            >
              <FiBriefcase size={16} /> Completed Projects ({projects.length})
            </button>

            <button
              onClick={() => setActiveTab("packages")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all ${
                activeTab === "packages" ? "bg-[#E6C36A] text-[#071B35]" : "text-slate-300 hover:bg-[#102847]"
              }`}
            >
              <FiPackage size={16} /> Construction Packages ({packages.length})
            </button>

            <button
              onClick={() => setActiveTab("videos")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all ${
                activeTab === "videos" ? "bg-[#E6C36A] text-[#071B35]" : "text-slate-300 hover:bg-[#102847]"
              }`}
            >
              <FaYoutube size={16} /> YouTube Videos ({videos.length})
            </button>

            <button
              onClick={() => setActiveTab("contacts")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all ${
                activeTab === "contacts" ? "bg-[#E6C36A] text-[#071B35]" : "text-slate-300 hover:bg-[#102847]"
              }`}
            >
              <FiMapPin size={16} /> Contact Details & Address
            </button>

            <button
              onClick={() => setActiveTab("guidebook")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all ${
                activeTab === "guidebook" ? "bg-[#E6C36A] text-[#071B35]" : "text-slate-300 hover:bg-[#102847]"
              }`}
            >
              <FiFileText size={16} /> Guidebook PDF ({guidebookLeads.length})
            </button>

            <button
              onClick={() => setActiveTab("introvideo")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all ${
                activeTab === "introvideo" ? "bg-[#E6C36A] text-[#071B35]" : "text-slate-300 hover:bg-[#102847]"
              }`}
            >
              <FiVideo size={16} /> Intro Video
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all ${
                activeTab === "security" ? "bg-[#E6C36A] text-[#071B35]" : "text-slate-300 hover:bg-[#102847]"
              }`}
            >
              <FiLock size={16} /> Admin Account & Security
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">

          {/* TAB 1: CLIENT VIDEO TESTIMONIALS (FULLY VIDEO BASED!) */}
          {activeTab === "testimonials" && (
            <div className="bg-[#071B35] p-6 rounded-3xl border border-[#102847] space-y-6">
              <div className="flex items-center justify-between border-b border-[#102847] pb-4">
                <div>
                  <h2 className="text-xl font-black text-white font-heading uppercase">Client Video Testimonials</h2>
                  <p className="text-xs text-slate-400">Upload video files or video links from happy homeowners.</p>
                </div>
                <button
                  onClick={() => setTestimonialModal({ mode: "add", data: { name: "", location: "", videoUrl: "", thumbnail: "", duration: "2:30" } })}
                  className="px-4 py-2.5 bg-[#E6C36A] hover:bg-[#C99A3A] text-[#071B35] font-black text-xs uppercase rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <FiPlus size={16} /> UPLOAD NEW VIDEO REVIEW
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videoTestimonials.map((t) => (
                  <div key={t.id} className="bg-[#071B35] p-4 rounded-2xl border border-[#102847] space-y-3">
                    <div className="relative h-40 overflow-hidden rounded-xl bg-black">
                      {t.videoUrl && !t.videoUrl.includes("youtube.com") && !t.videoUrl.includes("youtu.be") ? (
                        <video src={t.videoUrl} preload="metadata" className="w-full h-full object-cover brightness-90" />
                      ) : (
                        <img src={t.thumbnail || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"} alt={t.name} className="w-full h-full object-cover brightness-90" />
                      )}
                      <div className="absolute inset-0 m-auto w-12 h-12 bg-[#E6C36A] text-[#071B35] rounded-full flex items-center justify-center">
                        <FiPlay size={20} className="ml-0.5" />
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-[10px] text-white">
                        {t.duration}
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase">{t.name}</h4>
                        <p className="text-xs text-[#E6C36A] font-semibold">{t.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTestimonialModal({ mode: "edit", data: t })}
                          className="p-2 bg-[#102847] hover:bg-[#E6C36A] hover:text-[#071B35] text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: COMPLETED PROJECTS */}
          {activeTab === "projects" && (
            <div className="bg-[#071B35] p-6 rounded-3xl border border-[#102847] space-y-6">
              <div className="flex items-center justify-between border-b border-[#102847] pb-4">
                <div>
                  <h2 className="text-xl font-black text-white font-heading uppercase flex items-center gap-2">
                    <FiBriefcase className="text-[#E6C36A]" size={20} /> Completed Projects (Video & Photo Walkthroughs)
                  </h2>
                  <p className="text-xs text-slate-400">Upload project walkthrough videos (MP4), photo renders & site specs.</p>
                </div>
                <button
                  onClick={() => setProjectModal({ mode: "add", data: { title: "", location: "", type: "Luxury Residential", sqft: "2,500 sq.ft", image: "", videoUrl: "" } })}
                  className="px-4 py-2.5 bg-[#E6C36A] hover:bg-[#C99A3A] text-[#071B35] font-black text-xs uppercase rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <FiPlus size={16} /> UPLOAD PROJECT VIDEO / PHOTO
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((p) => (
                  <div key={p.id} className="bg-[#071B35] p-4 rounded-2xl border border-[#102847] space-y-3 relative group">
                    <div className="relative h-36 overflow-hidden rounded-xl bg-black">
                      {p.videoUrl && !p.videoUrl.includes("youtube.com") && !p.videoUrl.includes("youtu.be") ? (
                        <video src={p.videoUrl} preload="metadata" className="w-full h-full object-cover" />
                      ) : p.image ? (
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#102949] flex items-center justify-center text-slate-400 text-xs font-bold">
                          VIDEO / PHOTO WALKTHROUGH
                        </div>
                      )}
                      {p.videoUrl && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-10 h-10 bg-[#E6C36A] text-[#071B35] rounded-full flex items-center justify-center shadow-lg">
                            <FiPlay size={18} className="ml-0.5" />
                          </div>
                        </div>
                      )}
                      {p.videoUrl && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#E6C36A] text-[#071B35] text-[9px] font-black uppercase rounded shadow">
                          🎬 VIDEO WALKTHROUGH
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase">{p.title}</h4>
                        <p className="text-xs text-[#E6C36A] font-semibold">{p.type} · {p.sqft}</p>
                        <p className="text-xs text-slate-400">📍 {p.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setProjectModal({ mode: "edit", data: p })}
                          className="p-2 bg-[#102847] hover:bg-[#E6C36A] hover:text-[#071B35] text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PACKAGES */}
          {activeTab === "packages" && (
            <div className="bg-[#071B35] p-6 rounded-3xl border border-[#102847] space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#102847] pb-4">
                <div>
                  <h2 className="text-xl font-black text-white font-heading uppercase flex items-center gap-2">
                    <FiPackage className="text-[#E6C36A]" size={22} /> Construction Packages
                  </h2>
                  <p className="text-xs text-slate-400">Manage per sq.ft pricing & specs features list for Residential & Commercial builds.</p>
                </div>
                <button
                  onClick={() => setPackageModal({
                    mode: "add",
                    data: {
                      division: packageDivision === "all" ? "residential" : packageDivision,
                      tier: "basic",
                      title: "",
                      subtitle: "",
                      price_per_sqft: 1999,
                      description: "",
                      features: "",
                      inclusions: "",
                      exclusions: "",
                      is_highlighted: false,
                      warranty_years: 10,
                      delivery_months: 12
                    }
                  })}
                  className="px-4 py-2.5 bg-[#E6C36A] hover:bg-[#C99A3A] text-[#071B35] font-black text-xs uppercase rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <FiPlus size={16} /> ADD NEW PACKAGE
                </button>
              </div>

              {/* Division Filters: Residential vs Commercial */}
              <div className="flex items-center gap-2 border-b border-[#102847] pb-3 overflow-x-auto">
                <button
                  onClick={() => setPackageDivision("all")}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                    packageDivision === "all"
                      ? "bg-[#E6C36A] text-[#071B35] shadow"
                      : "bg-[#102847] text-slate-300 hover:text-white"
                  }`}
                >
                  All Packages ({packages.length})
                </button>
                <button
                  onClick={() => setPackageDivision("residential")}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
                    packageDivision === "residential"
                      ? "bg-[#E6C36A] text-[#071B35] shadow"
                      : "bg-[#102847] text-slate-300 hover:text-white"
                  }`}
                >
                  <FiHome size={14} /> Residential ({packages.filter(p => (p.division || "residential") === "residential").length})
                </button>
                <button
                  onClick={() => setPackageDivision("commercial")}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
                    packageDivision === "commercial"
                      ? "bg-[#E6C36A] text-[#071B35] shadow"
                      : "bg-[#102847] text-slate-300 hover:text-white"
                  }`}
                >
                  <FiBriefcase size={14} /> Commercial ({packages.filter(p => p.division === "commercial").length})
                </button>
              </div>

              {/* Packages Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages
                  .filter(pkg => packageDivision === "all" || (pkg.division || "residential") === packageDivision)
                  .map((pkg) => (
                    <div key={pkg.id} className="bg-[#071B35] p-5 rounded-2xl border border-[#102847] hover:border-[#E6C36A]/40 space-y-3 relative group transition-all">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                              (pkg.division || "residential") === "commercial" 
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            }`}>
                              {(pkg.division || "residential") === "commercial" ? "🏢 Commercial" : "🏡 Residential"}
                            </span>
                            <span className="px-2 py-0.5 bg-[#102847] text-slate-300 rounded text-[10px] font-bold uppercase">
                              Tier: {pkg.tier || "Standard"}
                            </span>
                            {(pkg.is_highlighted || pkg.popular) && (
                              <span className="px-2 py-0.5 bg-[#E6C36A] text-[#071B35] rounded text-[10px] font-black uppercase flex items-center gap-1">
                                <FiStar size={10} /> Most Popular
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-black text-white uppercase font-heading pt-1">{pkg.title}</h3>
                          <p className="text-xs text-slate-400">{pkg.subtitle || pkg.tagline}</p>
                          <div className="flex items-baseline gap-2 pt-1">
                            <p className="text-lg font-black text-[#E6C36A]">
                              ₹{pkg.price_per_sqft ? pkg.price_per_sqft.toLocaleString() : (pkg.price || "1,999")} / sq.ft
                            </p>
                            {(pkg.warranty_years || pkg.delivery_months) && (
                              <span className="text-[11px] text-slate-400">
                                ({pkg.warranty_years || 10} yrs warranty · {pkg.delivery_months || 12} mos delivery)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => setPackageModal({
                              mode: "edit",
                              data: {
                                ...pkg,
                                division: pkg.division || "residential",
                                tier: pkg.tier || "basic",
                                subtitle: pkg.subtitle || pkg.tagline || "",
                                price_per_sqft: pkg.price_per_sqft || parseInt(String(pkg.price || "").replace(/[^0-9]/g, '')) || 1999,
                                features: Array.isArray(pkg.features) ? pkg.features.join(", ") : pkg.features || "",
                                inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join(", ") : pkg.inclusions || "",
                                exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions.join(", ") : pkg.exclusions || "",
                              }
                            })}
                            className="p-2 bg-[#102847] hover:bg-[#E6C36A] hover:text-[#071B35] text-white rounded-lg transition-colors cursor-pointer"
                            title="Edit Package"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Delete Package"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {pkg.description && (
                        <p className="text-xs text-slate-300 border-t border-[#102847] pt-2">
                          {pkg.description}
                        </p>
                      )}

                      {pkg.features && (Array.isArray(pkg.features) ? pkg.features.length > 0 : Boolean(pkg.features)) && (
                        <div className="border-t border-[#102847] pt-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Key Specifications / Features:</span>
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(pkg.features) ? pkg.features : String(pkg.features).split(',')).slice(0, 5).map((f: any, idx: number) => (
                              <span key={idx} className="text-[10px] bg-[#102847] text-slate-200 px-2 py-0.5 rounded">
                                ✓ {typeof f === 'string' ? f.trim() : f}
                              </span>
                            ))}
                            {(Array.isArray(pkg.features) ? pkg.features.length : 0) > 5 && (
                              <span className="text-[10px] text-slate-400 px-1 py-0.5">
                                +{(Array.isArray(pkg.features) ? pkg.features.length : 0) - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: YOUTUBE VIDEOS */}
          {activeTab === "videos" && (
            <div className="bg-[#071B35] p-6 rounded-3xl border border-[#102847] space-y-6">
              <div className="flex items-center justify-between border-b border-[#102847] pb-4">
                <div>
                  <h2 className="text-xl font-black text-white font-heading uppercase">YouTube & Site Videos</h2>
                  <p className="text-xs text-slate-400">Sync live channel videos or upload custom videos.</p>
                </div>
                <button
                  onClick={() => setVideoModal({ mode: "add", data: { title: "", duration: "3:30", videoUrl: "", thumbnail: "" } })}
                  className="px-4 py-2.5 bg-[#EF4444] hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <FiPlus size={16} /> UPLOAD LOCAL VIDEO
                </button>
              </div>

              {/* Live YouTube Channel Link Auto-Sync Box */}
              <div className="p-5 bg-[#071B35] border border-[#EF4444]/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white font-heading uppercase flex items-center gap-2">
                      <FaYoutube className="text-[#EF4444]" size={18} /> LIVE YOUTUBE CHANNEL AUTO-SYNC
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Enter your YouTube Channel URL or handle (e.g. <code className="text-[#E6C36A]">https://www.youtube.com/@MahaConstructions</code>). Videos uploaded to your YouTube channel will automatically sync directly onto the website!
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <input
                    type="text"
                    placeholder="e.g. https://www.youtube.com/@MahaConstructions"
                    value={youtubeChannelUrl}
                    onChange={(e) => setYoutubeChannelUrl(e.target.value)}
                    className="flex-1 bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl outline-none focus:border-[#EF4444]"
                  />
                  <button
                    onClick={() => handleSyncYoutubeChannel()}
                    disabled={isSyncingChannel}
                    className="px-6 py-3 bg-[#EF4444] hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <FaYoutube size={16} /> {isSyncingChannel ? "SYNCING CHANNEL..." : "SYNC LIVE VIDEOS NOW"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((v) => (
                  <div key={v.id} className="bg-[#071B35] p-4 rounded-2xl border border-[#102847] space-y-3">
                    <img src={v.thumbnail} alt={v.title} className="w-full h-36 object-cover rounded-xl" />
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase">{v.title}</h4>
                        <p className="text-xs text-slate-400">Duration: {v.duration}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setVideoModal({ mode: "edit", data: v })}
                          className="p-2 bg-[#102847] hover:bg-[#E6C36A] hover:text-[#071B35] text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(v.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT DETAILS */}
          {activeTab === "contacts" && (
            <div className="bg-[#071B35] p-6 rounded-3xl border border-[#102847] space-y-6">
              <div className="border-b border-[#102847] pb-4">
                <h2 className="text-xl font-black text-white font-heading uppercase">Head Office & Contact Info</h2>
                <p className="text-xs text-slate-400">Update phone numbers, Nagercoil address, email & Google Maps link.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); showNotification("Contact details saved!"); }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Primary Phone</label>
                    <input
                      type="text"
                      value={contactInfo.phone1}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone1: e.target.value })}
                      className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Secondary Phone</label>
                    <input
                      type="text"
                      value={contactInfo.phone2}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone2: e.target.value })}
                      className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={contactInfo.whatsapp}
                      onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                      className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Office Address</label>
                  <textarea
                    rows={2}
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                    className="w-full bg-[#071B35] border border-[#102847] text-white text-xs p-4 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#E6C36A] hover:bg-[#C99A3A] text-[#071B35] font-black text-xs uppercase rounded-xl shadow-md"
                >
                  SAVE CONTACT DETAILS
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: GUIDEBOOK PDF MANAGEMENT */}
          {activeTab === "guidebook" && (
            <div className="bg-[#071B35] p-6 rounded-3xl border border-[#102847] space-y-6">
              <div className="border-b border-[#102847] pb-4">
                <h2 className="text-xl font-black text-white font-heading uppercase flex items-center gap-2">
                  <FiFileText className="text-[#E6C36A]" size={22} /> Free Guidebook PDF Management
                </h2>
                <p className="text-xs text-slate-400">
                  Upload, view, or remove the PDF document served as the free "Nam Kanavu Illam" home builder guide.
                </p>
              </div>

              {/* Current Active Document Preview Card */}
              <div className="bg-[#102847] p-5 md:p-6 rounded-2xl border border-slate-700 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/60 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#E6C36A] tracking-wider block flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" /> CURRENT ACTIVE PDF DOCUMENT
                    </span>
                    <p className="text-sm font-bold text-white break-all">{guidePdfUrl}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <a
                      href={guidePdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      download="Nam_Kanavu_Illam_Guide.pdf"
                      className="px-4 py-2.5 bg-[#E6C36A] hover:bg-[#C99A3A] text-[#071B35] text-xs font-black uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <FiDownload size={14} /> Download / Open PDF
                    </a>

                    <button
                      onClick={handleDeletePdf}
                      className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 text-xs font-black uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <FiTrash2 size={14} /> Delete PDF
                    </button>
                  </div>
                </div>

                {/* Embedded Live PDF Document Viewer */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase mb-3 flex items-center gap-2">
                    <FiFileText className="text-[#E6C36A]" size={14} /> Live Document Preview
                  </h4>
                  <div className="w-full h-96 rounded-xl overflow-hidden border border-slate-700 bg-[#071B35]">
                    <iframe
                      src={guidePdfUrl}
                      title="Guidebook PDF Document Preview"
                      className="w-full h-full border-none"
                    />
                  </div>
                </div>

                {/* Upload New PDF Section */}
                <div className="border-t border-slate-700/60 pt-4">
                  <label className="block text-xs font-bold text-white mb-2 uppercase">
                    Upload New PDF File
                  </label>
                  <div className="relative border-2 border-dashed border-[#E6C36A]/40 hover:border-[#E6C36A] bg-[#071B35] rounded-2xl p-6 text-center transition-all">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      disabled={uploadingPdf}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2 pointer-events-none">
                      <FiUpload size={32} className="mx-auto text-[#E6C36A]" />
                      <p className="text-xs font-bold text-white uppercase">
                        {uploadingPdf ? "UPLOADING PDF TO SERVER..." : "Click or Drag & Drop PDF file here to replace"}
                      </p>
                      <p className="text-[10px] text-slate-400">Supported format: PDF (.pdf)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Users Who Downloaded / Read The Guidebook */}
              <div className="bg-[#102847] p-5 md:p-6 rounded-2xl border border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-700/60 pb-4">
                  <div>
                    <h3 className="text-base font-black text-white uppercase font-heading flex items-center gap-2">
                      <FiUsers className="text-[#E6C36A]" size={18} /> Guidebook Downloads & Readers ({guidebookLeads.length})
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Live record of home buyers who submitted their details on the website to access the PDF guide.
                    </p>
                  </div>

                  <button
                    onClick={fetchGuidebookLeads}
                    disabled={loadingLeads}
                    className="px-4 py-2 bg-[#071B35] hover:bg-[#E6C36A] hover:text-[#071B35] border border-slate-600 text-xs font-black uppercase rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer text-white"
                  >
                    {loadingLeads ? "REFRESHING..." : "↻ REFRESH LIST"}
                  </button>
                </div>

                {guidebookLeads.length === 0 ? (
                  <div className="text-center py-8 bg-[#071B35]/60 rounded-xl border border-slate-700/50">
                    <FiUsers size={32} className="mx-auto text-slate-500 mb-2" />
                    <p className="text-xs text-slate-400 font-bold uppercase">No downloads recorded yet</p>
                    <p className="text-[11px] text-slate-500">When visitors enter their Name, Phone, and Email on the homepage form, their contact details will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300 border-collapse">
                      <thead>
                        <tr className="border-b border-slate-700 text-[10px] font-black uppercase text-[#E6C36A] tracking-wider">
                          <th className="py-3 px-3">#</th>
                          <th className="py-3 px-3">NAME</th>
                          <th className="py-3 px-3">MOBILE PHONE</th>
                          <th className="py-3 px-3">GMAIL / EMAIL</th>
                          <th className="py-3 px-3">DATE & TIME</th>
                          <th className="py-3 px-3 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {guidebookLeads.map((lead, idx) => (
                          <tr key={lead.id} className="hover:bg-[#071B35]/50 transition-colors">
                            <td className="py-3.5 px-3 font-bold text-slate-400">{idx + 1}</td>
                            <td className="py-3.5 px-3 font-bold text-white uppercase">{lead.name}</td>
                            <td className="py-3.5 px-3">
                              <a
                                href={`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#E6C36A] hover:underline font-semibold flex items-center gap-1.5"
                              >
                                <FiPhone size={12} /> {lead.phone}
                              </a>
                            </td>
                            <td className="py-3.5 px-3">
                              <a
                                href={`mailto:${lead.email}`}
                                className="text-slate-200 hover:text-[#E6C36A] hover:underline flex items-center gap-1.5"
                              >
                                <FiMail size={12} /> {lead.email}
                              </a>
                            </td>
                            <td className="py-3.5 px-3 text-slate-400">
                              {lead.created_at ? new Date(lead.created_at).toLocaleString() : "Recently"}
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                                title="Delete Lead Record"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: INTRO VIDEO MANAGEMENT */}
          {activeTab === "introvideo" && (
            <div className="bg-[#071B35] p-6 rounded-3xl border border-[#102847] space-y-6">
              <div className="border-b border-[#102847] pb-4">
                <h2 className="text-xl font-black text-white font-heading uppercase flex items-center gap-2">
                  <FiVideo className="text-[#E6C36A]" size={22} /> Website Intro Video Management
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload, paste URL, or manage the intro video that appears in the hero section of the website homepage.
                </p>
              </div>

              {/* Current Active Video Preview */}
              <div className="bg-[#102847] p-5 md:p-6 rounded-2xl border border-slate-700 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/60 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#E6C36A] tracking-wider block flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${introVideoUrl ? 'bg-[#22C55E] animate-pulse' : 'bg-red-500'}`} />
                      {introVideoUrl ? 'CURRENT ACTIVE INTRO VIDEO' : 'NO INTRO VIDEO SET'}
                    </span>
                    <p className="text-sm font-bold text-white break-all">{introVideoUrl || 'No video uploaded yet'}</p>
                  </div>

                  {introVideoUrl && (
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <a
                        href={introVideoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 bg-[#E6C36A] hover:bg-[#C99A3A] text-[#071B35] text-xs font-black uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <FiPlay size={14} /> Open / Preview
                      </a>

                      <button
                        onClick={handleDeleteIntroVideo}
                        className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 text-xs font-black uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <FiTrash2 size={14} /> Remove Video
                      </button>
                    </div>
                  )}
                </div>

                {/* Embedded Live Video Preview */}
                {introVideoUrl && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase mb-3 flex items-center gap-2">
                      <FiPlay className="text-[#E6C36A]" size={14} /> Live Video Preview
                    </h4>
                    <div className="w-full rounded-xl overflow-hidden border border-slate-700 bg-black">
                      <video
                        key={introVideoUrl}
                        src={introVideoUrl}
                        controls
                        className="w-full max-h-96 object-contain bg-black"
                        preload="metadata"
                      />
                    </div>
                  </div>
                )}

                {/* Upload New Video Section */}
                <div className="border-t border-slate-700/60 pt-4 space-y-4">
                  <label className="block text-xs font-bold text-white mb-2 uppercase">
                    Upload Intro Video File
                  </label>
                  <div className="relative border-2 border-dashed border-[#E6C36A]/40 hover:border-[#E6C36A] bg-[#071B35] rounded-2xl p-6 text-center transition-all">
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,.mp4,.mov,.webm,.avi"
                      onChange={handleIntroVideoUpload}
                      disabled={uploadingIntroVideo}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2 pointer-events-none">
                      <FiUpload size={32} className="mx-auto text-[#E6C36A]" />
                      <p className="text-xs font-bold text-white uppercase">
                        {uploadingIntroVideo ? 'UPLOADING VIDEO TO SERVER...' : 'Click or Drag & Drop Video file here'}
                      </p>
                      <p className="text-[10px] text-slate-400">Supported formats: MP4, MOV, WEBM, AVI</p>
                    </div>
                  </div>

                  {/* OR: Paste Video URL */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Or Paste Video URL Manually</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="e.g. https://your-server.com/uploads/intro.mp4"
                        value={introVideoUrl}
                        onChange={(e) => setIntroVideoUrl(e.target.value)}
                        className="flex-1 bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl outline-none focus:border-[#E6C36A]"
                      />
                      <button
                        onClick={handleIntroVideoUrlSave}
                        className="px-6 py-3 bg-[#E6C36A] hover:bg-[#C99A3A] text-[#071B35] font-black text-xs uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <FiUpload size={14} /> SAVE VIDEO URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: 60-SECOND ENGINEER INTRODUCTION VIDEO */}
              <div className="bg-[#102847] p-5 md:p-6 rounded-2xl border border border-slate-700 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/60 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-[#E6C36A] uppercase font-heading flex items-center gap-2">
                      <FiVideo size={16} /> 60-Second Engineer Introduction Video
                    </h3>
                    <p className="text-xs text-slate-300">
                      Manage the video that plays when visitors click "Watch 60-Second Engineer Introduction" on the homepage.
                    </p>
                    <p className="text-xs font-bold text-white break-all pt-1">{engineerVideoUrl || 'No video configured'}</p>
                  </div>

                  {engineerVideoUrl && (
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <a
                        href={engineerVideoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 bg-[#E6C36A] hover:bg-[#C99A3A] text-[#071B35] text-xs font-black uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <FiPlay size={14} /> Open / Preview
                      </a>

                      <button
                        onClick={handleDeleteEngineerVideo}
                        className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 text-xs font-black uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <FiTrash2 size={14} /> Reset Video
                      </button>
                    </div>
                  )}
                </div>

                {/* Embedded Live Video / Youtube Preview */}
                {engineerVideoUrl && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase mb-3 flex items-center gap-2">
                      <FiPlay className="text-[#E6C36A]" size={14} /> Live Engineer Video Preview
                    </h4>
                    <div className="w-full rounded-xl overflow-hidden border border-slate-700 bg-black max-h-96 flex items-center justify-center">
                      {engineerVideoUrl.includes("youtube.com") || engineerVideoUrl.includes("youtu.be") ? (
                        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                          <iframe
                            key={engineerVideoUrl}
                            src={engineerVideoUrl}
                            title="60-Second Engineer Video Preview"
                            className="absolute inset-0 w-full h-full border-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <video
                          key={engineerVideoUrl}
                          src={engineerVideoUrl}
                          controls
                          className="w-full max-h-96 object-contain bg-black"
                          preload="metadata"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Upload New Video File Section */}
                <div className="border-t border-slate-700/60 pt-4 space-y-4">
                  <label className="block text-xs font-bold text-white mb-2 uppercase">
                    Upload 60-Second Engineer Video File (MP4 / MOV / WEBM)
                  </label>
                  <div className="relative border-2 border-dashed border-[#E6C36A]/40 hover:border-[#E6C36A] bg-[#071B35] rounded-2xl p-6 text-center transition-all">
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,.mp4,.mov,.webm,.avi"
                      onChange={handleEngineerVideoUpload}
                      disabled={uploadingEngineerVideo}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2 pointer-events-none">
                      <FiUpload size={32} className="mx-auto text-[#E6C36A]" />
                      <p className="text-xs font-bold text-white uppercase">
                        {uploadingEngineerVideo ? 'UPLOADING ENGINEER VIDEO...' : 'Click or Drag & Drop Video file here'}
                      </p>
                      <p className="text-[10px] text-slate-400">Supported formats: MP4, MOV, WEBM, AVI</p>
                    </div>
                  </div>

                  {/* OR: Paste Video URL / YouTube Link */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Or Paste Video URL / YouTube Embed URL Manually</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1 or uploaded MP4 URL"
                        value={engineerVideoUrl}
                        onChange={(e) => setEngineerVideoUrl(e.target.value)}
                        className="flex-1 bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl outline-none focus:border-[#E6C36A]"
                      />
                      <button
                        onClick={handleEngineerVideoUrlSave}
                        className="px-6 py-3 bg-[#E6C36A] hover:bg-[#C99A3A] text-[#071B35] font-black text-xs uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <FiUpload size={14} /> SAVE ENGINEER VIDEO URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub-section: Custom Video Cover Image / Owner Cover */}
                <div className="border-t border-slate-700/60 pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-[#E6C36A] uppercase flex items-center gap-1.5">
                        <FiUpload size={14} /> Custom Section Cover Image / Owner Photo
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Upload or set a custom cover photo (e.g. owner photo or project thumbnail) displayed on the "Meet Your Engineer" section card on the homepage.
                      </p>
                    </div>
                    {engineerCoverImage && (
                      <button
                        onClick={handleDeleteEngineerCover}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 text-[10px] font-black uppercase rounded-lg transition-all flex items-center gap-1 shrink-0"
                      >
                        <FiTrash2 size={12} /> Remove Cover
                      </button>
                    )}
                  </div>

                  {engineerCoverImage && (
                    <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-700 bg-black">
                      <img src={engineerCoverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Upload Local Cover Image (JPG/PNG)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEngineerCoverUpload}
                        disabled={uploadingEngineerCover}
                        className="w-full bg-[#071B35] border border-[#E6C36A]/40 text-slate-300 text-xs px-3 py-2.5 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Or Paste Cover Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={engineerCoverImage}
                          onChange={(e) => setEngineerCoverImage(e.target.value)}
                          className="flex-1 bg-[#071B35] border border-[#102847] text-white text-xs px-3 py-2.5 rounded-xl outline-none focus:border-[#E6C36A]"
                        />
                        <button
                          onClick={handleEngineerCoverUrlSave}
                          className="px-4 py-2.5 bg-[#E6C36A] hover:bg-[#C99A3A] text-[#071B35] font-black text-xs uppercase rounded-xl shadow-md shrink-0"
                        >
                          SAVE COVER
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help / Info Box */}
              <div className="bg-[#102847]/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-[#E6C36A]">ℹ️ How it works:</strong>
                  <br />• <strong>Hero Background Video:</strong> Plays automatically in the hero header.
                  <br />• <strong>60-Second Engineer Intro Video:</strong> Plays in a modal when visitors click "Watch 60-Second Engineer Introduction" on the homepage. You can upload custom MP4 files directly or paste YouTube video links.
                </p>
              </div>
            </div>
          )}

          {/* TAB 8: ADMIN ACCOUNT & SECURITY */}
          {activeTab === "security" && (
            <div className="bg-[#071B35] p-6 rounded-3xl border border-[#102847] space-y-6">
              <div className="border-b border-[#102847] pb-4">
                <h2 className="text-xl font-black text-white font-heading uppercase flex items-center gap-2">
                  <FiLock className="text-[#E6C36A]" size={22} /> Admin Account & Login Credentials
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage the email address and password required to access this Admin Panel.
                </p>
              </div>

              <form onSubmit={handleSaveCredentials} className="space-y-5 max-w-xl">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Admin Login Email *</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3.5 pl-10 rounded-xl outline-none focus:border-[#E6C36A]"
                      placeholder="e.g. admin@mahaconstructions.com"
                    />
                    <FiMail className="absolute left-3.5 top-4 text-slate-400" size={14} />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Admin Login Password *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3.5 pl-10 rounded-xl outline-none focus:border-[#E6C36A]"
                      placeholder="Enter password"
                    />
                    <FiKey className="absolute left-3.5 top-4 text-slate-400" size={14} />
                  </div>
                </div>

                <div className="p-4 bg-[#102847] rounded-2xl border border-[#E6C36A]/30 space-y-1.5 text-xs">
                  <p className="font-bold text-[#E6C36A] uppercase flex items-center gap-1">
                    <FiLock size={12} /> Active Admin Login Info:
                  </p>
                  <p className="text-slate-200">Email: <code className="text-white font-mono bg-black/40 px-2 py-0.5 rounded">{adminEmail}</code></p>
                  <p className="text-slate-200">Password: <code className="text-white font-mono bg-black/40 px-2 py-0.5 rounded">{adminPassword}</code></p>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#E6C36A] hover:bg-[#C99A3A] text-[#071B35] font-black text-xs uppercase rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <FiLock size={16} /> SAVE CREDENTIALS
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* ── MODALS WITH LOCAL FILE PICKERS ── */}

      {/* Modal 1: Client Video Testimonial Modal */}
      {testimonialModal && (
        <div className="fixed inset-0 bg-[#071B35]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveTestimonial} className="w-full max-w-md bg-[#071B35] border border-[#E6C36A] rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-black text-white uppercase">{testimonialModal.mode === "add" ? "Upload Client Video Review" : "Edit Video Review"}</h3>
            
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Client Name</label>
              <input
                type="text"
                placeholder="e.g. Mr. Suresh Kumar"
                value={testimonialModal.data.name}
                onChange={(e) => setTestimonialModal({ ...testimonialModal, data: { ...testimonialModal.data, name: e.target.value } })}
                className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Location & Project Info</label>
              <input
                type="text"
                placeholder="e.g. Nagercoil (3,200 sq.ft Villa)"
                value={testimonialModal.data.location}
                onChange={(e) => setTestimonialModal({ ...testimonialModal, data: { ...testimonialModal.data, location: e.target.value } })}
                className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Video Duration</label>
              <input
                type="text"
                placeholder="e.g. 2:45"
                value={testimonialModal.data.duration || "2:30"}
                onChange={(e) => setTestimonialModal({ ...testimonialModal, data: { ...testimonialModal.data, duration: e.target.value } })}
                className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl"
                required
              />
            </div>

            {/* Local Video File Picker */}
            <div>
              <label className="text-[10px] font-bold text-[#E6C36A] uppercase block mb-1 flex items-center gap-1">
                <FiUpload size={12} /> Upload Local Client Video File (MP4/MOV)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLocalFileUpload(file, (url) => setTestimonialModal({ ...testimonialModal, data: { ...testimonialModal.data, videoUrl: url } }));
                }}
                className="w-full bg-[#071B35] border border-[#E6C36A]/40 text-slate-300 text-xs px-3 py-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Or paste video URL / YouTube Embed URL"
                value={testimonialModal.data.videoUrl}
                onChange={(e) => setTestimonialModal({ ...testimonialModal, data: { ...testimonialModal.data, videoUrl: e.target.value } })}
                className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-2.5 rounded-xl mt-2"
              />
            </div>

            {/* Local Video Thumbnail Image Picker */}
            <div>
              <label className="text-[10px] font-bold text-[#E6C36A] uppercase block mb-1 flex items-center gap-1">
                <FiUpload size={12} /> Upload Video Thumbnail Cover Image (JPG/PNG)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLocalFileUpload(file, (url) => setTestimonialModal({ ...testimonialModal, data: { ...testimonialModal.data, thumbnail: url } }));
                }}
                className="w-full bg-[#071B35] border border-[#E6C36A]/40 text-slate-300 text-xs px-3 py-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Or paste image URL"
                value={testimonialModal.data.thumbnail}
                onChange={(e) => setTestimonialModal({ ...testimonialModal, data: { ...testimonialModal.data, thumbnail: e.target.value } })}
                className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-2.5 rounded-xl mt-2"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={uploading} className="flex-1 py-3 bg-[#E6C36A] text-[#071B35] font-black text-xs uppercase rounded-xl">
                {uploading ? "UPLOADING FILE..." : "SAVE VIDEO TESTIMONIAL"}
              </button>
              <button type="button" onClick={() => setTestimonialModal(null)} className="px-5 py-3 bg-[#102847] text-white text-xs uppercase rounded-xl">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 2: Project Image Upload Modal */}
      {projectModal && (
        <div className="fixed inset-0 bg-[#071B35]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveProject} className="w-full max-w-md bg-[#071B35] border border-[#E6C36A] rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-black text-white uppercase">{projectModal.mode === "add" ? "Upload Completed Project" : "Edit Project"}</h3>
            
            <input
              type="text"
              placeholder="Project Title (e.g. Royal Palm Villa)"
              value={projectModal.data.title}
              onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, title: e.target.value } })}
              className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl"
              required
            />

            <input
              type="text"
              placeholder="Location (e.g. Nagercoil, Kanyakumari)"
              value={projectModal.data.location}
              onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, location: e.target.value } })}
              className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl"
              required
            />

            <input
              type="text"
              placeholder="Category / Type (e.g. Luxury Villa)"
              value={projectModal.data.type}
              onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, type: e.target.value } })}
              className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl"
              required
            />

            <input
              type="text"
              placeholder="Building Area (e.g. 3,200 sq.ft)"
              value={projectModal.data.sqft}
              onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, sqft: e.target.value } })}
              className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl"
              required
            />

            {/* Local Image File Picker */}
            <div>
              <label className="text-[10px] font-bold text-[#E6C36A] uppercase block mb-1 flex items-center gap-1">
                <FiUpload size={12} /> Select Local House Image File (JPG/PNG/WEBP)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLocalFileUpload(file, (url) => setProjectModal({ ...projectModal, data: { ...projectModal.data, image: url } }));
                }}
                className="w-full bg-[#071B35] border border-[#E6C36A]/40 text-slate-300 text-xs px-3 py-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Or paste image URL"
                value={projectModal.data.image || ""}
                onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, image: e.target.value } })}
                className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-2.5 rounded-xl mt-2"
              />
            </div>

            {/* Local Video File Picker */}
            <div>
              <label className="text-[10px] font-bold text-[#E6C36A] uppercase block mb-1 flex items-center gap-1">
                <FiUpload size={12} /> Select Local Project Walkthrough Video (MP4/MOV)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLocalFileUpload(file, (url) => setProjectModal({ ...projectModal, data: { ...projectModal.data, videoUrl: url } }));
                }}
                className="w-full bg-[#071B35] border border-[#E6C36A]/40 text-slate-300 text-xs px-3 py-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Or paste video URL"
                value={projectModal.data.videoUrl || ""}
                onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, videoUrl: e.target.value } })}
                className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-2.5 rounded-xl mt-2"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={uploading} className="flex-1 py-3 bg-[#E6C36A] text-[#071B35] font-black text-xs uppercase rounded-xl">
                {uploading ? "UPLOADING IMAGE..." : "SAVE PROJECT"}
              </button>
              <button type="button" onClick={() => setProjectModal(null)} className="px-5 py-3 bg-[#102847] text-white text-xs uppercase rounded-xl">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 3: YouTube Video Upload Modal */}
      {videoModal && (
        <div className="fixed inset-0 bg-[#071B35]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveVideo} className="w-full max-w-md bg-[#071B35] border border-[#EF4444] rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-black text-white uppercase">{videoModal.mode === "add" ? "Upload Site Video" : "Edit Video"}</h3>
            
            <input
              type="text"
              placeholder="Video Title"
              value={videoModal.data.title}
              onChange={(e) => setVideoModal({ ...videoModal, data: { ...videoModal.data, title: e.target.value } })}
              className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl"
              required
            />

            <input
              type="text"
              placeholder="Duration (e.g. 4:15)"
              value={videoModal.data.duration}
              onChange={(e) => setVideoModal({ ...videoModal, data: { ...videoModal.data, duration: e.target.value } })}
              className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl"
              required
            />

            <div>
              <label className="text-[10px] font-bold text-[#EF4444] uppercase block mb-1 flex items-center gap-1">
                <FiUpload size={12} /> Select Local Video File (MP4/MOV)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLocalFileUpload(file, (url) => setVideoModal({ ...videoModal, data: { ...videoModal.data, videoUrl: url } }));
                }}
                className="w-full bg-[#071B35] border border-[#EF4444]/40 text-slate-300 text-xs px-3 py-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Or paste video URL / YouTube Embed URL"
                value={videoModal.data.videoUrl || ""}
                onChange={(e) => setVideoModal({ ...videoModal, data: { ...videoModal.data, videoUrl: e.target.value } })}
                className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-2.5 rounded-xl mt-2"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#EF4444] uppercase block mb-1 flex items-center gap-1">
                <FiUpload size={12} /> Select Thumbnail Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLocalFileUpload(file, (url) => setVideoModal({ ...videoModal, data: { ...videoModal.data, thumbnail: url } }));
                }}
                className="w-full bg-[#071B35] border border-[#EF4444]/40 text-slate-300 text-xs px-3 py-2 rounded-xl"
              />
              <input
                type="text"
                placeholder="Or paste image URL"
                value={videoModal.data.thumbnail || ""}
                onChange={(e) => setVideoModal({ ...videoModal, data: { ...videoModal.data, thumbnail: e.target.value } })}
                className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-2.5 rounded-xl mt-2"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={uploading} className="flex-1 py-3 bg-[#EF4444] text-white font-black text-xs uppercase rounded-xl">
                {uploading ? "UPLOADING..." : "SAVE VIDEO"}
              </button>
              <button type="button" onClick={() => setVideoModal(null)} className="px-5 py-3 bg-[#102847] text-white text-xs uppercase rounded-xl">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 4: Package Modal */}
      {packageModal && (
        <div className="fixed inset-0 bg-[#071B35]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSavePackage} className="w-full max-w-xl bg-[#071B35] border border-[#E6C36A] rounded-3xl p-6 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-white uppercase font-heading flex items-center gap-2">
              <FiPackage className="text-[#E6C36A]" size={20} />
              {packageModal.mode === "add" ? "Add Construction Package" : "Edit Construction Package"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Package Type / Division *</label>
                <select
                  value={packageModal.data.division || "residential"}
                  onChange={(e) => setPackageModal({ ...packageModal, data: { ...packageModal.data, division: e.target.value } })}
                  className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl outline-none focus:border-[#E6C36A]"
                  required
                >
                  <option value="residential">🏡 Residential Construction</option>
                  <option value="commercial">🏢 Commercial Construction</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Tier Category *</label>
                <select
                  value={packageModal.data.tier || "basic"}
                  onChange={(e) => setPackageModal({ ...packageModal, data: { ...packageModal.data, tier: e.target.value } })}
                  className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl outline-none focus:border-[#E6C36A]"
                  required
                >
                  <option value="basic">Basic Tier</option>
                  <option value="premium">Premium Tier</option>
                  <option value="luxury">Luxury Tier</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Package Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Basic Plan, Premium Corporate"
                  value={packageModal.data.title || ""}
                  onChange={(e) => setPackageModal({ ...packageModal, data: { ...packageModal.data, title: e.target.value } })}
                  className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl outline-none focus:border-[#E6C36A]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Tagline / Subtitle *</label>
                <input
                  type="text"
                  placeholder="e.g. Quality & Elegance, Solid & Affordable"
                  value={packageModal.data.subtitle || packageModal.data.tagline || ""}
                  onChange={(e) => setPackageModal({ ...packageModal, data: { ...packageModal.data, subtitle: e.target.value, tagline: e.target.value } })}
                  className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl outline-none focus:border-[#E6C36A]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Price per Sq.Ft (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 2399"
                  value={packageModal.data.price_per_sqft || ""}
                  onChange={(e) => setPackageModal({ ...packageModal, data: { ...packageModal.data, price_per_sqft: e.target.value, price: `₹${e.target.value}` } })}
                  className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl outline-none focus:border-[#E6C36A]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Warranty (Years)</label>
                <input
                  type="number"
                  placeholder="e.g. 15"
                  value={packageModal.data.warranty_years || 10}
                  onChange={(e) => setPackageModal({ ...packageModal, data: { ...packageModal.data, warranty_years: e.target.value } })}
                  className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl outline-none focus:border-[#E6C36A]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Delivery (Months)</label>
                <input
                  type="number"
                  placeholder="e.g. 14"
                  value={packageModal.data.delivery_months || 12}
                  onChange={(e) => setPackageModal({ ...packageModal, data: { ...packageModal.data, delivery_months: e.target.value } })}
                  className="w-full bg-[#071B35] border border-[#102847] text-white text-xs px-4 py-3 rounded-xl outline-none focus:border-[#E6C36A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Package Description</label>
              <textarea
                rows={2}
                placeholder="Overview of this construction package..."
                value={packageModal.data.description || ""}
                onChange={(e) => setPackageModal({ ...packageModal, data: { ...packageModal.data, description: e.target.value } })}
                className="w-full bg-[#071B35] border border-[#102847] text-white text-xs p-3 rounded-xl outline-none focus:border-[#E6C36A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Key Specifications / Material Brands (Comma Separated)</label>
              <textarea
                rows={3}
                placeholder="Fe-550 TMT (JSW), Ultratech Premium Cement, Kajaria Tiles (4'×2'), Jaquar Sanitary"
                value={packageModal.data.features || ""}
                onChange={(e) => setPackageModal({ ...packageModal, data: { ...packageModal.data, features: e.target.value } })}
                className="w-full bg-[#071B35] border border-[#102847] text-white text-xs p-3 rounded-xl outline-none focus:border-[#E6C36A]"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Inclusions (Comma Separated)</label>
              <textarea
                rows={2}
                placeholder="Site supervision, Civil structural work, Modular kitchen carcass, CCTV provision"
                value={packageModal.data.inclusions || ""}
                onChange={(e) => setPackageModal({ ...packageModal, data: { ...packageModal.data, inclusions: e.target.value } })}
                className="w-full bg-[#071B35] border border-[#102847] text-white text-xs p-3 rounded-xl outline-none focus:border-[#E6C36A]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Exclusions (Comma Separated)</label>
              <textarea
                rows={2}
                placeholder="Interior furniture, Landscaping, Smart automation"
                value={packageModal.data.exclusions || ""}
                onChange={(e) => setPackageModal({ ...packageModal, data: { ...packageModal.data, exclusions: e.target.value } })}
                className="w-full bg-[#071B35] border border-[#102847] text-white text-xs p-3 rounded-xl outline-none focus:border-[#E6C36A]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_highlighted"
                checked={Boolean(packageModal.data.is_highlighted || packageModal.data.popular)}
                onChange={(e) => setPackageModal({ ...packageModal, data: { ...packageModal.data, is_highlighted: e.target.checked, popular: e.target.checked } })}
                className="w-4 h-4 rounded border-[#102847] bg-[#071B35] accent-[#E6C36A] cursor-pointer"
              />
              <label htmlFor="is_highlighted" className="text-xs font-bold text-white cursor-pointer select-none">
                Highlight as "Most Popular Choice" Package
              </label>
            </div>

            <div className="flex gap-2 pt-3">
              <button type="submit" className="flex-1 py-3 bg-[#E6C36A] hover:bg-[#C99A3A] text-[#071B35] font-black text-xs uppercase rounded-xl shadow-md cursor-pointer transition-all">
                {packageModal.mode === "add" ? "CREATE PACKAGE" : "SAVE CHANGES"}
              </button>
              <button type="button" onClick={() => setPackageModal(null)} className="px-5 py-3 bg-[#102847] hover:bg-slate-700 text-white text-xs uppercase rounded-xl cursor-pointer transition-all">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
