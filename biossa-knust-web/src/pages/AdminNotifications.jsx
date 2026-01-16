import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminNotifications = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sending, setSending] = useState(false);

  const fetchLogs = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/notifications?limit=50&page=${p}`);
      setLogs(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const sendTest = async () => {
    const to = prompt('Recipient user id to send test notification to:');
    if (!to) return;
    const body = {
      to,
      type: 'admin_test',
      message: 'Test notification from admin dashboard',
    };
    setSending(true);
    try {
      await api.post('/notifications', body);
      alert('Sent (or queued)');
      fetchLogs(page);
    } catch (err) {
      alert('Error: ' + (err.message || ''));
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 20 }}>
      <h2>Notification Logs</h2>
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span style={{ margin: '0 8px' }}>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
        <button
          style={{ marginLeft: 12 }}
          onClick={sendTest}
          disabled={sending}
        >
          {sending ? 'Sending...' : 'Send Test'}
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th>When</th>
              <th>Recipient</th>
              <th>Title</th>
              <th>Body</th>
              <th>Status</th>
              <th>Attempts</th>
              <th>Last Error</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l._id} style={{ borderBottom: '1px solid #fafafa' }}>
                <td>{new Date(l.createdAt).toLocaleString()}</td>
                <td>{l.recipient?.name || l.recipient?._id || '—'}</td>
                <td>{l.title}</td>
                <td
                  style={{
                    maxWidth: 300,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {l.body}
                </td>
                <td>{l.status}</td>
                <td>{l.attempts}</td>
                <td style={{ color: 'crimson' }}>{l.lastError || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminNotifications;
