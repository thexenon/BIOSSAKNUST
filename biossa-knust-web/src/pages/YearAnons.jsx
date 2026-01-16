import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import api from '../api';
import { Link } from 'react-router-dom';

const YearAnons = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/yearanons');
        setItems(res.data.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <Nav />
      <main style={{ padding: 28, maxWidth: 900, margin: '0 auto' }}>
        <h2>Year Anons</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          items.map((i) => (
            <article
              key={i._id}
              style={{
                background: '#fff',
                padding: 12,
                borderRadius: 8,
                marginTop: 10,
              }}
            >
              <Link
                to={`/year/${i._id}`}
                style={{ textDecoration: 'none', color: '#0f172a' }}
              >
                <div style={{ fontWeight: 700 }}>{i.message}</div>
                <div style={{ color: '#64748b', marginTop: 6 }}>
                  🕗 {new Date(i.createdAt).toLocaleString()}
                </div>
              </Link>
            </article>
          ))
        )}
      </main>
    </div>
  );
};

export default YearAnons;
