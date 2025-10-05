import { getWishlist, removeFromWishlist, signOut } from './supabase.js';
import { formatPrice, renderStars, showToast } from './utils.js';
import { requireAuth } from './auth.js';

requireAuth();

const wishlistContainer = document.getElementById('wishlistContainer');
const emptyState = document.getElementById('emptyState');

loadWishlist();

async function loadWishlist() {
  const { data, error } = await getWishlist();

  if (error) {
    console.error('Error loading wishlist:', error);
    showToast('Error loading wishlist');
    return;
  }

  if (!data || data.length === 0) {
    wishlistContainer.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  wishlistContainer.style.display = 'grid';
  emptyState.style.display = 'none';

  wishlistContainer.innerHTML = '';
  data.forEach(item => {
    if (item.product) {
      renderWishlistItem(item.product);
    }
  });
}

function renderWishlistItem(product) {
  const discountedPrice = product.discounted_price || product.price;
  const hasDiscount = product.discount_percentage > 0;

  const card = document.createElement('div');
  card.className = 'card product-card fade-in-on-scroll';
  card.innerHTML = `
    <div class="relative">
      <img src="${product.images[0] || '/assets/placeholder.jpg'}" alt="${product.name}">
      <button class="wishlist-btn active" data-product-id="${product.id}" onclick="event.stopPropagation();">
        <svg fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>
    <div class="p-4">
      <p class="text-xs text-gray-500 uppercase mb-1">${product.category}</p>
      <h3 class="font-semibold text-sm mb-2 line-clamp-2">${product.name}</h3>
      <div class="flex items-center gap-1 mb-2 text-sm">
        ${renderStars(product.rating)}
        <span class="text-gray-500 text-xs ml-1">(${product.rating})</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-lg font-bold text-primary">${formatPrice(discountedPrice)}</span>
        ${hasDiscount ? `
          <span class="text-sm text-gray-400 line-through">${formatPrice(product.price)}</span>
          <span class="text-xs text-green-600 font-semibold">${product.discount_percentage}% OFF</span>
        ` : ''}
      </div>
    </div>
  `;

  const wishlistBtn = card.querySelector('.wishlist-btn');
  wishlistBtn.addEventListener('click', async () => {
    const { error } = await removeFromWishlist(product.id);
    if (error) {
      showToast('Error removing from wishlist');
      return;
    }
    card.remove();
    showToast('Removed from wishlist');

    const remainingCards = wishlistContainer.querySelectorAll('.product-card');
    if (remainingCards.length === 0) {
      wishlistContainer.style.display = 'none';
      emptyState.style.display = 'block';
    }
  });

  wishlistContainer.appendChild(card);
}

document.getElementById('logoutButton').addEventListener('click', async () => {
  await signOut();
  showToast('Logged out successfully');
  setTimeout(() => window.location.href = '/', 500);
});
