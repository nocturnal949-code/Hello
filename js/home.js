import { getProducts, addToWishlist, removeFromWishlist, getWishlist, getCurrentUser, signOut } from './supabase.js';
import { formatPrice, renderStars, debounce, shareOutfit, showToast, observeIntersection } from './utils.js';
import { initAuth } from './auth.js';

let allProducts = [];
let displayedProducts = [];
let wishlistItems = new Set();
let currentFilter = { type: null, value: null };
let productsPerPage = 20;
let currentPage = 1;

initAuth();
loadInitialData();
setupEventListeners();

async function loadInitialData() {
  await loadProducts();
  await updateWishlistCount();
  startHeroCarousel();
  setupScrollAnimations();
}

async function loadProducts() {
  const { data, error } = await getProducts();

  if (error) {
    console.error('Error loading products:', error);
    showToast('Error loading products. Please refresh the page.');
    return;
  }

  allProducts = data || [];
  await loadWishlistStatus();
  renderAllProducts();
}

async function loadWishlistStatus() {
  const user = await getCurrentUser();
  if (!user) {
    wishlistItems.clear();
    return;
  }

  const { data } = await getWishlist();
  wishlistItems = new Set(data?.map(item => item.product.id) || []);
}

function renderProductCard(product, container) {
  const discountedPrice = product.discounted_price || product.price;
  const hasDiscount = product.discount_percentage > 0;
  const inWishlist = wishlistItems.has(product.id);

  const card = document.createElement('div');
  card.className = 'card product-card fade-in-on-scroll';
  card.innerHTML = `
    <div class="relative">
      <img src="${product.images[0] || '/assets/placeholder.jpg'}" alt="${product.name}" loading="lazy">
      ${hasDiscount ? `<div class="discount-badge">${product.discount_percentage}% OFF</div>` : ''}
      <button class="wishlist-btn ${inWishlist ? 'active' : ''}" data-product-id="${product.id}" onclick="event.stopPropagation();">
        <svg fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>
    <div class="p-4">
      ${product.fabric ? `<span class="fabric-tag">${product.fabric}</span>` : ''}
      <h3 class="font-semibold text-sm mb-2 line-clamp-2 leading-snug">${product.name}</h3>
      <div class="flex items-center gap-1 mb-2 text-sm">
        ${renderStars(product.rating || 4)}
        <span class="text-gray-500 text-xs ml-1">(${product.rating || 4})</span>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-lg font-bold text-primary">${formatPrice(discountedPrice)}</span>
        ${hasDiscount ? `
          <span class="text-sm text-gray-400 line-through">${formatPrice(product.price)}</span>
        ` : ''}
      </div>
    </div>
  `;

  card.addEventListener('click', () => openProductModal(product));
  container.appendChild(card);

  const wishlistBtn = card.querySelector('.wishlist-btn');
  wishlistBtn.addEventListener('click', () => toggleWishlist(product.id, wishlistBtn));
}

function renderAllProducts(products = null) {
  const container = document.getElementById('allProductsContainer');
  const loadMoreContainer = document.getElementById('loadMoreContainer');

  if (products === null) {
    products = allProducts;
    currentPage = 1;
  }

  displayedProducts = products;

  if (currentPage === 1) {
    container.innerHTML = '';
  }

  if (products.length === 0) {
    container.innerHTML = `
      <div class="col-span-full empty-state py-12">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-24 h-24 mx-auto mb-4 opacity-30">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="text-xl font-semibold text-gray-600 mb-2">No products found</p>
        <p class="text-gray-500">Try adjusting your search or filters</p>
      </div>
    `;
    loadMoreContainer.style.display = 'none';
    return;
  }

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = currentPage * productsPerPage;
  const productsToShow = products.slice(startIndex, endIndex);

  productsToShow.forEach(product => renderProductCard(product, container));

  if (endIndex < products.length) {
    loadMoreContainer.style.display = 'block';
  } else {
    loadMoreContainer.style.display = 'none';
  }

  setTimeout(() => setupScrollAnimations(), 100);
}

async function toggleWishlist(productId, button) {
  const user = await getCurrentUser();

  if (!user) {
    showToast('Please login to add items to wishlist');
    setTimeout(() => window.location.href = '/login.html', 1000);
    return;
  }

  const isInWishlistNow = wishlistItems.has(productId);

  if (isInWishlistNow) {
    const { error } = await removeFromWishlist(productId);
    if (error) {
      showToast('Error removing from wishlist');
      return;
    }
    wishlistItems.delete(productId);
    button.classList.remove('active');
    button.querySelector('svg').setAttribute('fill', 'none');
    showToast('Removed from wishlist');
  } else {
    const { error } = await addToWishlist(productId);
    if (error) {
      showToast('Error adding to wishlist');
      return;
    }
    wishlistItems.add(productId);
    button.classList.add('active');
    button.querySelector('svg').setAttribute('fill', 'currentColor');
    showToast('Added to wishlist');
  }

  await updateWishlistCount();
}

