import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import api from '../api';
import { useParams } from 'react-router-dom';

const YearAnon = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/yearanons/${id}`);
        setItem(res.data.data.data);
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
  if (!item)
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
          <h2>{item.message}</h2>
          <div style={{ color: '#64748b', marginBottom: 12 }}>
            🕗 {new Date(item.createdAt).toLocaleString()}
          </div>
        </article>
      </main>
    </div>
  );
};

export default YearAnon;
