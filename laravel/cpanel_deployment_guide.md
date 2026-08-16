# cPanel & Shared PHP Hosting Guide (Maha Construction)

This guide explains how to deploy the **Maha Construction** PHP Laravel application to any standard cPanel or shared PHP hosting provider (e.g. Hostinger, Bluehost, Namecheap, GoDaddy, cPanel MySQL).

---

## Folder Structure Overview

Your project is structured in the [laravel](file:///c:/Users/Vichu/Music/Maha%20Construction/laravel) folder:
- **`laravel/public/`**: Contains `index.php`, `.htaccess`, compiled CSS/JS assets, logo, favicons, and uploaded site videos (`uploads/`).
- **`laravel/app/`**, **`laravel/routes/`**, **`laravel/database/`**: PHP backend application logic & models.

---

## Easy 3-Step cPanel Upload Instructions

### Step 1: Upload Files to cPanel
1. Compress (ZIP) the contents of the `laravel` directory.
2. Log into your cPanel or Hostinger File Manager.
3. Upload the ZIP file into your domain's root folder (`public_html`).
4. Extract the contents inside `public_html`.

### Step 2: Configure Database (`.env`)
1. Create a MySQL Database & User in cPanel -> **MySQL Database Wizard**.
2. Edit the `.env` file in `public_html`:
   ```env
   APP_NAME="Maha Construction"
   APP_ENV=production
   APP_URL=https://yourdomain.com

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=yourcpanel_db_name
   DB_USERNAME=yourcpanel_db_user
   DB_PASSWORD=yourcpanel_db_password
   ```

### Step 3: Run Database Migrations (Optional or Import SQL)
- You can import your initial SQLite/MySQL database via phpMyAdmin or run:
  ```bash
  php artisan migrate --force
  ```

---

## File Uploads & Media Storage
- Uploaded client video reviews and images are stored in `public/uploads/`.
- Make sure permissions for the `public/uploads` directory are set to **755** or **777** in cPanel File Manager.
