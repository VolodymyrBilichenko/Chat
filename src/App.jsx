import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [messages, setMessages] = useState([]);  // Стан для повідомлень
  const [input, setInput] = useState('');        // Стан для введеного тексту
  const socketRef = useRef(null);                // Посилання на WebSocket

  // Підключення WebSocket при завантаженні компоненту
  useEffect(() => {
    socketRef.current = new WebSocket('wss://tx6t6n-3005.csb.app');

    socketRef.current.onmessage = (event) => {
      // Перевірка на Blob і обробка
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          setMessages((prevMessages) => [...prevMessages, reader.result]); // Додаємо текст повідомлення
        };
        reader.readAsText(event.data); // Конвертуємо Blob в текст
      } else {
        setMessages((prevMessages) => [...prevMessages, event.data]); // Додаємо текст повідомлення
      }
    };

    // Закриваємо WebSocket при розмонтаженні компоненту
    return () => {
      socketRef.current.close();
    };
  }, []);

  // Відправка повідомлення
  const sendMessage = () => {
    if (input && socketRef.current) {
      socketRef.current.send(input); // Відправка введеного тексту
      setInput('');  // Очищення поля введення після відправки
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chat</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
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
