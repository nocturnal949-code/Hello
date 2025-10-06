# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install
```bash
npm install
```

### 2. Run
```bash
npm run dev
```

### 3. Open
Visit `http://localhost:5173`

---

## 📍 Important URLs

### Customer Pages
- **Splash Screen**: `/splash.html` (auto-redirects after 2s)
- **Homepage**: `/`
- **Login**: `/login.html` (with role selection)
- **Sign Up**: `/signup.html` (with role selection)
- **Wishlist**: `/wishlist.html`
- **Seed Data**: `/seed-database.html`

### Admin Pages
- **Admin Login**: `/admin/login.html`
- **Dashboard**: `/admin/dashboard.html`
- **Add Product**: `/admin/add.html`
- **Edit Product**: `/admin/edit.html?id={product-id}`

---

## 👤 Create Users

### Regular User
1. Go to `/signup.html`
2. Fill in email and password
3. Select **"User"** as role
4. Create account
5. You'll be redirected to homepage

### Admin User
1. Go to `/signup.html`
2. Fill in email and password
3. Select **"Admin"** as role
4. Create account
5. You'll be redirected to admin dashboard

**Note**: Role is stored in user metadata, no manual database insertion needed!

---

## 🔑 Default Credentials

**Note**: No default credentials. You must:
1. Create a user account
2. Manually add to `admin_users` table

---

## 🎨 Key Features

✅ Fullscreen splash screen with fade animation
✅ Hero carousel with auto-rotation
✅ Infinite horizontal scrolls for categories & fabrics
✅ 8 categories + 7 fabric types
✅ Flipkart-style product cards
✅ Discount badges & stock indicators
✅ Swipeable image carousel in PDP
✅ Size selection & color swatches
✅ Wishlist with Supabase persistence
✅ Role-based authentication (User/Admin)
✅ Product sharing via Web Share API
✅ PWA installable
✅ Mobile-first responsive design (420px+)

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Tailwind CSS (CDN)
- **Database**: Supabase
- **Auth**: Supabase Auth
- **PWA**: Service Worker + Manifest

---

## 📦 Build for Production

```bash
npm run build
```

Output in `dist/` folder

---

## 🐛 Common Issues

### Can't login?
- Check Supabase credentials in `.env`
- Verify auth is enabled in Supabase

### Can't access admin panel?
- Ensure user is in `admin_users` table
- Log out and log back in

### PWA not installing?
- Must use HTTPS or localhost
- Check service worker registration
- Verify manifest.json is accessible

---

## 📚 Documentation

- **README.md** - Full documentation
- **SETUP.md** - Detailed setup guide
- **FEATURES.md** - Complete feature list

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Run development server
3. ✅ Visit `/seed-database.html` to load sample products
4. ✅ Create user account (select role: User or Admin)
5. ✅ Browse products, filter by category/fabric
6. ✅ Add items to wishlist
7. ✅ Test product detail modal with image carousel
8. ✅ Share products using share button
9. ✅ (Admin) Add/edit/delete products
10. ✅ Install as PWA on mobile

---

## 💡 Tips

- Use Pexels for product images
- Test on mobile device for best experience
- Enable RLS in Supabase for security
- Check browser console for errors

---

## 🌐 Environment

Supabase configuration is in `.env`:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Already configured and ready to use!

---

## 🎉 You're Ready!

The app is fully functional and ready to use.

Start the dev server and begin exploring! 🚀
