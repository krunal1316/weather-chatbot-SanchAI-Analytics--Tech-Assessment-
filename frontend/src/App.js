import React, { useState, useMemo, useRef, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';


const detectWeatherTheme = (text) => {
  if (!text) return 'default';
  const lower = text.toLowerCase();

  if (/(sunny|clear|bright)/.test(lower)) return 'sunny';
  if (/(rain|shower|drizzle|storm|thunder)/.test(lower)) return 'rainy';
  if (/(snow|snowy|freezing|blizzard|winter|chill|ice)/.test(lower)) return 'winter';

  return 'default';
};


const getWeatherIcon = (text) => {
  if (!text) return '🌡️';
  const lower = text.toLowerCase();

  if (/(sunny|clear|bright)/.test(lower)) return '☀️';
  if (/(rain|shower|drizzle|storm|thunder)/.test(lower)) return '🌧️';
  if (/(snow|snowy|blizzard|winter|ice)/.test(lower)) return '❄️';
  if (/(cloud|overcast)/.test(lower)) return '☁️';

  return '🌡️';
};

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // { id, role: 'user'|'bot', text, time }
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const currentTheme = useMemo(() => {
    const lastBot = [...messages].reverse().find((m) => m.role === 'bot');
    return lastBot ? detectWeatherTheme(lastBot.text) : 'default';
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const text = input.trim();
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text,
      time: timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        const msg = `Error ${res.status}: ${errorText || 'Failed to fetch response'}`;
        addBotMessage(msg);
        return;
      }

      const data = await res.json();
      const answer = data.response || 'No response received';
      addBotMessage(answer);
    } catch (error) {
      const msg = `Error: ${error.message}. Make sure the backend is running on ${API_URL}`;
      addBotMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const addBotMessage = (text) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const botMessage = {
      id: Date.now() + Math.random(),
      role: 'bot',
      text,
      time: timestamp,
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, loading]);


  const historyItems = useMemo(
    () =>
      messages
        .filter((m) => m.role === 'user')
        .slice(-8)
        .map((m) => (m.text.length > 40 ? `${m.text.slice(0, 40)}…` : m.text)),
    [messages]
  );

  return (
    <div className={`App theme-${currentTheme}`}>
      <div className={`app-shell ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        {/* Left sidebar, ChatGPT-like */}
        <aside className={`sidebar-dark ${sidebarOpen ? '' : 'sidebar-hidden'}`}>
          <div className="sidebar-top">
            <div className="sidebar-title-main">Weather Chatbot</div>
            <button className="sidebar-new-chat" onClick={handleNewChat}>
              <span className="sidebar-new-icon">＋</span>
              <span>New Chat</span>
            </button>
          </div>

          <div className="sidebar-section-label">Recent</div>
          <div className="sidebar-history">
            {historyItems.length === 0 && (
              <div className="sidebar-empty-item">
                No chats yet.
                <br />
                Ask about today&apos;s weather.
              </div>
            )}
            {historyItems.map((title, idx) => (
              <button key={`${title}-${idx}`} className="sidebar-history-item">
                <span className="sidebar-history-dot">●</span>
                <span className="sidebar-history-text">{title}</span>
              </button>
            ))}
          </div>
        </aside>

        {}
        <div className="chat-shell">
          <header className="chat-header-light">
            <div className="chat-header-title">
              <span className="chat-header-icon">🌤️</span>
              <div>
                <h1>Weather Assistant</h1>
                <p>Ask about today&apos;s weather anywhere in the world.</p>
              </div>
              <button
                type="button"
                className="sidebar-toggle-btn"
                onClick={() => setSidebarOpen((open) => !open)}
              >
                {sidebarOpen ? '⟨' : '☰'}
              </button>
            </div>
          </header>

          <main className="chat-main-light">
            <div className="chat-messages-list">
              {messages.length === 0 && !loading && (
                <div className="chat-empty">
                  <p>Ask about today&apos;s weather to get started:</p>
                  <ul>
                    <li>“What&apos;s the weather in Pune today?”</li>
                    <li>“Will it rain in Mumbai this evening?”</li>
                    <li>“Is it cold in Delhi right now?”</li>
                  </ul>
                </div>
              )}

              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                const weatherIcon = !isUser ? getWeatherIcon(msg.text) : null;

                return (
                  <div
                    key={msg.id}
                    className={`chat-row ${isUser ? 'chat-row-user' : 'chat-row-bot'}`}
                  >
                    {!isUser && (
                      <div className="chat-avatar-light chat-avatar-bot-light">
                        {weatherIcon}
                      </div>
                    )}

                    <div
                      className={
                        'chat-bubble-light ' +
                        (isUser ? 'chat-bubble-user-light' : 'chat-bubble-bot-light')
                      }
                    >
                      <div className="chat-bubble-text">{msg.text}</div>
                      <div className="chat-bubble-meta">{msg.time}</div>
                    </div>

                    {isUser && (
                      <div className="chat-avatar-light chat-avatar-user-light">You</div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="chat-row chat-row-bot">
                  <div className="chat-avatar-light chat-avatar-bot-light">🤖</div>
                  <div className="chat-bubble-light chat-bubble-bot-light typing-bubble">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              )}

              {}
              <div ref={messagesEndRef} />
            </div>
          </main>

          <form className="chat-input-wrapper" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about today’s weather…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={loading || !input.trim()}
            >
              {loading ? 'Sending…' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;

