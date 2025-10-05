# Sample Product Data Structure

This document shows the structure of products for Priya's Collection. Once the database is configured, you can use this structure to add products through the admin panel.

## Product Schema

```json
{
  "name": "Product Name",
  "category": "Category Name",
  "fabric": "Fabric Name",
  "price": 2999,
  "discounted_price": 2499,
  "discount_percentage": 20,
  "description": "Detailed product description",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Red", "Pink", "Blue"],
  "rating": 4.5,
  "in_stock": true,
  "is_new_arrival": false,
  "is_festive": false,
  "is_trending": false
}
```

## Categories
- Kurti
- Kurta Set
- Saree
- Draping Saree
- Ready Saree
- Lehenga
- Palazzo
- Indo Western

## Fabrics
- Cotton
- Silk
- Chiffon
- Georgette
- Linen
- Viscose
- Satin

## Sample Products

### Example 1: Cotton Kurti
```json
{
  "name": "Floral Print Cotton Kurti",
  "category": "Kurti",
  "fabric": "Cotton",
  "price": 1499,
  "discounted_price": 1199,
  "discount_percentage": 20,
  "description": "Beautiful floral print cotton kurti perfect for daily wear. Comfortable and breathable fabric.",
  "images": ["https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg"],
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Pink", "White", "Yellow"],
  "rating": 4.5,
  "in_stock": true,
  "is_new_arrival": true
}
```

### Example 2: Silk Saree
```json
{
  "name": "Traditional Silk Saree with Golden Border",
  "category": "Saree",
  "fabric": "Silk",
  "price": 5999,
  "discounted_price": 4799,
  "discount_percentage": 20,
  "description": "Elegant silk saree with beautiful golden zari border. Perfect for weddings and festive occasions.",
  "images": ["https://images.pexels.com/photos/1549180/pexels-photo-1549180.jpeg"],
  "sizes": ["Free Size"],
  "colors": ["Red", "Maroon", "Green"],
  "rating": 4.8,
  "in_stock": true,
  "is_festive": true,
  "is_trending": true
}
```

### Example 3: Georgette Lehenga
```json
{
  "name": "Designer Georgette Lehenga Set",
  "category": "Lehenga",
  "fabric": "Georgette",
  "price": 8999,
  "discounted_price": 6999,
  "discount_percentage": 22,
  "description": "Stunning georgette lehenga with intricate embroidery work. Comes with matching choli and dupatta.",
  "images": ["https://images.pexels.com/photos/1859227/pexels-photo-1859227.jpeg"],
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Rani Pink", "Royal Blue", "Emerald"],
  "rating": 4.7,
  "in_stock": true,
  "is_festive": true
}
```

## Database Setup Instructions

Once you want to add persistence:
1. Database tables will need to be created with proper schema
2. RLS policies will be set up for security
3. Sample data can be seeded through the admin panel
4. The admin panel at `/admin/dashboard.html` allows adding new products

## Image Sources

For demonstration purposes, you can use:
- Pexels (https://www.pexels.com/) - Free stock photos
- Unsplash (https://unsplash.com/) - Free high-quality images
- Or upload your own product images

Always use actual product URLs in the images array, not placeholder paths.
