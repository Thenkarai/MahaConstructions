import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="admin") # "admin" or "editor"
    is_active = Column(Boolean, default=True)

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    client = Column(String, nullable=True)
    location = Column(String, nullable=True)
    budget = Column(String, nullable=True)
    completion_date = Column(String, nullable=True)
    duration = Column(String, nullable=True)
    architecture_style = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    image_urls = Column(JSON, nullable=True) # list of strings
    video_url = Column(String, nullable=True)
    timeline = Column(JSON, nullable=True) # list of dicts: {"phase": str, "duration": str, "description": str}
    category = Column(String, nullable=True) # "residential", "commercial", "villa", etc.
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    overview = Column(Text, nullable=True)
    benefits = Column(JSON, nullable=True) # list of strings
    process = Column(JSON, nullable=True) # list of dicts: {"step": str, "title": str, "description": str}
    image_url = Column(String, nullable=True)
    category = Column(String, nullable=True)

class GalleryItem(Base):
    __tablename__ = "gallery"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False) # "residential", "commercial", "interior", etc.
    image_url = Column(String, nullable=False)
    is_video = Column(Boolean, default=False)
    video_url = Column(String, nullable=True)
    three_sixty_url = Column(String, nullable=True) # 360 view link if any
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class BlogPost(Base):
    __tablename__ = "blogs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    author = Column(String, nullable=True)
    category = Column(String, nullable=True)
    tags = Column(String, nullable=True) # comma separated
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Testimonial(Base):
    __tablename__ = "testimonials"
    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String, nullable=False)
    client_role = Column(String, nullable=True)
    rating = Column(Integer, default=5)
    feedback = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    project_name = Column(String, nullable=True)
    duration = Column(String, nullable=True, default="2:30")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class FAQItem(Base):
    __tablename__ = "faqs"
    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String, default="General")

class ContactRequest(Base):
    __tablename__ = "contact_requests"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_read = Column(Boolean, default=False)

class QuoteRequest(Base):
    __tablename__ = "quote_requests"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    project_type = Column(String, nullable=False)
    budget_range = Column(String, nullable=True)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_read = Column(Boolean, default=False)

class MediaItem(Base):
    __tablename__ = "media"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    filetype = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Setting(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    value = Column(Text, nullable=True)

class PackageDetail(Base):
    __tablename__ = "package_details"
    id = Column(Integer, primary_key=True, index=True)
    division = Column(String, nullable=False)  # "residential" or "commercial"
    tier = Column(String, nullable=False)       # "basic", "premium", "luxury"
    title = Column(String, nullable=False)      # Display title e.g. "Basic Plan"
    subtitle = Column(String, nullable=True)    # Tagline e.g. "Quality Builds"
    price_per_sqft = Column(Integer, nullable=False, default=1999)
    description = Column(Text, nullable=True)
    features = Column(JSON, nullable=True)      # list of strings
    inclusions = Column(JSON, nullable=True)    # list of strings
    exclusions = Column(JSON, nullable=True)    # list of strings
    is_highlighted = Column(Boolean, default=False)  # "Most Popular" badge
    warranty_years = Column(Integer, default=10)
    delivery_months = Column(Integer, default=12)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)

class Partner(Base):
    __tablename__ = "partners"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    division = Column(String, nullable=False, default="banking")  # "banking" or "joint_venture"
    logo_url = Column(String, nullable=True)  # local image URL or upload link
    website_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

