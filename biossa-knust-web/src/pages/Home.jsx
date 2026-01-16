import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import API from '../api';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get('/mainanons');
        setPosts(res.data.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div
      style={{ fontFamily: 'Inter, system-ui, -apple-system, Roboto, Arial' }}
    >
      <Nav />
      <main style={{ padding: 28, maxWidth: 1100, margin: '0 auto' }}>
        <section
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>BIOSSA • KNUST</h1>
            <p style={{ color: '#64748b' }}>
              Community anonymous posts and updates.
            </p>
          </div>
        </section>

        <section style={{ marginTop: 20 }}>
          {loading ? (
            <p>Loading...</p>
          ) : posts.length === 0 ? (
            <p>No posts yet</p>
          ) : (
            posts.map((p) => <PostCard key={p._id} post={p} />)
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
