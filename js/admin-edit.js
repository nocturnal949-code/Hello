import { getProductById, updateProduct } from './supabase.js';
import { showToast } from './utils.js';
import { requireAdmin } from './auth.js';

requireAdmin();

const editProductForm = document.getElementById('editProductForm');
const submitBtn = document.getElementById('submitBtn');
const submitBtnText = document.getElementById('submitBtnText');
const submitBtnLoader = document.getElementById('submitBtnLoader');
const errorMessage = document.getElementById('errorMessage');
const loadingState = document.getElementById('loadingState');
const editFormContainer = document.getElementById('editFormContainer');

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

if (!productId) {
  showToast('Product ID not found');
  setTimeout(() => window.location.href = '/admin/dashboard.html', 1000);
} else {
  loadProduct();
}

async function loadProduct() {
  const { data, error } = await getProductById(productId);

  if (error || !data) {
    showToast('Error loading product');
    setTimeout(() => window.location.href = '/admin/dashboard.html', 1000);
    return;
  }

  document.getElementById('productId').value = data.id;
  document.getElementById('name').value = data.name;
  document.getElementById('category').value = data.category;
  document.getElementById('fabric').value = data.fabric || '';
  document.getElementById('price').value = data.price;
  document.getElementById('discount').value = data.discount_percentage || 0;
  document.getElementById('description').value = data.description;
  document.getElementById('images').value = data.images.join('\n');
  document.getElementById('colors').value = data.colors.join(', ');
  document.getElementById('sizes').value = data.sizes.join(', ');
  document.getElementById('rating').value = data.rating;
  document.getElementById('isNewArrival').checked = data.is_new_arrival;
  document.getElementById('isFestive').checked = data.is_festive;
  document.getElementById('isTrending').checked = data.is_trending;

  loadingState.style.display = 'none';
  editFormContainer.style.display = 'block';
}

editProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  errorMessage.style.display = 'none';
  submitBtn.disabled = true;
  submitBtnText.style.display = 'none';
  submitBtnLoader.style.display = 'inline-block';

  const formData = new FormData(editProductForm);

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

  const { data, error } = await updateProduct(productId, product);

  if (error) {
    console.error('Error updating product:', error);
    errorMessage.textContent = error.message || 'Error updating product';
    errorMessage.style.display = 'block';
    submitBtn.disabled = false;
    submitBtnText.style.display = 'inline';
    submitBtnLoader.style.display = 'none';
    return;
  }

  showToast('Product updated successfully!');
  setTimeout(() => {
    window.location.href = '/admin/dashboard.html';
  }, 500);
});
