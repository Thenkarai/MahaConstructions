import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.core.database import engine, Base, SessionLocal
from app.models import models
from app.core.security import get_password_hash
from app.routers.api import router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Maha Construction API",
    description="Premium Luxury Construction Company Enterprise API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(router, prefix="/api")

# Mount Uploads directory to serve files statically
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# Populate Database with Luxury Data if empty
def preseed_database():
    db = SessionLocal()
    try:
        # 1. Create / Update Default Admin User
        admin_email = "Mahaconstructions2013@gmail.com"
        admin_pass = "Maharajan@2013"
        existing_admin = db.query(models.User).filter(models.User.email == admin_email).first()
        if not existing_admin:
            first_user = db.query(models.User).first()
            if first_user:
                first_user.email = admin_email
                first_user.hashed_password = get_password_hash(admin_pass)
                db.commit()
            else:
                admin_user = models.User(
                    email=admin_email,
                    hashed_password=get_password_hash(admin_pass),
                    full_name="Maha Admin",
                    role="admin",
                    is_active=True
                )
                db.add(admin_user)
                db.commit()
            print(f"Pre-seeded / Updated: Admin User ({admin_email})")

        # 2. Pre-seed Services
        if db.query(models.Service).count() == 0:
            services = [
                models.Service(
                    name="Residential Construction",
                    slug="residential-construction",
                    overview="Crafting bespoke luxury estates designed for multi-generational comfort. Every residence is built as a work of art, merging architectural elegance with sustainable materials.",
                    benefits=["Custom tailormade design", "Eco-friendly structural framing", "Smart home systems integration", "Premium Italian marble and custom joinery"],
                    process=[
                        {"step": "1", "title": "Concept Design", "description": "Collaborative sketching and layout refinement with our principal architects."},
                        {"step": "2", "title": "Engineering & Approvals", "description": "Rigorous structural engineering assessments and municipal permitting."},
                        {"step": "3", "title": "Construction Phase", "description": "Precision construction executed by our certified craftsmen."},
                        {"step": "4", "title": "Handover & Warranty", "description": "White-glove walkthrough and custom manuals delivery."}
                    ],
                    image_url="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                    category="Residential"
                ),
                models.Service(
                    name="Commercial Construction",
                    slug="commercial-construction",
                    overview="Developing iconic corporate headquarters, high-end retail structures, and premium office facilities that inspire progress and optimize functional workflow.",
                    benefits=["LEED-certified standard builds", "Optimized open-plan floorplates", "Advanced seismic load designs", "Fast-track scheduling control"],
                    process=[
                        {"step": "1", "title": "Strategic Planning", "description": "Aligning space design with commercial operational flow and branding."},
                        {"step": "2", "title": "Rapid Prefabrication", "description": "Leveraging modular off-site assembly for minimal on-site timeline."},
                        {"step": "3", "title": "Core & Shell Assembly", "description": "High-strength concrete and custom curtain-wall execution."},
                        {"step": "4", "title": "Tenant Fit-Out", "description": "Custom high-end interior finishes tailored for occupancy."}
                    ],
                    image_url="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
                    category="Commercial"
                ),
                models.Service(
                    name="Architecture",
                    slug="architecture",
                    overview="Pioneering minimalist and sculptural building structures. We design with light, shadow, raw concrete, steel, and timber to form emotional connections with space.",
                    benefits=["Award-winning design philosophy", "Passive heating & cooling design", "BIM 3D modeling standard", "Custom structural engineering integration"],
                    process=[
                        {"step": "1", "title": "Site & Flow Analysis", "description": "Analyzing sun pathways, elevations, and views to optimize site layout."},
                        {"step": "2", "title": "Schematic Projections", "description": "Initial hand-sketches and basic form-finding studies."},
                        {"step": "3", "title": "Detailed Spatial Layouts", "description": "Perfecting proportions and defining primary material selections."},
                        {"step": "4", "title": "BIM Integration", "description": "Creating full digital twins of the construction blueprint."}
                    ],
                    image_url="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
                    category="Design"
                ),
                models.Service(
                    name="Interior Design",
                    slug="interior-design",
                    overview="Curating minimalist interiors that embody tactile warmth. We combine bespoke furniture, textured plaster, and subtle indirect lighting for a serene setting.",
                    benefits=["Custom furniture curation", "Natural material palettes", "Ergonomic lighting schemes", "Acoustic spatial engineering"],
                    process=[
                        {"step": "1", "title": "Moodboards & Textures", "description": "Defining the sensory palette: wood, stone, and plaster selection."},
                        {"step": "2", "title": "Bespoke Joinery Drafts", "description": "Designing custom closets, kitchens, and architectural screens."},
                        {"step": "3", "title": "Furniture Procurement", "description": "Sourcing rare fabrics and designer pieces globally."},
                        {"step": "4", "title": "Styling & Setup", "description": "Art curation, precise lighting adjustment, and hand-over."}
                    ],
                    image_url="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
                    category="Design"
                )
            ]
            db.bulk_save_objects(services)
            print("Pre-seeded: Services")

        # 3. Pre-seed Projects
        if db.query(models.Project).count() == 0:
            projects = [
                models.Project(
                    name="The Glass Pavilion",
                    client="Alexander Vance",
                    location="Alibaug, Maharashtra",
                    budget="₹12.4 Crore",
                    completion_date="October 2025",
                    duration="18 Months",
                    architecture_style="Modernist Minimalism",
                    description="Perched on a coastal cliff, this residential masterpiece features floor-to-ceiling structural glass, raw board-formed concrete, and a cantilevered infinity pool that merges seamlessly with the Arabian Sea horizon.",
                    image_urls=[
                        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
                    ],
                    video_url="https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-swimming-pool-42352-large.mp4",
                    timeline=[
                        {"phase": "Foundation", "duration": "3 Months", "description": "Deep-pile anchoring into coastal rock."},
                        {"phase": "Steel Framing", "duration": "4 Months", "description": "Super-slim structural steel layout."},
                        {"phase": "Glass Installation", "duration": "3 Months", "description": "Double-laminated structural glass fitment."},
                        {"phase": "Finishes & Handover", "duration": "8 Months", "description": "Travertine tiling and smart-home programming."}
                    ],
                    category="residential",
                    is_featured=True
                ),
                models.Project(
                    name="Aura Commercial Center",
                    client="Aura Group Holdings",
                    location="Worli, Mumbai",
                    budget="₹48.5 Crore",
                    completion_date="March 2026",
                    duration="24 Months",
                    architecture_style="Parametric High-Tech",
                    description="An architectural statement featuring a twisted dynamic steel structure, double-skin self-ventilating facade, and multi-level sky gardens serving as communal workspace hubs in Mumbai.",
                    image_urls=[
                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1200&q=80"
                    ],
                    video_url="https://assets.mixkit.co/videos/preview/mixkit-modern-city-skyscrapers-business-district-41920-large.mp4",
                    timeline=[
                        {"phase": "Excavation", "duration": "5 Months", "description": "Three-level underground parking excavation."},
                        {"phase": "Concrete Core", "duration": "7 Months", "description": "Slipformed central elevator structural concrete core."},
                        {"phase": "Steel Facade", "duration": "6 Months", "description": "Curtain-wall shell and structural steel assembly."},
                        {"phase": "Interior Systems", "duration": "6 Months", "description": "HVAC and mechanical networks."}
                    ],
                    category="commercial",
                    is_featured=True
                ),
                models.Project(
                    name="Zen Horizon Villa",
                    client="Dr. Liam Thorne",
                    location="Udaipur, Rajasthan",
                    budget="₹6.8 Crore",
                    completion_date="December 2024",
                    duration="14 Months",
                    architecture_style="Japanese Organic Modernism",
                    description="Blending traditional courtyard architecture with modern structural concrete. Features custom cedar wood screens, tatami lounge integration, and a central rock garden with trickling spring water in Udaipur.",
                    image_urls=[
                        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
                        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80"
                    ],
                    video_url="",
                    timeline=[
                        {"phase": "Grading", "duration": "2 Months", "description": "Terraced hillside grading and retaining walls."},
                        {"phase": "Wood Joinery", "duration": "5 Months", "description": "Traditional mortarless joinery assembly."},
                        {"phase": "Interior Trim", "duration": "4 Months", "description": "Shoji screens and custom tatami mats placement."},
                        {"phase": "Landscaping", "duration": "3 Months", "description": "Authentic Zen stone garden arrangement."}
                    ],
                    category="villa",
                    is_featured=True
                )
            ]
            db.bulk_save_objects(projects)
            print("Pre-seeded: Projects")

        # 4. Pre-seed Gallery
        if db.query(models.GalleryItem).count() == 0:
            gallery = [
                models.GalleryItem(title="Living Room Minimalist Plaster", category="interior", image_url="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"),
                models.GalleryItem(title="Board Formed Concrete Facade", category="residential", image_url="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"),
                models.GalleryItem(title="Skyscraper Steel Framing", category="commercial", image_url="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"),
                models.GalleryItem(title="Travertine Floating Stairs", category="interior", image_url="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"),
                models.GalleryItem(title="Oceanfront Pool Overhang", category="residential", image_url="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80")
            ]
            db.bulk_save_objects(gallery)
            print("Pre-seeded: Gallery Items")

        # 5. Pre-seed Testimonials (Video Testimonials)
        if db.query(models.Testimonial).count() == 0:
            testimonials = [
                models.Testimonial(
                    client_name="Alexander Vance",
                    client_role="Owner, Glass Pavilion",
                    rating=5,
                    feedback="Video Review: Complete architectural milestone achieved with Maha Construction.",
                    image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
                    video_url="https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-swimming-pool-42352-large.mp4",
                    project_name="The Glass Pavilion (Alibaug)",
                    duration="2:45"
                ),
                models.Testimonial(
                    client_name="Sarah Jenkins & Family",
                    client_role="VP Operations, Aura Group",
                    rating=5,
                    feedback="Video Review: Complex parametric high-rise delivered ahead of schedule.",
                    image_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
                    video_url="https://assets.mixkit.co/videos/preview/mixkit-modern-city-skyscrapers-business-district-41920-large.mp4",
                    project_name="Aura Commercial Center (Mumbai)",
                    duration="3:10"
                ),
                models.Testimonial(
                    client_name="Mr. Suresh Kumar",
                    client_role="Homeowner, Nagercoil",
                    rating=5,
                    feedback="Video Review: Maha Construction delivered our dream home beyond expectations.",
                    image_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
                    video_url="https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-swimming-pool-42352-large.mp4",
                    project_name="3,200 sq.ft Luxury Villa",
                    duration="2:30"
                )
            ]
            db.bulk_save_objects(testimonials)
            print("Pre-seeded: Video Testimonials")

        # 6. Pre-seed FAQs
        if db.query(models.FAQItem).count() == 0:
            faqs = [
                models.FAQItem(question="What is Maha Construction's design-build philosophy?", answer="We believe in 'honest materialism'—letting raw board-formed concrete, structural steel, natural stone, and cedar timber speak for themselves. We operate a fully integrated architectural and engineering service to minimize site revisions.", category="Process"),
                models.FAQItem(question="Do you build in international jurisdictions?", answer="Yes, we construct high-end residential and commercial landmarks globally, utilizing regional craft masters while maintaining strict oversight through our central engineering and project management office.", category="Operations"),
                models.FAQItem(question="How is sustainability incorporated?", answer="We construct carbon-neutral systems. By implementing thick geothermal slabs, high-performance insulated glazing, and solar photovoltaic pergolas, our buildings routinely achieve top green building standard ratings.", category="Sustainability")
            ]
            db.bulk_save_objects(faqs)
            print("Pre-seeded: FAQs")

        # 7. Pre-seed Package Details
        if db.query(models.PackageDetail).count() == 0:
            packages = [
                # ─── RESIDENTIAL ───
                models.PackageDetail(
                    division="residential", tier="basic", title="Basic Plan", subtitle="Solid & Affordable",
                    price_per_sqft=1999, is_highlighted=False, warranty_years=10, delivery_months=12,
                    description="A solid, cost-effective residential build using quality materials, standard-grade finishes, and proven structural systems — ideal for budget-conscious homeowners.",
                    features=["Fe-500 TMT steel", "Coromandel / ACC cement", "M-Sand blockwork", "Vitrified floor tiles (2'×2')", "Parryware CP fittings", "Kundan / Anchor concealed wiring", "Flush door entry system", "Asian Paints Emulsion finish"],
                    inclusions=["Site supervision", "Civil structural work", "Plastering & waterproofing", "Electrical wiring (concealed)", "Plumbing works", "Toilet sanitary fixtures", "Main door with frame"],
                    exclusions=["Interior design", "Modular kitchen", "Landscaping", "Smart home systems"]
                ),
                models.PackageDetail(
                    division="residential", tier="premium", title="Premium Plan", subtitle="Quality & Elegance",
                    price_per_sqft=2399, is_highlighted=True, warranty_years=15, delivery_months=14,
                    description="A premium residential construction package with superior materials, polished finishes, and enhanced structural systems — built for growing families seeking elevated quality.",
                    features=["Fe-550 TMT (JSW / Vizag Steel)", "Ultratech Premium / Dalmia cement", "Double-washed M-Sand", "Kajaria double charged tiles (4'×2')", "Jaquar sanitary & CP sets", "Polycab wires & Roma switches", "Teak wood entry door", "Asian Paints Apex Ultima"],
                    inclusions=["All Basic inclusions", "Modular kitchen carcass", "Premium tile work", "CCTV provision", "Power backup provision", "Gypsum ceiling in living areas"],
                    exclusions=["Interior furniture", "Landscaping", "Smart automation"]
                ),
                models.PackageDetail(
                    division="residential", tier="luxury", title="Luxury Plan", subtitle="Elite Craftsmanship",
                    price_per_sqft=2999, is_highlighted=False, warranty_years=20, delivery_months=18,
                    description="A fully bespoke luxury residential build using world-class materials, custom architectural details, and premium brand fixtures — crafted for discerning homeowners.",
                    features=["Fe-550 TMT (Tata Tiscon / JSPL)", "Birla Super / ACC Gold cement", "River sand / premium concrete sand", "Italian Travertine / marble slabs", "Kohler / Grohe collection", "Finolex cables & Legrand switches", "First-grade carved teak doors", "Royale textured / custom panel finish"],
                    inclusions=["All Premium inclusions", "Full modular kitchen", "Smart home pre-wiring", "Home theatre provision", "Landscape design (basic)", "Custom ceiling designs", "Premium bathroom accessories"],
                    exclusions=["Smart home devices", "Furniture & furnishings"]
                ),
                # ─── COMMERCIAL ───
                models.PackageDetail(
                    division="commercial", tier="basic", title="Standard Shell", subtitle="Functional & Efficient",
                    price_per_sqft=2199, is_highlighted=False, warranty_years=10, delivery_months=14,
                    description="A functional, code-compliant commercial shell ideal for office spaces, retail outlets, and light commercial use — efficient and cost-effective at scale.",
                    features=["Fe-500 TMT structural steel", "OPC 53 grade cement", "RCC framed structure", "Vitrified floor tiles", "Standard plumbing systems", "Industrial-grade electrical wiring", "Aluminium doors & windows", "Exterior cement texture paint"],
                    inclusions=["Core structural work", "Basic MEP (electrical & plumbing)", "Slab & column concrete", "External plastering", "Staircase with MS railing", "Commercial-grade flooring", "Waterproofing of terrace"],
                    exclusions=["Interior partitions", "HVAC systems", "False ceiling", "Fire safety systems"]
                ),
                models.PackageDetail(
                    division="commercial", tier="premium", title="Premium Corporate", subtitle="Professional & Polished",
                    price_per_sqft=2799, is_highlighted=True, warranty_years=15, delivery_months=18,
                    description="A professional-grade commercial building with premium structural detailing, enhanced MEP systems, and modern facade finishes — suited for corporate offices and retail centers.",
                    features=["Fe-550 TMT (JSW Steel)", "Ultratech / Ambuja cement", "RCC frame + shear walls", "Granite / double charged vitrified", "Jaquar / Hindware fixtures", "Polycab wires + RCCB MCB panel", "Anodized aluminium UPVC systems", "Texture + reflective glass curtain"],
                    inclusions=["All Shell inclusions", "False ceiling provision", "Lift pit & motor room", "HVAC duct provision", "Fire hydrant system", "CCTV & access control provision", "DG set provision"],
                    exclusions=["Fit-out interiors", "IT infrastructure", "Furniture"]
                ),
                models.PackageDetail(
                    division="commercial", tier="luxury", title="Elite Commercial", subtitle="Iconic Architecture",
                    price_per_sqft=3499, is_highlighted=False, warranty_years=20, delivery_months=24,
                    description="An iconic high-end commercial tower built to global standards — with curtain wall facades, high-capacity MEP systems, and architectural features that define city skylines.",
                    features=["Fe-550D TMT (SAIL / JSPL)", "Birla Aditya / ACC Gold cement", "Post-tensioned slabs", "Stone cladding / premium marble", "Geberit / TOTO commercial fixtures", "Legrand Mosaic / Schneider systems", "Structural glazing curtain wall", "EIFS / metal composite facade"],
                    inclusions=["All Premium inclusions", "Intelligent BMS system", "Full fire suppression system", "VRF HVAC system", "High-speed elevator system", "Basement parking structure", "Green building LEED compliance", "Architectural lighting design"],
                    exclusions=["Tenant fit-out works", "IT & AV systems"]
                ),
            ]
            db.bulk_save_objects(packages)
            print("Pre-seeded: Package Details (6 packages)")

        # 8. Pre-seed Partners (Collaborative Network)
        if db.query(models.Partner).count() == 0:
            partners = [
                models.Partner(name="HDFC BANK", division="banking", logo_url="https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=150&q=80", website_url="https://www.hdfcbank.com"),
                models.Partner(name="STATE BANK OF INDIA", division="banking", logo_url="https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=150&q=80", website_url="https://sbi.co.in"),
                models.Partner(name="ICICI BANK", division="banking", logo_url="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=150&q=80", website_url="https://www.icicibank.com"),
                models.Partner(name="AXIS BANK", division="banking", logo_url="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=150&q=80", website_url="https://www.axisbank.com"),
                models.Partner(name="KOTAK MAHINDRA", division="banking", logo_url="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=150&q=80", website_url="https://www.kotak.com"),
                models.Partner(name="YES BANK", division="banking", logo_url="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=150&q=80", website_url="https://www.yesbank.in"),
                models.Partner(name="TATA PROJECTS", division="joint_venture", logo_url="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=150&q=80", website_url="https://www.tataprojects.com"),
                models.Partner(name="LARSEN & TOUBRO", division="joint_venture", logo_url="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=150&q=80", website_url="https://www.larsentoubro.com"),
                models.Partner(name="RELIANCE INFRA", division="joint_venture", logo_url="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80", website_url="https://www.rinfra.com"),
                models.Partner(name="GODREJ PROPERTIES", division="joint_venture", logo_url="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80", website_url="https://www.godrejproperties.com"),
                models.Partner(name="SHAPOORJI PALLONJI", division="joint_venture", logo_url="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=150&q=80", website_url="https://www.shapoorjipallonji.com"),
                models.Partner(name="DLF LIMITED", division="joint_venture", logo_url="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=150&q=80", website_url="https://www.dlf.in")
            ]
            db.bulk_save_objects(partners)
            print("Pre-seeded: Partners / Collaborative Network (12 items)")

        # 9. Pre-seed Default YouTube Channel Setting
        if db.query(models.Setting).filter(models.Setting.key == "youtube_channel_url").count() == 0:
            yt_setting = models.Setting(key="youtube_channel_url", value="https://www.youtube.com/@MahaConstructions")
            db.add(yt_setting)
            print("Pre-seeded: youtube_channel_url setting")


        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error during pre-seeding: {e}")
    finally:
        db.close()

# Execute pre-seeding run
preseed_database()
