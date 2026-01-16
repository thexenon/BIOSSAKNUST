import React, { useState } from 'react';
import Nav from '../components/Nav';
import API from '../api';

const Create = () => {
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/mainanons', { message, color });
      if (res.status === 201 || res.status === 200)
        setSuccess('Posted successfully');
    } catch (err) {
      setSuccess('Failed to post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Nav />
      <main style={{ padding: 28 }}>
        <h2>Create Anonymous Post</h2>
        <form onSubmit={submit} style={{ maxWidth: 720, marginTop: 18 }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your anonymous message"
            style={{
              width: '100%',
              minHeight: 140,
              padding: 12,
              borderRadius: 8,
              border: '1px solid #e2e8f0',
            }}
          />
          <div
            style={{
              display: 'flex',
              gap: 12,
              marginTop: 12,
              alignItems: 'center',
            }}
          >
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <button
              style={{
                background: '#06b6d4',
                color: '#fff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: 8,
              }}
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
          {success && <p style={{ marginTop: 12 }}>{success}</p>}
        </form>
      </main>
    </div>
  );
};

export default Create;
