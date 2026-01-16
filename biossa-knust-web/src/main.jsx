import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Create from './pages/Create';
import Post from './pages/Post';
import Chats from './pages/Chats';
import AdminNotifications from './pages/AdminNotifications';
import Login from './pages/Login';
import Register from './pages/Register';
import YearAnons from './pages/YearAnons';
import YearAnon from './pages/YearAnon';
import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/year" element={<YearAnons />} />
        <Route path="/year/:id" element={<YearAnon />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
