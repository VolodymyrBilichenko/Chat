import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [name, setName] = useState(''); // Стан для імені користувача
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket('wss://tx6t6n-3005.csb.app');

    socketRef.current.onmessage = (event) => {
      const messageData = JSON.parse(event.data); // Розпарсити повідомлення
      setMessages((prevMessages) => [...prevMessages, messageData]);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (input && name && socketRef.current) {
      const message = { name, text: input };  // Включити ім'я в повідомлення
      socketRef.current.send(JSON.stringify(message));  // Відправити JSON-форматоване повідомлення
      setInput('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chat</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name..."
        style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
      />
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <strong>{message.name}:</strong> {message.text}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{ padding: '10px', width: '300px', marginRight: '10px' }}
      />
      <button onClick={sendMessage} style={{ padding: '10px 20px' }}>
        Send
      </button>
    </div>
  );
};

export default App;
