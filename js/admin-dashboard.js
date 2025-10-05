import { getProducts, deleteProduct, signOut } from './supabase.js';
import { formatPrice, showToast } from './utils.js';
import { requireAdmin } from './auth.js';

requireAdmin();

const productsTableBody = document.getElementById('productsTableBody');

loadProducts();

async function loadProducts() {
  const { data, error } = await getProducts();

  if (error) {
    console.error('Error loading products:', error);
    showToast('Error loading products');
    return;
  }

  productsTableBody.innerHTML = '';

  if (!data || data.length === 0) {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-8 text-gray-500">No products found</td>
      </tr>
    `;
    return;
  }

  data.forEach(product => {
    const row = document.createElement('tr');
    row.className = 'border-b border-gray-100 hover:bg-gray-50';
    row.innerHTML = `
      <td class="py-3 px-2">
        <img src="${product.images[0] || '/assets/placeholder.jpg'}" alt="${product.name}" class="w-16 h-16 object-cover rounded">
      </td>
      <td class="py-3 px-2 font-semibold">${product.name}</td>
      <td class="py-3 px-2 text-sm text-gray-600">${product.category}</td>
      <td class="py-3 px-2">${formatPrice(product.price)}</td>
      <td class="py-3 px-2 text-sm">
        ${product.discount_percentage > 0 ? `<span class="badge badge-new">${product.discount_percentage}% OFF</span>` : '-'}
      </td>
      <td class="py-3 px-2">
        <div class="flex items-center justify-end gap-2">
          <a href="/admin/edit.html?id=${product.id}" class="text-blue-600 hover:text-blue-700 font-semibold text-sm">Edit</a>
          <button class="text-red-600 hover:text-red-700 font-semibold text-sm delete-btn" data-id="${product.id}">Delete</button>
        </div>
      </td>
    `;

    const deleteBtn = row.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => handleDelete(product.id, product.name));

    productsTableBody.appendChild(row);
  });
}

async function handleDelete(productId, productName) {
  if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
    return;
  }

  const { error } = await deleteProduct(productId);

  if (error) {
    console.error('Error deleting product:', error);
    showToast('Error deleting product');
    return;
  }

  showToast('Product deleted successfully');
  loadProducts();
}

document.getElementById('logoutButton').addEventListener('click', async () => {
  await signOut();
  showToast('Logged out successfully');
  setTimeout(() => window.location.href = '/', 500);
});
