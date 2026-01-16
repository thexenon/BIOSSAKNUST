import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import API from '../api';
import { getToken, getCurrentUser } from '../utils/auth';

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/mainanons/${id}`);
        setPost(res.data.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <div>
        <Nav />
        <main style={{ padding: 28 }}>Loading...</main>
      </div>
    );
  if (!post)
    return (
      <div>
        <Nav />
        <main style={{ padding: 28 }}>Not found</main>
      </div>
    );

  return (
    <div>
      <Nav />
      <main style={{ padding: 28, maxWidth: 900, margin: '0 auto' }}>
        <article style={{ background: '#fff', padding: 20, borderRadius: 12 }}>
          <h2>{post.message}</h2>
          <div style={{ color: '#64748b', marginBottom: 12 }}>
            🕗 {new Date(post.createdAt).toLocaleString()}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <div style={{ padding: 8, background: '#f1f5f9', borderRadius: 8 }}>
              {post.reactions?.length || 0} ❤️
            </div>
            <div style={{ padding: 8, background: '#f1f5f9', borderRadius: 8 }}>
              {post.comments?.length || 0} 💬
            </div>
          </div>
        </article>
        <div style={{ marginTop: 12 }}>
          <button
            onClick={async () => {
              const token = getToken();
              if (!token) {
                alert('Please login to react');
                return;
              }
              try {
                await API.post(`/mainanons/${id}/reactions`);
                alert('Reacted');
              } catch (e) {
                alert('Error reacting');
              }
            }}
          >
            React ❤️
          </button>
          <button
            style={{ marginLeft: 8 }}
            onClick={() => {
              const shareUrl = window.location.href;
              if (navigator.share) {
                navigator.share({ title: 'BIOSSA post', url: shareUrl });
              } else {
                navigator.clipboard.writeText(shareUrl);
                alert('Link copied');
              }
            }}
          >
            Share
          </button>
        </div>
        <section style={{ marginTop: 20 }}>
          <h3>Comments</h3>
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((c) => (
              <div
                key={c._id}
                style={{
                  padding: 12,
                  background: '#fff',
                  borderRadius: 8,
                  marginTop: 10,
                }}
              >
                <div style={{ fontSize: 13, color: '#0f172a' }}>
                  {c.comment}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>
                  🕗 {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet</p>
          )}
          <CommentBox
            postId={id}
            onPosted={async () => {
              const res = await API.get(`/mainanons/${id}`);
              setPost(res.data.data.data);
            }}
          />
        </section>
      </main>
    </div>
  );
};

const CommentBox = ({ postId, onPosted }) => {
  const [text, setText] = React.useState('');
  const submit = async () => {
    if (!text.trim()) return;
    try {
      await API.post('/maincomments', { mainAnon: postId, comment: text });
      setText('');
      if (onPosted) onPosted();
    } catch (e) {
      alert('Error posting comment');
    }
  };
  return (
    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
      <input
        style={{ flex: 1 }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
      />
      <button onClick={submit}>Post</button>
    </div>
  );
};

export default Post;
