import { signIn, getUserRole } from './supabase.js';
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
  const selectedRole = document.getElementById('role').value;

  errorMessage.style.display = 'none';

  if (!selectedRole) {
    errorMessage.textContent = 'Please select a role';
    errorMessage.style.display = 'block';
    return;
  }

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

  const userRole = await getUserRole();

  if (userRole !== selectedRole) {
    errorMessage.textContent = `You are not registered as ${selectedRole}`;
    errorMessage.style.display = 'block';
    loginBtn.disabled = false;
    loginBtnText.style.display = 'inline';
    loginBtnLoader.style.display = 'none';
    return;
  }

  showToast('Login successful!');
  setTimeout(() => {
    if (selectedRole === 'admin') {
      window.location.href = '/admin/dashboard.html';
    } else {
      window.location.href = '/index.html';
    }
  }, 500);
});
