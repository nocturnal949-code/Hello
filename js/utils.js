export function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function calculateDiscountedPrice(price, discountPercentage) {
  return price - (price * discountPercentage / 100);
}

export function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let stars = '';
  for (let i = 0; i < fullStars; i++) {
    stars += '<span class="text-yellow-400">★</span>';
  }
  if (hasHalfStar) {
    stars += '<span class="text-yellow-400">⯨</span>';
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '<span class="text-gray-300">★</span>';
  }

  return stars;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export async function shareOutfit(productName, productUrl) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: productName,
        text: `Check out this beautiful outfit from Priya's Collection: ${productName}`,
        url: productUrl
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  } else {
    const url = window.location.origin + productUrl;
    await navigator.clipboard.writeText(url);
    showToast('Link copied to clipboard!');
  }
}

export function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('animate-fade-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export function observeIntersection(elements, callback) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}
