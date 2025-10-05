import { signIn, isAdmin } from './supabase.js';
import { showToast } from './utils.js';

const adminLoginForm = document.getElementById('adminLoginForm');
const loginBtn = document.getElementById('loginBtn');
const loginBtnText = document.getElementById('loginBtnText');
const loginBtnLoader = document.getElementById('loginBtnLoader');
const errorMessage = document.getElementById('errorMessage');

adminLoginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  errorMessage.style.display = 'none';
  loginBtn.disabled = true;
  loginBtnText.style.display = 'none';
  loginBtnLoader.style.display = 'inline-block';

  const { data, error } = await signIn(email, password);

  if (error) {
    errorMessage.textContent = 'Invalid credentials';
    errorMessage.style.display = 'block';
    loginBtn.disabled = false;
    loginBtnText.style.display = 'inline';
    loginBtnLoader.style.display = 'none';
    return;
  }

  const adminCheck = await isAdmin();

  if (!adminCheck) {
    errorMessage.textContent = 'Access denied. Admin privileges required.';
    errorMessage.style.display = 'block';
    loginBtn.disabled = false;
    loginBtnText.style.display = 'inline';
    loginBtnLoader.style.display = 'none';
    return;
  }

  showToast('Admin login successful!');
  setTimeout(() => {
    window.location.href = '/admin/dashboard.html';
  }, 500);
});