async function updateWishlistCount() {
  const user = await getCurrentUser();
  if (!user) return;

  const { data } = await getWishlist();
  const count = data?.length || 0;
  const countElement = document.getElementById('wishlistCount');
  if (countElement) {
    countElement.textContent = count;
    countElement.style.display = count > 0 ? 'flex' : 'none';
  }
}

function openProductModal(product) {
  const modal = document.getElementById('productModal');
  const modalContent = modal.querySelector('.modal-content');
  const discountedPrice = product.discounted_price || product.price;
  const hasDiscount = product.discount_percentage > 0;
  const inWishlist = wishlistItems.has(product.id);

  modalContent.innerHTML = `
    <div class="relative">
      <button id="closeModal" class="absolute top-4 left-4 z-20 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div class="image-carousel flex overflow-x-auto snap-x snap-mandatory" id="pdpCarousel">
        ${product.images.map((img, idx) => `
          <img src="${img}" alt="${product.name}" class="carousel-image w-full snap-start aspect-square object-cover">
        `).join('')}
      </div>
      <div class="pdp-carousel-dots" id="pdpCarouselDots">
        ${product.images.map((_, idx) => `
          <div class="pdp-carousel-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></div>
        `).join('')}
      </div>

      <div class="p-6">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <p class="text-sm text-gray-500 uppercase mb-1">${product.category || 'Fashion'}</p>
            <h2 class="text-2xl font-heading font-bold mb-2 leading-tight">${product.name}</h2>
            <div class="flex items-center gap-1 mb-3">
              ${renderStars(product.rating || 4)}
              <span class="text-gray-500 text-sm ml-1">(${product.rating || 4} stars)</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3 mb-4 flex-wrap">
          <span class="text-3xl font-bold text-primary">${formatPrice(discountedPrice)}</span>
          ${hasDiscount ? `
            <span class="text-xl text-gray-400 line-through">${formatPrice(product.price)}</span>
            <span class="discount-badge">${product.discount_percentage}% OFF</span>
          ` : ''}
        </div>

        <div class="stock-badge ${product.in_stock !== false ? 'in-stock' : 'out-of-stock'}">
          <span>${product.in_stock !== false ? '🟢' : '🔴'}</span>
          <span>${product.in_stock !== false ? 'In Stock' : 'Out of Stock'}</span>
        </div>

        ${product.fabric ? `
          <div class="mb-6">
            <h3 class="font-semibold mb-2">Fabric</h3>
            <button class="fabric-tag text-sm cursor-pointer hover:bg-primary hover:text-white transition-colors" data-fabric="${product.fabric}">
              ${product.fabric}
            </button>
          </div>
        ` : ''}

        ${product.sizes && product.sizes.length > 0 ? `
          <div class="mb-6">
            <h3 class="font-semibold mb-3">Select Size</h3>
            <div class="size-selector">
              ${product.sizes.map(size => `
                <button class="size-btn">${size}</button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${product.colors && product.colors.length > 0 ? `
          <div class="mb-6">
            <h3 class="font-semibold mb-3">Available Colors</h3>
            <div class="flex gap-2 flex-wrap">
              ${product.colors.map(color => `
                <div class="color-swatch" style="background-color: ${getColorCode(color)}" title="${color}"></div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <details class="mb-6 cursor-pointer">
          <summary class="font-semibold mb-2 select-none">Description</summary>
          <p class="text-gray-600 leading-relaxed mt-2">${product.description || 'Beautiful outfit from Priya\'s Collection.'}</p>
        </details>

        <div class="flex gap-3">
          <button class="wishlist-btn-modal flex-1 btn-secondary flex items-center justify-center gap-2 ${inWishlist ? 'active' : ''}" data-product-id="${product.id}">
            <svg class="w-5 h-5" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            ${inWishlist ? 'Saved' : 'Save'}
          </button>
          <button id="shareOutfit" class="flex-1 btn-primary flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  setupPDPCarousel();

  document.getElementById('closeModal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  const sizeButtons = modalContent.querySelectorAll('.size-btn');
  sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const colorSwatches = modalContent.querySelectorAll('.color-swatch');
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
    });
  });

  const wishlistBtn = modalContent.querySelector('.wishlist-btn-modal');
  wishlistBtn.addEventListener('click', () => toggleWishlist(product.id, wishlistBtn));

  document.getElementById('shareOutfit').addEventListener('click', () => {
    shareOutfit(product.name, `/?product=${product.id}`);
  });

  const fabricTag = modalContent.querySelector('[data-fabric]');
  if (fabricTag) {
    fabricTag.addEventListener('click', () => {
      closeModal();
      filterByFabric(fabricTag.dataset.fabric);
    });
  }
}

function setupPDPCarousel() {
  const carousel = document.getElementById('pdpCarousel');
  const dots = document.querySelectorAll('.pdp-carousel-dot');

  if (!carousel || dots.length === 0) return;

  carousel.addEventListener('scroll', () => {
    const scrollLeft = carousel.scrollLeft;
    const width = carousel.offsetWidth;
    const currentIndex = Math.round(scrollLeft / width);

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  });

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      carousel.scrollTo({
        left: idx * carousel.offsetWidth,
        behavior: 'smooth'
      });
    });
  });
}

function closeModal() {
  const modal = document.getElementById('productModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function getColorCode(colorName) {
  const colorMap = {
    'Red': '#DC2626',
    'Pink': '#EC4899',
    'Rani Pink': '#C2185B',
    'Royal Blue': '#1E40AF',
    'Navy Blue': '#1E3A8A',
    'Maroon': '#7F1D1D',
    'Yellow': '#EAB308',
    'Orange': '#F97316',
    'White': '#FFFFFF',
    'Black': '#000000',
    'Beige': '#D4B896',
    'Green': '#16A34A',
    'Emerald': '#059669',
    'Purple': '#9333EA',
    'Wine': '#881337',
    'Gold': '#D4AF37',
    'Silver': '#C0C0C0',
    'Rose Gold': '#B76E79',
    'Cream': '#FFFDD0',
    'Peach': '#FFE5B4',
    'Mint Green': '#98FF98',
    'Turquoise': '#40E0D0'
  };
  return colorMap[colorName] || '#9CA3AF';
}

function filterByCategory(category) {
  currentFilter = { type: 'category', value: category };
  currentPage = 1;

  document.querySelectorAll('.category-chip').forEach(chip => {
    if (chip.dataset.category === category) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  document.querySelectorAll('.fabric-chip').forEach(chip => {
    chip.classList.remove('active');
  });

  const filtered = allProducts.filter(p => p.category === category);
  document.getElementById('productSectionTitle').textContent = category;
  document.getElementById('clearFilters').style.display = 'block';
  renderAllProducts(filtered);
  scrollToProducts();
}

function filterByFabric(fabric) {
  currentFilter = { type: 'fabric', value: fabric };
  currentPage = 1;

  document.querySelectorAll('.fabric-chip').forEach(chip => {
    if (chip.dataset.fabric === fabric) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.classList.remove('active');
  });

  const filtered = allProducts.filter(p => p.fabric === fabric);
  document.getElementById('productSectionTitle').textContent = `${fabric} Collection`;
  document.getElementById('clearFilters').style.display = 'block';
  renderAllProducts(filtered);
  scrollToProducts();
}

function clearFilters() {
  currentFilter = { type: null, value: null };
  currentPage = 1;

  document.querySelectorAll('.category-chip, .fabric-chip').forEach(chip => {
    chip.classList.remove('active');
  });

  document.getElementById('productSectionTitle').textContent = 'All Products';
  document.getElementById('clearFilters').style.display = 'none';
  renderAllProducts();
}

function scrollToProducts() {
  const container = document.getElementById('allProductsContainer');
  window.scrollTo({
    top: container.offsetTop - 100,
    behavior: 'smooth'
  });
}

function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.toLowerCase().trim();
    currentPage = 1;

    if (query === '') {
      if (currentFilter.type) {
        if (currentFilter.type === 'category') {
          filterByCategory(currentFilter.value);
        } else if (currentFilter.type === 'fabric') {
          filterByFabric(currentFilter.value);
        }
      } else {
        renderAllProducts();
      }
      return;
    }

    let filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.category && p.category.toLowerCase().includes(query)) ||
      (p.fabric && p.fabric.toLowerCase().includes(query))
    );

    if (currentFilter.type === 'category') {
      filtered = filtered.filter(p => p.category === currentFilter.value);
    } else if (currentFilter.type === 'fabric') {
      filtered = filtered.filter(p => p.fabric === currentFilter.value);
    }

    renderAllProducts(filtered);
  }, 300));

  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      filterByCategory(chip.dataset.category);
    });
  });

  document.querySelectorAll('.fabric-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      filterByFabric(chip.dataset.fabric);
    });
  });

  document.getElementById('clearFilters').addEventListener('click', clearFilters);

  document.getElementById('loadMoreBtn').addEventListener('click', () => {
    currentPage++;
    renderAllProducts(displayedProducts);
  });

  document.getElementById('loginButton').addEventListener('click', () => {
    window.location.href = '/login.html';
  });

  document.getElementById('logoutButton').addEventListener('click', async () => {
    await signOut();
    showToast('Logged out successfully');
    wishlistItems.clear();
    renderAllProducts();
    await updateWishlistCount();
  });

  document.getElementById('wishlistNavBtn').addEventListener('click', () => {
    window.location.href = '/wishlist.html';
  });
}

function startHeroCarousel() {
  const carousel = document.getElementById('heroCarousel');
  const slides = carousel.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('carouselDots');

  let currentSlide = 0;

  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      currentSlide = idx;
      goToSlide(idx);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.carousel-dot');

  function goToSlide(index) {
    carousel.scrollTo({
      left: index * carousel.offsetWidth,
      behavior: 'smooth'
    });

    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
  }, 4000);

  carousel.addEventListener('scroll', () => {
    const scrollLeft = carousel.scrollLeft;
    const width = carousel.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);

    if (newIndex !== currentSlide) {
      currentSlide = newIndex;
      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  });
}

function setupScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in-on-scroll');
  observeIntersection(elements, (el) => {
    el.classList.add('visible');
  });
}
