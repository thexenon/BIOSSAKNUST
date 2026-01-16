// Simple auth helper for storing JWT and user
const TOKEN_KEY = 'bkn_token';
const USER_KEY = 'bkn_user';

export function saveAuth(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch (e) {
    return null;
  }
}

export default { saveAuth, clearAuth, getToken, getCurrentUser };
