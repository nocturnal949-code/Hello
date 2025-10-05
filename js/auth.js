import { supabase, getCurrentUser } from './supabase.js';

export function initAuth() {
  supabase.auth.onAuthStateChange((event, session) => {
    (async () => {
      if (event === 'SIGNED_IN') {
        updateAuthUI(session.user);
      } else if (event === 'SIGNED_OUT') {
        updateAuthUI(null);
      }
    })();
  });

  checkInitialAuth();
}

async function checkInitialAuth() {
  const user = await getCurrentUser();
  updateAuthUI(user);
}

function updateAuthUI(user) {
  const authButtons = document.querySelectorAll('[data-auth-required]');
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  const userEmail = document.getElementById('userEmail');

  if (user) {
    authButtons.forEach(btn => btn.style.display = 'block');
    if (loginButton) loginButton.style.display = 'none';
    if (logoutButton) logoutButton.style.display = 'block';
    if (userEmail) userEmail.textContent = user.email;
  } else {
    authButtons.forEach(btn => btn.style.display = 'none');
    if (loginButton) loginButton.style.display = 'block';
    if (logoutButton) logoutButton.style.display = 'none';
  }
}

export function requireAuth(redirectUrl = '/login.html') {
  getCurrentUser().then(user => {
    if (!user) {
      window.location.href = redirectUrl;
    }
  });
}

export function requireAdmin(redirectUrl = '/admin/login.html') {
  getCurrentUser().then(async user => {
    if (!user) {
      window.location.href = redirectUrl;
      return;
    }

    const { data } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!data) {
      alert('Access denied. Admin privileges required.');
      window.location.href = '/';
    }
  });
}
