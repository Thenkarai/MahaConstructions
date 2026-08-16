import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "maha_construction.db")

def migrate():
    if not os.path.exists(db_path):
        print("Database file does not exist yet.")
        return

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # 1. Migrate testimonials table
    cur.execute("PRAGMA table_info(testimonials);")
    columns = [row[1] for row in cur.fetchall()]
    print("Existing testimonials columns:", columns)

    if "duration" not in columns:
        print("Adding duration column to testimonials table...")
        cur.execute("ALTER TABLE testimonials ADD COLUMN duration VARCHAR DEFAULT '2:30';")

    # 2. Check uploaded real videos in backend/uploads and update testimonials with real uploaded videos if video_url is broken or Mixkit
    cur.execute("SELECT id, client_name, video_url FROM testimonials;")
    rows = cur.fetchall()
    print("Current testimonials in DB:", rows)

    # If testimonials is empty or contains broken URLs, update them with real uploaded video paths
    uploaded_videos = [
        "http://localhost:8000/uploads/1785710590_WhatsApp%20Video%202026-07-29%20at%2011.16.33%20PM.mp4",
        "http://localhost:8000/uploads/1785710633_Maha%20Construction.mp4",
        "http://localhost:8000/uploads/1785710665_Pudhugramam%20site%20video.mp4",
        "http://localhost:8000/uploads/1785711422_WhatsApp%20Video%202026-07-30%20at%2010.50.53%20AM.mp4"
    ]

    if not rows:
        print("Seeding real video testimonials into DB...")
        sample_testimonials = [
            ("Mr. Suresh Kumar & Family", "Homeowner, Nagercoil", 5, "Maha Construction completed our luxury villa on time with unbelievable quality and structural strength.", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", uploaded_videos[1], "Royal Palm Luxury Villa (Nagercoil)", "3:45"),
            ("Er. Rajesh K. & Family", "Client, Marthandam", 5, "Outstanding construction standards, transparent cost estimates, and excellent project management throughout.", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", uploaded_videos[2], "Emerald Heights Residence (Marthandam)", "4:20"),
            ("Mr. Pudhugramam Owner", "Homeowner, Kanyakumari", 5, "Watch our real site walkthrough and hear how Maha Construction handled our complete project from design to key handover.", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", uploaded_videos[0], "Pudhugramam Site Villa", "2:50"),
            ("Er. Alexander Vance", "Industrial Client", 5, "Top-tier structural engineering and architectural execution. Highly recommend Maha Construction for premium projects.", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", uploaded_videos[3], "Vance Commercial Horizon", "1:30")
        ]
        cur.executemany("""
            INSERT INTO testimonials (client_name, client_role, rating, feedback, image_url, video_url, project_name, duration)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        """, sample_testimonials)
    else:
        # Update existing testimonials that have mixkit or null video_url to use real uploaded videos
        for i, row in enumerate(rows):
            t_id, t_name, t_url = row
            if not t_url or "mixkit" in (t_url or ""):
                new_url = uploaded_videos[i % len(uploaded_videos)]
                cur.execute("UPDATE testimonials SET video_url = ? WHERE id = ?;", (new_url, t_id))
                print(f"Updated testimonial {t_id} video_url to {new_url}")

    conn.commit()
    conn.close()
    print("Migration completed successfully.")

if __name__ == "__main__":
    migrate()
