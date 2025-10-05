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

  errorMessage.style.display = 'none';

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

  const { data, error } = await signUp(email, password);

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
    window.location.href = '/';
  }, 1000);
});
