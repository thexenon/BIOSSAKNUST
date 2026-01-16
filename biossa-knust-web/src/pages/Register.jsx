import React, { useState } from 'react';
import api from '../api';
import { saveAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/users/signup', { name, email, password });
      const token = res.data.token || res.data?.data?.token;
      const user = res.data.user || res.data?.data?.user;
      if (token) saveAuth(token, user);
      nav('/');
    } catch (err) {
      alert('Signup failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Nav />
      <main style={{ padding: 28, maxWidth: 720, margin: '0 auto' }}>
        <h2>Create account</h2>
        <form
          onSubmit={submit}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <button disabled={loading}>
            {loading ? '...' : 'Create account'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Register;
