import { createProduct } from './supabase.js';
import { showToast } from './utils.js';
import { requireAdmin } from './auth.js';

requireAdmin();

const addProductForm = document.getElementById('addProductForm');
const submitBtn = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');
const submitBtnLoader = document.getElementById('submitBtnLoader');
const errorMessage = document.getElementById('errorMessage');

addProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  errorMessage.style.display = 'none';
  submitBtn.disabled = true;
  submitBtnText.style.display = 'none';
  submitBtnLoader.style.display = 'inline-block';

  const formData = new FormData(addProductForm);

  const imagesText = formData.get('images').trim();
  const images = imagesText.split('\n').map(url => url.trim()).filter(url => url.length > 0);

  const colorsText = formData.get('colors').trim();
  const colors = colorsText ? colorsText.split(',').map(c => c.trim()) : [];

  const sizesText = formData.get('sizes').trim();
  const sizes = sizesText ? sizesText.split(',').map(s => s.trim()) : ['S', 'M', 'L', 'XL'];

  const product = {
    name: formData.get('name'),
    category: formData.get('category'),
    fabric: formData.get('fabric') || null,
    price: parseFloat(formData.get('price')),
    discount_percentage: parseInt(formData.get('discount')) || 0,
    description: formData.get('description'),
    images: images,
    colors: colors,
    sizes: sizes,
    rating: parseFloat(formData.get('rating')) || 4.5,
    is_new_arrival: document.getElementById('isNewArrival').checked,
    is_festive: document.getElementById('isFestive').checked,
    is_trending: document.getElementById('isTrending').checked
  };

  const { data, error } = await createProduct(product);

  if (error) {
    console.error('Error creating product:', error);
    errorMessage.textContent = error.message || 'Error creating product';
    errorMessage.style.display = 'block';
    submitBtn.disabled = false;
    submitBtnText.style.display = 'inline';
    submitBtnLoader.style.display = 'none';
    return;
  }

  showToast('Product added successfully!');
  setTimeout(() => {
    window.location.href = '/admin/dashboard.html';
  }, 500);
});
