import { signIn } from './supabase.js';
import { showToast } from './utils.js';

const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const loginBtnText = document.getElementById('loginBtnText');
const loginBtnLoader = document.getElementById('loginBtnLoader');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  errorMessage.style.display = 'none';
  loginBtn.disabled = true;
  loginBtnText.style.display = 'none';
  loginBtnLoader.style.display = 'inline-block';

  const { data, error } = await signIn(email, password);

  if (error) {
    errorMessage.textContent = error.message || 'Invalid email or password';
    errorMessage.style.display = 'block';
    loginBtn.disabled = false;
    loginBtnText.style.display = 'inline';
    loginBtnLoader.style.display = 'none';
    return;
  }

  showToast('Login successful!');
  setTimeout(() => {
    window.location.href = '/';
  }, 500);
});
