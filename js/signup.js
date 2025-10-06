import { signUp } from './supabase.js';
import { showToast } from './utils.js';

const signupForm = document.getElementById('signupForm');
const signupBtn = document.getElementById('signupBtn');
const signupBtnText = document.getElementById('signupBtnText');
const signupBtnLoader = document.getElementById('signupBtnLoader');
const errorMessage = document.getElementById('errorMessage');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const role = document.getElementById('role').value;

  errorMessage.style.display = 'none';

  if (!role) {
    errorMessage.textContent = 'Please select a role';
    errorMessage.style.display = 'block';
    return;
  }

  if (password !== confirmPassword) {
    errorMessage.textContent = 'Passwords do not match';
    errorMessage.style.display = 'block';
    return;
  }

  if (password.length < 6) {
    errorMessage.textContent = 'Password must be at least 6 characters';
    errorMessage.style.display = 'block';
    return;
  }

  signupBtn.disabled = true;
  signupBtnText.style.display = 'none';
  signupBtnLoader.style.display = 'inline-block';

  const { data, error } = await signUp(email, password, role);

  if (error) {
    errorMessage.textContent = error.message || 'Error creating account';
    errorMessage.style.display = 'block';
    signupBtn.disabled = false;
    signupBtnText.style.display = 'inline';
    signupBtnLoader.style.display = 'none';
    return;
  }

  showToast('Account created successfully! Logging you in...');
  setTimeout(() => {
    if (role === 'admin') {
      window.location.href = '/admin/dashboard.html';
    } else {
      window.location.href = '/index.html';
    }
  }, 1000);
});
