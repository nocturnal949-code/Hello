# Setup Guide for Priya's Collection

## Quick Start

The application is already configured with Supabase. Follow these steps to get started:

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

The database schema will be automatically created when you first access the application. However, if you need to manually set up the database, the migration has already been prepared.

**Note**: There was an issue applying the database migration automatically. You can add persistence later by setting up the tables manually using the Supabase dashboard.

### 3. Sample Data

Sample products are included in the database migration. If you need to add more products, you can:

1. Log in to the admin panel at `/admin/login.html`
2. Use the "Add New Product" button

### 4. Creating Admin Users

To create an admin user:

1. First, create a regular user account at `/signup.html`
2. Get the user's UUID from Supabase dashboard (Authentication > Users)
3. Run this SQL in Supabase SQL Editor:

```sql
INSERT INTO admin_users (user_id)
VALUES ('your-user-uuid-here');
```

Alternatively, use the Supabase dashboard to insert a row in the `admin_users` table.

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Environment Variables

The `.env` file is already configured with Supabase credentials:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Testing the PWA

### On Desktop
1. Open the app in Chrome/Edge
2. Look for the install icon in the address bar
3. Click to install as a PWA

### On Mobile
1. Open the app in mobile browser (Chrome/Safari)
2. Tap the menu button
3. Select "Add to Home Screen"
4. The app will open in standalone mode

## Product Image URLs

When adding products, use image URLs from free stock photo services:

- Pexels: https://www.pexels.com
- Unsplash: https://unsplash.com

Example image URL format:
```
https://images.pexels.com/photos/[photo-id]/pexels-photo-[photo-id].jpeg
```

## Admin Panel Access

1. Navigate to `/admin/login.html`
2. Login with an admin account
3. You'll be redirected to the dashboard

**Default admin credentials**: You need to create an admin user first (see step 4 above)

## Troubleshooting

### Database Connection Issues

If you see database errors:
1. Check the `.env` file has correct Supabase credentials
2. Verify your Supabase project is active
3. Check the browser console for detailed error messages

### Authentication Issues

If login/signup doesn't work:
1. Verify Supabase Auth is enabled in your project
2. Check email confirmation is disabled (or handle confirmation emails)
3. Look for errors in browser console

### PWA Installation Issues

If the app doesn't install:
1. Ensure you're using HTTPS (or localhost)
2. Check service worker is registered (DevTools > Application)
3. Verify manifest.json is accessible
4. Check all icon files exist in `/assets/icons/`

### Admin Access Denied

If you can't access admin panel:
1. Verify the user exists in `admin_users` table
2. Check you're logged in with the correct account
3. Try logging out and logging back in

## Database Schema

### Products Table
```sql
- id (uuid)
- name (text)
- category (text)
- fabric (text)
- price (numeric)
- discount_percentage (integer)
- discounted_price (numeric, computed)
- description (text)
- images (jsonb array)
- colors (jsonb array)
- sizes (jsonb array)
- rating (numeric)
- is_new_arrival (boolean)
- is_festive (boolean)
- is_trending (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### Wishlists Table
```sql
- id (uuid)
- user_id (uuid, FK to auth.users)
- product_id (uuid, FK to products)
- created_at (timestamptz)
```

### Admin Users Table
```sql
- id (uuid)
- user_id (uuid, FK to auth.users)
- created_at (timestamptz)
```

## Security Notes

1. **Row Level Security (RLS)** is enabled on all tables
2. Products are publicly readable but only admins can modify
3. Users can only access their own wishlist items
4. Admin access is verified on both client and server side
5. All sensitive operations require authentication

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Supabase dashboard for database issues
3. Review the README.md for feature documentation
