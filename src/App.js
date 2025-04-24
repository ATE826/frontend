import React from 'react';
import WebSocketChat from './components/WebSocketChat';
import TCPClient from './components/TCPClient';
import './styles/theme.css'; // Импортируем общие стили

function App() {
  return (
    <div className="app-container theme-background"> {/* Применяем тематический класс */}
      <h1>Квантовая Сеть Межпланетной Торговли</h1>
      <div className="content-wrapper">
        <WebSocketChat />
        <TCPClient />
      </div>
    </div>
  );
}

export default App;