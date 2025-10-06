# Priya's Collection - Fashion Catalogue PWA

An enterprise-grade, mobile-first Progressive Web App for browsing beautiful Indian women's fashion. This is a Flipkart-style browse-only catalogue featuring sarees, lehengas, kurtis, and more.

## Features

### Customer Features
- Fullscreen splash screen with smooth fade-out transition
- Hero carousel with auto-rotation
- Infinite horizontal scrolling for categories and fabrics
- Browse products by 8 categories and 7 fabric types
- Advanced search functionality
- Flipkart-style product cards with:
  - Discount badges
  - Stock indicators
  - Wishlist toggle
  - Hover animations
- Product Detail Modal with:
  - Swipeable image carousel
  - Size selection
  - Color swatches
  - Fabric tags
  - Expand/collapse description
  - Share functionality
- Wishlist system with Supabase persistence
- Role-based authentication (User/Admin)
- Responsive design (mobile-first, 420px+)
- PWA installable on mobile devices

### Admin Features
- Secure role-based admin login
- Product CRUD operations
- Dashboard with product management
- Add/Edit product forms with validation

## Tech Stack

- **Frontend**: Pure HTML, CSS, JavaScript
- **Styling**: Tailwind CSS (CDN)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **PWA**: Service Worker + Manifest

## Project Structure

```
/
├── index.html              # Homepage
├── login.html              # Customer login
├── signup.html             # Customer signup
├── wishlist.html           # User wishlist
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker for PWA
├── /admin/
│   ├── login.html          # Admin login
│   ├── dashboard.html      # Admin dashboard
│   ├── add.html            # Add product
│   └── edit.html           # Edit product
├── /js/
│   ├── supabase.js         # Supabase client & API functions
│   ├── auth.js             # Authentication helpers
│   ├── utils.js            # Utility functions
│   ├── home.js             # Homepage logic
│   ├── login.js            # Login page logic
│   ├── signup.js           # Signup page logic
│   ├── wishlist.js         # Wishlist page logic
│   ├── admin-*.js          # Admin panel logic
│   └── sw-register.js      # Service worker registration
├── /css/
│   └── styles.css          # Custom styles
└── /assets/
    └── /icons/             # PWA icons
```

## Database Schema

### Tables

1. **products**
   - Product information (name, category, fabric, price, images, etc.)
   - Flags for new arrivals, festive, and trending items

2. **wishlists**
   - User wishlist items
   - Links users to products

3. **admin_users**
   - Admin user IDs for access control

### Security

- Row Level Security (RLS) enabled on all tables
- Public read access for products
- Admin-only write access for products
- Users can only access their own wishlists

## Setup Instructions

### Prerequisites

- Node.js installed
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. The Supabase configuration is already set in `.env`

4. Run development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

### Creating Admin Users

Admin users need to be added manually to the database. After a user signs up:

```sql
INSERT INTO admin_users (user_id)
VALUES ('user-uuid-here');
```

## Design System

### Colors
- Primary (Rani Pink): `#C2185B`
- Accent (Orange): `#FF7043`
- Background: `#FFF8F1`
- Text: `#212121`

### Typography
- Headings: Playfair Display
- Body: Inter

### Features
- Mobile-first responsive design
- Smooth animations and transitions
- Card-based layouts
- Sticky header with search
- Horizontal scrolling sections
- Modal-based product details

## PWA Features

- Installable on mobile devices
- Custom app icons
- Standalone display mode
- Offline-ready service worker registration
- Add to Home Screen support

## Pages Overview

### Homepage (/)
- Hero carousel with auto-rotation
- New Arrivals section
- Category cards
- Fabric filters
- Trending products
- All products grid
- Product detail modal

### Authentication
- `/splash.html` - Fullscreen splash screen (shows once on load)
- `/login.html` - Login with role selection (User/Admin)
- `/signup.html` - Registration with role selection
- Email/password authentication
- Role-based redirection after login

### Wishlist (/wishlist.html)
- View saved products
- Remove items from wishlist
- Empty state with CTA
- Requires authentication

### Admin Panel
- `/admin/login.html` - Admin authentication
- `/admin/dashboard.html` - Product management
- `/admin/add.html` - Add new products
- `/admin/edit.html` - Edit existing products

## API Functions

Located in `js/supabase.js`:

- `getProducts(filters)` - Fetch products with optional filters
- `getProductById(id)` - Get single product
- `getWishlist()` - Get user's wishlist
- `addToWishlist(productId)` - Add to wishlist
- `removeFromWishlist(productId)` - Remove from wishlist
- `signUp(email, password, role)` - Create account with role
- `signIn(email, password)` - Login
- `signOut()` - Logout
- `getCurrentUser()` - Get current user
- `getUserRole()` - Get user's role (user/admin)
- `createProduct(product)` - Add product (admin)
- `updateProduct(id, product)` - Update product (admin)
- `deleteProduct(id)` - Delete product (admin)

## Browser Support

- Modern browsers with ES6+ support
- Service Worker support for PWA features
- Web Share API for sharing (graceful fallback)

## Categories & Fabrics

### Categories
- Kurti
- Kurta Sets
- Sarees
- Draping Saree
- Ready-to-Wear Saree
- Palazzo
- Lehengas
- Indo Western Dresses

### Fabrics
- Cotton
- Silk
- Chiffon
- Georgette
- Linen
- Viscose
- Satin

## Seeding Sample Data

Visit `/seed-database.html` to populate the database with 12 sample products across all categories and fabrics. The seed data includes:
- Product images from Pexels
- Realistic pricing with discounts
- Multiple sizes and colors
- Stock indicators
- Ratings

## Notes

- This is a browse-only catalogue (no checkout/payment)
- Sample product data available via seed-database.html
- Images use stock photos from Pexels
- Service worker provides installability only (no offline caching)
- All database operations use Supabase
- Role-based authentication with user metadata storage

## Future Enhancements

- Push notifications
- Advanced filtering
- Product recommendations
- Social sharing improvements
- Image optimization
- Better offline support
