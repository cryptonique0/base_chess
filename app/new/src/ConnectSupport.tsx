import React, { useState } from 'react';
import './ConnectSupport.css';

interface Message {
  id: number;
  user: string;
  text: string;
}

function ConnectSupport() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState('');

  const sendMessage = () => {
    if (!input.trim() || !user.trim()) return;
    setMessages([
      ...messages,
      { id: messages.length + 1, user, text: input }
    ]);
    setInput('');
  };

  return (
    <div className="connect-support">
      <h2>Connect & Support</h2>
      <p>If you are feeling down, connect with others for support and understanding.</p>
      <div className="user-form">
        <input
          type="text"
          placeholder="Your name or nickname"
          value={user}
          onChange={e => setUser(e.target.value)}
        />
      </div>
      <div className="chat-box">
        {messages.length === 0 && <p>No messages yet. Start the conversation!</p>}
        {messages.map(msg => (
          <div key={msg.id} className="message">
            <span className="user">{msg.user}:</span> <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="input-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ConnectSupport;
