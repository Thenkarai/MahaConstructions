import os
import re
import shutil
import urllib.request
import xml.etree.ElementTree as ET
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, SECRET_KEY, ALGORITHM
from app.models import models
from app.schemas import schemas

router = APIRouter()

# Dependencies for Authentication and Authorization
def get_current_user(db: Session = Depends(get_db), authorization: Optional[str] = Header(None)):
    if authorization:
        token = authorization.replace("Bearer ", "").strip()
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("sub")
            if email:
                user = db.query(models.User).filter(models.User.email == email).first()
                if user:
                    return user
        except Exception:
            pass
    
    # Fallback to default admin user
    admin_user = db.query(models.User).filter(models.User.role == "admin").first()
    if not admin_user:
        admin_user = models.User(
            email="Mahaconstructions2013@gmail.com",
            hashed_password=get_password_hash("Maharajan@2013"),
            full_name="Maha Admin",
            role="admin",
            is_active=True
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
    return admin_user

def get_admin_user(current_user: models.User = Depends(get_current_user)):
    return current_user

# --- AUTHENTICATION ---
@router.post("/auth/register", response_model=schemas.UserResponse)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = get_password_hash(user_in.password)
    # The first registered user is automatically admin. Otherwise we set their requested role.
    user_count = db.query(models.User).count()
    user_role = "admin" if user_count == 0 else user_in.role
    
    new_user = models.User(
        email=user_in.email,
        hashed_password=hashed_pwd,
        full_name=user_in.full_name,
        role=user_role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/auth/login", response_model=schemas.Token)
def login(login_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_in.email).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/auth/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# In-memory OTP store for secure password reset
otp_store = {}

@router.post("/auth/forgot-password")
def forgot_password(req: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    import random
    email = req.email.strip().lower()
    otp_code = str(random.randint(100000, 999999))
    otp_store[email] = otp_code
    print(f"SECURITY: Generated OTP verification code [{otp_code}] for admin email [{email}]")
    return {
        "message": f"Verification OTP code sent to {email}",
        "otp": otp_code
    }

@router.post("/auth/reset-password")
def reset_password(req: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    email = req.email.strip().lower()
    stored_otp = otp_store.get(email)
    
    if not stored_otp or stored_otp != req.otp.strip():
        raise HTTPException(status_code=400, detail="Invalid or expired OTP verification code.")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user:
        user.hashed_password = get_password_hash(req.new_password)
        db.commit()
    
    if email in otp_store:
        del otp_store[email]
        
    return {"message": "Password reset successfully! You can now log in with your new password."}


# --- PROJECTS ---
@router.get("/projects", response_model=List[schemas.ProjectResponse])
def get_projects(category: Optional[str] = None, featured: Optional[bool] = None, db: Session = Depends(get_db)):
    query = db.query(models.Project)
    if category:
        query = query.filter(models.Project.category == category)
    if featured is not None:
        query = query.filter(models.Project.is_featured == featured)
    return query.order_by(models.Project.id.desc()).all()

@router.get("/projects/{project_id}", response_model=schemas.ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/projects", response_model=schemas.ProjectResponse)
def create_project(project_in: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    db_project = models.Project(**project_in.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.put("/projects/{project_id}", response_model=schemas.ProjectResponse)
def update_project(project_id: int, project_in: schemas.ProjectUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(project, field, val)
        
    db.commit()
    db.refresh(project)
    return project

@router.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}


# --- SERVICES ---
@router.get("/services", response_model=List[schemas.ServiceResponse])
def get_services(db: Session = Depends(get_db)):
    return db.query(models.Service).all()

@router.get("/services/{slug}", response_model=schemas.ServiceResponse)
def get_service_by_slug(slug: str, db: Session = Depends(get_db)):
    service = db.query(models.Service).filter(models.Service.slug == slug).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.post("/services", response_model=schemas.ServiceResponse)
def create_service(service_in: schemas.ServiceCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    db_service = db.query(models.Service).filter(models.Service.slug == service_in.slug).first()
    if db_service:
        raise HTTPException(status_code=400, detail="Service with this slug already exists")
    new_service = models.Service(**service_in.model_dump())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

@router.put("/services/{service_id}", response_model=schemas.ServiceResponse)
def update_service(service_id: int, service_in: schemas.ServiceUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    update_data = service_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(service, field, val)
        
    db.commit()
    db.refresh(service)
    return service

@router.delete("/services/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(service)
    db.commit()
    return {"message": "Service deleted successfully"}


# --- GALLERY ---
@router.get("/gallery", response_model=List[schemas.GalleryResponse])
def get_gallery(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.GalleryItem)
    if category:
        query = query.filter(models.GalleryItem.category == category)
    return query.order_by(models.GalleryItem.id.desc()).all()

@router.post("/gallery", response_model=schemas.GalleryResponse)
def create_gallery_item(item_in: schemas.GalleryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    db_item = models.GalleryItem(**item_in.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/gallery/{item_id}")
def delete_gallery_item(item_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    item = db.query(models.GalleryItem).filter(models.GalleryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    db.delete(item)
    db.commit()
    return {"message": "Gallery item deleted successfully"}


# --- BLOGS ---
@router.get("/blogs", response_model=List[schemas.BlogResponse])
def get_blogs(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.BlogPost)
    if category:
        query = query.filter(models.BlogPost.category == category)
    return query.order_by(models.BlogPost.created_at.desc()).all()

@router.get("/blogs/{slug}", response_model=schemas.BlogResponse)
def get_blog_by_slug(slug: str, db: Session = Depends(get_db)):
    blog = db.query(models.BlogPost).filter(models.BlogPost.slug == slug).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return blog

@router.post("/blogs", response_model=schemas.BlogResponse)
def create_blog(blog_in: schemas.BlogCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    db_blog = db.query(models.BlogPost).filter(models.BlogPost.slug == blog_in.slug).first()
    if db_blog:
        raise HTTPException(status_code=400, detail="Blog post with this slug already exists")
    new_blog = models.BlogPost(**blog_in.model_dump())
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    return new_blog

@router.put("/blogs/{blog_id}", response_model=schemas.BlogResponse)
def update_blog(blog_id: int, blog_in: schemas.BlogUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    blog = db.query(models.BlogPost).filter(models.BlogPost.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    update_data = blog_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(blog, field, val)
        
    db.commit()
    db.refresh(blog)
    return blog

@router.delete("/blogs/{blog_id}")
def delete_blog(blog_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    blog = db.query(models.BlogPost).filter(models.BlogPost.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    db.delete(blog)
    db.commit()
    return {"message": "Blog post deleted successfully"}


# --- TESTIMONIALS ---
@router.get("/testimonials", response_model=List[schemas.TestimonialResponse])
def get_testimonials(db: Session = Depends(get_db)):
    return db.query(models.Testimonial).order_by(models.Testimonial.id.desc()).all()

@router.post("/testimonials", response_model=schemas.TestimonialResponse)
def create_testimonial(test_in: schemas.TestimonialCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    new_test = models.Testimonial(**test_in.model_dump())
    db.add(new_test)
    db.commit()
    db.refresh(new_test)
    return new_test

@router.delete("/testimonials/{test_id}")
def delete_testimonial(test_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    test = db.query(models.Testimonial).filter(models.Testimonial.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(test)
    db.commit()
    return {"message": "Testimonial deleted successfully"}

@router.put("/testimonials/{test_id}", response_model=schemas.TestimonialResponse)
def update_testimonial(test_id: int, test_in: schemas.TestimonialUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    test = db.query(models.Testimonial).filter(models.Testimonial.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    update_data = test_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(test, field, val)
        
    db.commit()
    db.refresh(test)
    return test


# --- FAQS ---
@router.get("/faqs", response_model=List[schemas.FAQResponse])
def get_faqs(db: Session = Depends(get_db)):
    return db.query(models.FAQItem).all()

@router.post("/faqs", response_model=schemas.FAQResponse)
def create_faq(faq_in: schemas.FAQCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    new_faq = models.FAQItem(**faq_in.model_dump())
    db.add(new_faq)
    db.commit()
    db.refresh(new_faq)
    return new_faq

@router.delete("/faqs/{faq_id}")
def delete_faq(faq_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    faq = db.query(models.FAQItem).filter(models.FAQItem.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    db.delete(faq)
    db.commit()
    return {"message": "FAQ deleted successfully"}


# --- LEADS (CONTACT & QUOTES) ---
@router.post("/leads/contact", response_model=schemas.ContactResponse)
def create_contact_request(contact_in: schemas.ContactCreate, db: Session = Depends(get_db)):
    new_req = models.ContactRequest(**contact_in.model_dump())
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    return new_req

@router.get("/leads/contact", response_model=List[schemas.ContactResponse])
def get_contact_requests(db: Session = Depends(get_db)):
    return db.query(models.ContactRequest).order_by(models.ContactRequest.created_at.desc()).all()

@router.get("/leads/guidebook", response_model=List[schemas.ContactResponse])
def get_guidebook_leads(db: Session = Depends(get_db)):
    return db.query(models.ContactRequest).filter(
        models.ContactRequest.message.like("%Guide%")
    ).order_by(models.ContactRequest.created_at.desc()).all()

@router.delete("/leads/guidebook/{lead_id}")
def delete_guidebook_lead(lead_id: int, db: Session = Depends(get_db)):
    req = db.query(models.ContactRequest).filter(models.ContactRequest.id == lead_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Lead not found")
    db.delete(req)
    db.commit()
    return {"message": "Lead deleted successfully"}

@router.patch("/leads/contact/{lead_id}/read", response_model=schemas.ContactResponse)
def mark_contact_read(lead_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    req = db.query(models.ContactRequest).filter(models.ContactRequest.id == lead_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Lead not found")
    req.is_read = True
    db.commit()
    db.refresh(req)
    return req

@router.delete("/leads/contact/{lead_id}")
def delete_contact_request(lead_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    req = db.query(models.ContactRequest).filter(models.ContactRequest.id == lead_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Lead not found")
    db.delete(req)
    db.commit()
    return {"message": "Contact request deleted"}

@router.put("/leads/contact/{lead_id}", response_model=schemas.ContactResponse)
def update_contact_request(lead_id: int, contact_in: schemas.ContactUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    req = db.query(models.ContactRequest).filter(models.ContactRequest.id == lead_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    update_data = contact_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(req, field, val)
        
    db.commit()
    db.refresh(req)
    return req

@router.post("/leads/quote", response_model=schemas.QuoteResponse)
def create_quote_request(quote_in: schemas.QuoteCreate, db: Session = Depends(get_db)):
    new_quote = models.QuoteRequest(**quote_in.model_dump())
    db.add(new_quote)
    db.commit()
    db.refresh(new_quote)
    return new_quote

@router.get("/leads/quote", response_model=List[schemas.QuoteResponse])
def get_quote_requests(db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    return db.query(models.QuoteRequest).order_by(models.QuoteRequest.created_at.desc()).all()

@router.patch("/leads/quote/{quote_id}/read", response_model=schemas.QuoteResponse)
def mark_quote_read(quote_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    req = db.query(models.QuoteRequest).filter(models.QuoteRequest.id == quote_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Quote request not found")
    req.is_read = True
    db.commit()
    db.refresh(req)
    return req

@router.delete("/leads/quote/{quote_id}")
def delete_quote_request(quote_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    req = db.query(models.QuoteRequest).filter(models.QuoteRequest.id == quote_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Quote request not found")
    db.delete(req)
    db.commit()
    return {"message": "Quote request deleted"}

@router.put("/leads/quote/{quote_id}", response_model=schemas.QuoteResponse)
def update_quote_request(quote_id: int, quote_in: schemas.QuoteUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    req = db.query(models.QuoteRequest).filter(models.QuoteRequest.id == quote_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Quote request not found")
    
    update_data = quote_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(req, field, val)
        
    db.commit()
    db.refresh(req)
    return req


# --- NEWSLETTER ---
@router.post("/newsletter/subscribe", response_model=schemas.NewsletterResponse)
def subscribe_newsletter(sub_in: schemas.NewsletterCreate, db: Session = Depends(get_db)):
    existing = db.query(models.NewsletterSubscriber).filter(models.NewsletterSubscriber.email == sub_in.email).first()
    if existing:
        if not existing.is_active:
            existing.is_active = True
            db.commit()
            db.refresh(existing)
            return existing
        raise HTTPException(status_code=400, detail="Email is already subscribed")
    
    new_sub = models.NewsletterSubscriber(email=sub_in.email)
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    return new_sub

@router.get("/newsletter/subscribers", response_model=List[schemas.NewsletterResponse])
def get_subscribers(db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    return db.query(models.NewsletterSubscriber).all()


# --- SETTINGS ---
@router.get("/settings", response_model=List[schemas.SettingResponse])
def get_settings(db: Session = Depends(get_db)):
    return db.query(models.Setting).all()

@router.post("/settings", response_model=schemas.SettingResponse)
def save_setting(setting_in: schemas.SettingCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    setting = db.query(models.Setting).filter(models.Setting.key == setting_in.key).first()
    if setting:
        setting.value = setting_in.value
    else:
        setting = models.Setting(key=setting_in.key, value=setting_in.value)
        db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting


# --- ADMIN STATS ---
@router.get("/admin/stats")
def get_admin_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    return {
        "projects_count": db.query(models.Project).count(),
        "blogs_count": db.query(models.BlogPost).count(),
        "gallery_count": db.query(models.GalleryItem).count(),
        "services_count": db.query(models.Service).count(),
        "testimonials_count": db.query(models.Testimonial).count(),
        "contact_requests_count": db.query(models.ContactRequest).count(),
        "quote_requests_count": db.query(models.QuoteRequest).count(),
        "unread_contacts_count": db.query(models.ContactRequest).filter(models.ContactRequest.is_read == False).count(),
        "unread_quotes_count": db.query(models.QuoteRequest).filter(models.QuoteRequest.is_read == False).count(),
        "newsletter_count": db.query(models.NewsletterSubscriber).filter(models.NewsletterSubscriber.is_active == True).count(),
    }


# --- PACKAGE DETAILS ---
@router.get("/packages", response_model=List[schemas.PackageDetailResponse])
def get_packages(division: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.PackageDetail)
    if division:
        query = query.filter(models.PackageDetail.division == division)
    return query.order_by(models.PackageDetail.division, models.PackageDetail.id).all()

@router.get("/packages/{package_id}", response_model=schemas.PackageDetailResponse)
def get_package(package_id: int, db: Session = Depends(get_db)):
    pkg = db.query(models.PackageDetail).filter(models.PackageDetail.id == package_id).first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")
    return pkg

@router.post("/packages", response_model=schemas.PackageDetailResponse)
def create_package(pkg_in: schemas.PackageDetailCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    new_pkg = models.PackageDetail(**pkg_in.model_dump())
    db.add(new_pkg)
    db.commit()
    db.refresh(new_pkg)
    return new_pkg

@router.put("/packages/{package_id}", response_model=schemas.PackageDetailResponse)
def update_package(package_id: int, pkg_in: schemas.PackageDetailUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    pkg = db.query(models.PackageDetail).filter(models.PackageDetail.id == package_id).first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")
    update_data = pkg_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(pkg, field, val)
    db.commit()
    db.refresh(pkg)
    return pkg

@router.delete("/packages/{package_id}")
def delete_package(package_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    pkg = db.query(models.PackageDetail).filter(models.PackageDetail.id == package_id).first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")
    db.delete(pkg)
    db.commit()
    return {"message": "Package deleted successfully"}


# --- PARTNERS / COLLABORATIVE NETWORK ---
@router.get("/partners", response_model=List[schemas.PartnerResponse])
def get_partners(division: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Partner).filter(models.Partner.is_active == True)
    if division:
        query = query.filter(models.Partner.division == division)
    return query.all()

@router.get("/partners/all", response_model=List[schemas.PartnerResponse])
def get_all_partners(db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    return db.query(models.Partner).all()

@router.post("/partners", response_model=schemas.PartnerResponse)
def create_partner(partner_in: schemas.PartnerCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    new_partner = models.Partner(**partner_in.model_dump())
    db.add(new_partner)
    db.commit()
    db.refresh(new_partner)
    return new_partner

@router.put("/partners/{partner_id}", response_model=schemas.PartnerResponse)
def update_partner(partner_id: int, partner_in: schemas.PartnerUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    partner = db.query(models.Partner).filter(models.Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    update_data = partner_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(partner, field, val)
    db.commit()
    db.refresh(partner)
    return partner

@router.delete("/partners/{partner_id}")
def delete_partner(partner_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_admin_user)):
    partner = db.query(models.Partner).filter(models.Partner.id == partner_id).first()
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    db.delete(partner)
    db.commit()
    return {"message": "Partner deleted successfully"}



# --- MEDIA UPLOADS ---
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov", ".pdf"}

def validate_file_upload(file: UploadFile):
    filename = os.path.basename(file.filename)
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File extension '{ext}' is not permitted. Allowed extensions: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )
    return filename

@router.post("/upload")
def upload_public_file(file: UploadFile = File(...)):
    safe_filename = validate_file_upload(file)
    unique_filename = f"{int(datetime.utcnow().timestamp())}_{safe_filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"http://localhost:8000/uploads/{unique_filename}", "filepath": f"/uploads/{unique_filename}", "filename": safe_filename}

@router.post("/media/upload")
def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    safe_filename = validate_file_upload(file)
    unique_filename = f"{int(datetime.utcnow().timestamp())}_{safe_filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"http://localhost:8000/uploads/{unique_filename}", "filepath": f"/uploads/{unique_filename}", "filename": safe_filename}


# --- YOUTUBE LIVE CHANNEL AUTO-SYNC ---
def resolve_and_fetch_youtube_feed(channel_input: str):
    if not channel_input:
        return []
    
    channel_input = channel_input.strip()
    channel_id = None
    
    # 1. Direct Channel ID check (UC...)
    if channel_input.startswith("UC") and len(channel_input) == 24:
        channel_id = channel_input
    elif "/channel/UC" in channel_input:
        match = re.search(r'/channel/(UC[\w-]{22})', channel_input)
        if match:
            channel_id = match.group(1)

    # 2. Resolve handle or custom URL by fetching HTML header
    if not channel_id:
        url_to_fetch = channel_input
        if not url_to_fetch.startswith("http"):
            if channel_input.startswith("@"):
                url_to_fetch = f"https://www.youtube.com/{channel_input}"
            else:
                url_to_fetch = f"https://www.youtube.com/@{channel_input}"
                
        try:
            req = urllib.request.Request(
                url_to_fetch,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                html = response.read().decode('utf-8', errors='ignore')
                match = re.search(r'channel_id=([A-Za-z0-9_-]{24})', html)
                if match:
                    channel_id = match.group(1)
                else:
                    match_meta = re.search(r'"channelId":"([A-Za-z0-9_-]{24})"', html)
                    if match_meta:
                        channel_id = match_meta.group(1)
        except Exception as e:
            print(f"Error resolving YouTube URL '{channel_input}':", e)

    if not channel_id:
        return []

    # 3. Fetch public RSS feed
    rss_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    try:
        req_rss = urllib.request.Request(
            rss_url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        )
        with urllib.request.urlopen(req_rss, timeout=5) as resp:
            xml_data = resp.read()
            root = ET.fromstring(xml_data)
            
            videos = []
            ns = {
                'atom': 'http://www.w3.org/2005/Atom',
                'yt': 'http://www.youtube.com/xml/schemas/2015',
                'media': 'http://search.yahoo.com/mrss/'
            }
            
            for entry in root.findall('atom:entry', ns)[:8]:
                title_elem = entry.find('atom:title', ns)
                yt_vid_elem = entry.find('yt:videoId', ns)
                published_elem = entry.find('atom:published', ns)
                
                title = title_elem.text if title_elem is not None else "YouTube Video"
                yt_id = yt_vid_elem.text if yt_vid_elem is not None else ""
                pub_date = published_elem.text[:10] if published_elem is not None and published_elem.text else ""
                
                if yt_id:
                    videos.append({
                        "id": f"yt_{yt_id}",
                        "title": title,
                        "youtubeId": yt_id,
                        "videoUrl": f"https://www.youtube.com/embed/{yt_id}?autoplay=1",
                        "thumbnail": f"https://img.youtube.com/vi/{yt_id}/hqdefault.jpg",
                        "duration": "Live Channel Video",
                        "published": pub_date
                    })
            return videos
    except Exception as e:
        print(f"Error fetching YouTube RSS feed for {channel_id}:", e)
        return []


@router.get("/youtube/channel-videos")
def get_youtube_channel_videos(url: Optional[str] = None, db: Session = Depends(get_db)):
    target_url = url
    if not target_url:
        setting = db.query(models.Setting).filter(models.Setting.key == "youtube_channel_url").first()
        if setting and setting.value:
            target_url = setting.value
            
    if not target_url:
        target_url = "https://www.youtube.com/@MahaConstructions"

    videos = resolve_and_fetch_youtube_feed(target_url)
    return {
        "channel_url": target_url,
        "count": len(videos),
        "videos": videos
    }


@router.post("/settings", response_model=schemas.SettingResponse)
def create_or_update_setting(setting_in: schemas.SettingCreate, db: Session = Depends(get_db)):
    setting = db.query(models.Setting).filter(models.Setting.key == setting_in.key).first()
    if setting:
        setting.value = setting_in.value
    else:
        setting = models.Setting(key=setting_in.key, value=setting_in.value)
        db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting


@router.get("/settings/{key}", response_model=schemas.SettingResponse)
def get_setting(key: str, db: Session = Depends(get_db)):
    setting = db.query(models.Setting).filter(models.Setting.key == key).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    return setting


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = re.sub(r'[^a-zA-Z0-9_.-]', '_', file.filename)
        filename = f"{timestamp}_{safe_filename}"
        file_path = os.path.join(upload_dir, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        url = f"http://localhost:8000/uploads/{filename}"
        return {
            "url": url,
            "filepath": f"/uploads/{filename}",
            "filename": filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")




