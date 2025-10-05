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
- **Homepage**: `/`
- **Login**: `/login.html`
- **Sign Up**: `/signup.html`
- **Wishlist**: `/wishlist.html`

### Admin Pages
- **Admin Login**: `/admin/login.html`
- **Dashboard**: `/admin/dashboard.html`
- **Add Product**: `/admin/add.html`
- **Edit Product**: `/admin/edit.html?id={product-id}`

---

## 👤 Create Admin User

1. Sign up at `/signup.html`
2. Get user ID from Supabase Dashboard
3. Run in Supabase SQL Editor:
```sql
INSERT INTO admin_users (user_id) VALUES ('your-user-id');
```

---

## 🔑 Default Credentials

**Note**: No default credentials. You must:
1. Create a user account
2. Manually add to `admin_users` table

---

## 🎨 Key Features

✅ Browse fashion catalogue
✅ Search & filter products
✅ Wishlist (requires login)
✅ Admin panel (CRUD operations)
✅ PWA installable
✅ Mobile-first design

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
3. ✅ Create user account
4. ✅ Make user an admin
5. ✅ Add products via admin panel
6. ✅ Test wishlist functionality
7. ✅ Install as PWA on mobile

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
