import React, { useState } from 'react';

// Simple local mock or optional backend proxy. If backend '/api/v1/ai/chat' exists it will be used.
const ChatBot = ({ api }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm BioBot. Ask me about biology.", sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      if (api) {
        // try streaming endpoint via fetch so we can show incremental tokens
        const base = api.defaults?.baseURL || '';
        const url = `${base}/ai/chat?stream=1`;
        const headers = { 'Content-Type': 'application/json' };
        // try to copy Authorization header if axios has it configured
        const auth =
          api.defaults?.headers?.common?.Authorization ||
          api.defaults?.headers?.Authorization;
        if (auth) headers.Authorization = auth;

        const resp = await fetch(url, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({ message: userMsg.text }),
        });

        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(txt || 'AI error');
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let partial = '';
        // add empty bot message to append to
        const botId = Date.now() + 1;
        setMessages((m) => [...m, { id: botId, text: '', sender: 'bot' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // server emits SSE style: data: {"chunk":"..."}\n\n
          partial += chunk;
          // attempt to extract JSON objects in the partial buffer
          const parts = partial.split(/\r?\n\r?\n/);
          for (let i = 0; i < parts.length - 1; i++) {
            const p = parts[i].trim();
            if (!p) continue;
            const m = p.replace(/^data:\s*/, '');
            try {
              const obj = JSON.parse(m);
              if (obj.chunk) {
                // append chunk text to bot message
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === botId
                      ? { ...msg, text: (msg.text || '') + obj.chunk }
                      : msg
                  )
                );
              }
            } catch (e) {
              // ignore parse errors
            }
          }
          partial = parts[parts.length - 1];
        }

        // after stream completes, no-op (message already assembled). Optionally fetch cached full text
        setLoading(false);
      } else {
        // simple mock reply
        const text = `BioBot: A brief biology tip about "${userMsg.text}" — remember to verify with reliable sources.`;
        setTimeout(() => {
          setMessages((m) => [
            ...m,
            { id: Date.now() + 1, text, sender: 'bot' },
          ]);
          setLoading(false);
        }, 800);
        return;
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          text: 'Error getting response: ' + (err.message || ''),
          sender: 'bot',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.messages}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={m.sender === 'user' ? styles.user : styles.bot}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div style={styles.inputRow}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a biology question..."
          style={styles.input}
        />
        <button onClick={send} disabled={loading} style={styles.btn}>
          {loading ? '..' : 'Send'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  wrap: {
    background: '#fff',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 10px 30px rgba(2,6,23,0.06)',
    maxWidth: 800,
    margin: '0 auto',
  },
  messages: {
    minHeight: 200,
    maxHeight: 400,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 8,
  },
  user: {
    alignSelf: 'flex-end',
    background: '#2563eb',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  bot: {
    alignSelf: 'flex-start',
    background: '#f1f5f9',
    color: '#0f172a',
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  inputRow: { display: 'flex', gap: 10, marginTop: 12 },
  input: { flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' },
  btn: {
    background: '#06b6d4',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 8,
  },
};

export default ChatBot;
