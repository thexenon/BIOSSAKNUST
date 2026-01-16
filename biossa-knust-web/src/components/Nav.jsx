import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, clearAuth } from '../utils/auth';

// show login/register or logout based on auth

const Nav = () => {
  const loc = useLocation();
  const nav = useNavigate();
  const user = getCurrentUser();
  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <Link to="/" style={styles.brandLink}>
          BIOSSA • KNUST
        </Link>
      </div>
      <nav style={styles.nav}>
        <Link to="/" style={loc.pathname === '/' ? styles.active : styles.link}>
          Home
        </Link>
        <Link
          to="/create"
          style={loc.pathname === '/create' ? styles.active : styles.link}
        >
          Create
        </Link>
        <Link
          to="/chats"
          style={loc.pathname === '/chats' ? styles.active : styles.link}
        >
          Chats
        </Link>
        <Link
          to="/profile"
          style={loc.pathname === '/profile' ? styles.active : styles.link}
        >
          Profile
        </Link>
        {user ? (
          <>
            {user.role &&
              (user.role === 'admin' || user.role === 'superadmin') && (
                <Link
                  to="/admin/notifications"
                  style={
                    loc.pathname.startsWith('/admin')
                      ? styles.active
                      : styles.link
                  }
                >
                  Admin
                </Link>
              )}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                clearAuth();
                nav('/');
              }}
              style={styles.link}
            >
              Logout
            </a>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={loc.pathname === '/login' ? styles.active : styles.link}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={loc.pathname === '/register' ? styles.active : styles.link}
            >
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 28px',
    background: '#111827',
    color: '#fff',
    boxShadow: '0 6px 20px rgba(2,6,23,0.2)',
  },
  brand: { fontSize: 20, fontWeight: 700, letterSpacing: 1 },
  brandLink: { color: '#fff', textDecoration: 'none' },
  nav: { display: 'flex', gap: 18, alignItems: 'center' },
  link: {
    color: '#cbd5e1',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: 8,
  },
  active: {
    color: '#fff',
    background: '#2563eb',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: 8,
  },
};

export default Nav;
