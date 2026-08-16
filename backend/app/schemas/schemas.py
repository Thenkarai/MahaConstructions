from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[str] = "admin"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

# Project Schemas
class ProjectBase(BaseModel):
    name: str
    client: Optional[str] = None
    location: Optional[str] = None
    budget: Optional[str] = None
    completion_date: Optional[str] = None
    duration: Optional[str] = None
    architecture_style: Optional[str] = None
    description: Optional[str] = None
    image_urls: Optional[List[str]] = None
    video_url: Optional[str] = None
    timeline: Optional[List[Dict[str, Any]]] = None
    category: Optional[str] = None
    is_featured: Optional[bool] = False

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    client: Optional[str] = None
    location: Optional[str] = None
    budget: Optional[str] = None
    completion_date: Optional[str] = None
    duration: Optional[str] = None
    architecture_style: Optional[str] = None
    description: Optional[str] = None
    image_urls: Optional[List[str]] = None
    video_url: Optional[str] = None
    timeline: Optional[List[Dict[str, Any]]] = None
    category: Optional[str] = None
    is_featured: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Service Schemas
class ServiceBase(BaseModel):
    name: str
    slug: str
    overview: Optional[str] = None
    benefits: Optional[List[str]] = None
    process: Optional[List[Dict[str, Any]]] = None
    image_url: Optional[str] = None
    category: Optional[str] = None

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    overview: Optional[str] = None
    benefits: Optional[List[str]] = None
    process: Optional[List[Dict[str, Any]]] = None
    image_url: Optional[str] = None
    category: Optional[str] = None

class ServiceResponse(ServiceBase):
    id: int

    class Config:
        from_attributes = True

# Gallery Schemas
class GalleryBase(BaseModel):
    title: str
    category: str
    image_url: str
    is_video: Optional[bool] = False
    video_url: Optional[str] = None
    three_sixty_url: Optional[str] = None

class GalleryCreate(GalleryBase):
    pass

class GalleryResponse(GalleryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Blog Schemas
class BlogBase(BaseModel):
    title: str
    slug: str
    summary: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    image_url: Optional[str] = None

class BlogCreate(BlogBase):
    pass

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    image_url: Optional[str] = None

class BlogResponse(BlogBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Testimonial Schemas
class TestimonialBase(BaseModel):
    client_name: str
    client_role: Optional[str] = None
    rating: Optional[int] = 5
    feedback: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    project_name: Optional[str] = None
    duration: Optional[str] = "2:30"

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(BaseModel):
    client_name: Optional[str] = None
    client_role: Optional[str] = None
    rating: Optional[int] = None
    feedback: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None
    project_name: Optional[str] = None
    duration: Optional[str] = None

class TestimonialResponse(TestimonialBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# FAQ Schemas
class FAQBase(BaseModel):
    question: str
    answer: str
    category: Optional[str] = "General"

class FAQCreate(FAQBase):
    pass

class FAQResponse(FAQBase):
    id: int

    class Config:
        from_attributes = True

# Contact Schemas
class ContactBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    message: Optional[str] = None
    is_read: Optional[bool] = None

class ContactResponse(ContactBase):
    id: int
    created_at: datetime
    is_read: bool

    class Config:
        from_attributes = True

# Quote Schemas
class QuoteBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    project_type: str
    budget_range: Optional[str] = None
    message: Optional[str] = None

class QuoteCreate(QuoteBase):
    pass

class QuoteUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    project_type: Optional[str] = None
    budget_range: Optional[str] = None
    message: Optional[str] = None
    is_read: Optional[bool] = None

class QuoteResponse(QuoteBase):
    id: int
    created_at: datetime
    is_read: bool

    class Config:
        from_attributes = True

# Newsletter Schemas
class NewsletterCreate(BaseModel):
    email: EmailStr

class NewsletterResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True

# Settings Schemas
class SettingBase(BaseModel):
    key: str
    value: Optional[str] = None

class SettingCreate(SettingBase):
    pass

class SettingResponse(SettingBase):
    id: int

    class Config:
        from_attributes = True

# Package Detail Schemas
class PackageDetailBase(BaseModel):
    division: str
    tier: str
    title: str
    subtitle: Optional[str] = None
    price_per_sqft: int = 1999
    description: Optional[str] = None
    features: Optional[List[str]] = None
    inclusions: Optional[List[str]] = None
    exclusions: Optional[List[str]] = None
    is_highlighted: Optional[bool] = False
    warranty_years: Optional[int] = 10
    delivery_months: Optional[int] = 12

class PackageDetailCreate(PackageDetailBase):
    pass

class PackageDetailUpdate(BaseModel):
    division: Optional[str] = None
    tier: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    price_per_sqft: Optional[int] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    inclusions: Optional[List[str]] = None
    exclusions: Optional[List[str]] = None
    is_highlighted: Optional[bool] = None
    warranty_years: Optional[int] = None
    delivery_months: Optional[int] = None

class PackageDetailResponse(PackageDetailBase):
    id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Partner / Collaborative Network Schemas
class PartnerBase(BaseModel):
    name: str
    division: str = "banking"  # "banking" or "joint_venture"
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    is_active: Optional[bool] = True

class PartnerCreate(PartnerBase):
    pass

class PartnerUpdate(BaseModel):
    name: Optional[str] = None
    division: Optional[str] = None
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    is_active: Optional[bool] = None

class PartnerResponse(PartnerBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Setting Schemas
class SettingBase(BaseModel):
    key: str
    value: Optional[str] = None

class SettingCreate(SettingBase):
    pass

class SettingUpdate(BaseModel):
    value: Optional[str] = None

class SettingResponse(SettingBase):
    id: int

    class Config:
        from_attributes = True


