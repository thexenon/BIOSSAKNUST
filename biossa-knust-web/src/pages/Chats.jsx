import React from 'react';
import Nav from '../components/Nav';
import ChatBot from '../components/ChatBot';
import API from '../api';

const Chats = () => {
  return (
    <div>
      <Nav />
      <main style={{ padding: 28 }}>
        <h2>BioBot</h2>
        <p style={{ color: '#64748b' }}>
          Ask biology questions and get tailored answers.
        </p>
        <div style={{ marginTop: 20 }}>
          <ChatBot api={API} />
        </div>
      </main>
    </div>
  );
};

export default Chats;
