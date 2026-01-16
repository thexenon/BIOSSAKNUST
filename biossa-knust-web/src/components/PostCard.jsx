import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <article style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={styles.title}>{post.message || 'Untitled'}</h3>
        <div style={styles.meta}>
          🕗 {new Date(post.createdAt).toLocaleString()}
        </div>
      </div>
      <p style={styles.excerpt}>
        {(post.message || '').slice(0, 200)}
        {(post.message || '').length > 200 ? '...' : ''}
      </p>
      <div style={styles.row}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={styles.badge}>{post.reactions?.length || 0} ❤️</div>
          <div style={styles.badge}>{post.comments?.length || 0} 💬</div>
        </div>
        <Link to={`/post/${post._id}`} style={styles.open}>
          Open
        </Link>
      </div>
    </article>
  );
};

const styles = {
  card: {
    background: '#fff',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
    marginBottom: 18,
  },
  title: { margin: 0, fontSize: 18, color: '#0f172a' },
  meta: { fontSize: 12, color: '#64748b' },
  excerpt: { color: '#334155', marginTop: 8 },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  badge: {
    background: '#f1f5f9',
    padding: '6px 10px',
    borderRadius: 8,
    fontSize: 13,
    color: '#0f172a',
  },
  open: {
    textDecoration: 'none',
    background: '#06b6d4',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: 8,
  },
};

export default PostCard;
