import React, { useState, useEffect, useRef } from 'react';
import '../styles/theme.css'; // Импортируем стили

function WebSocketChat() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef(null); // Используем useRef для хранения WebSocket объекта

    useEffect(() => {
        // Устанавливаем соединение при монтировании компонента
        // Используем ws:// для локального HTTP, wss:// для HTTPS
        const websocketUrl = `ws://localhost:8080/ws`;
        ws.current = new WebSocket(websocketUrl);

        ws.current.onopen = () => {
            console.log('Подключено к аукционному терминалу.');
            setIsConnected(true);
        };

        ws.current.onmessage = (event) => {
            // Добавляем новое сообщение в список
            console.log('Получено сообщение:', event.data);
            setMessages(prevMessages => [...prevMessages, event.data]);
        };

        ws.current.onerror = (error) => {
            console.error('Ошибка WebSocket:', error);
            setIsConnected(false);
        };

        ws.current.onclose = (event) => {
            console.log('Отключено от аукционного терминала:', event.code, event.reason);
            setIsConnected(false);
            // Попытка переподключения через некоторое время (опционально)
            // setTimeout(() => {
            //     console.log('Попытка переподключения...');
            //     // Здесь можно добавить логику для переподключения
            // }, 5000);
        };

        // Функция очистки: закрываем соединение при размонтировании компонента
        return () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.close();
                console.log('WebSocket соединение закрыто.');
            }
        };
    }, []); // Пустой массив зависимостей означает, что эффект выполняется один раз при монтировании и один раз при размонтировании

    const sendMessage = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            console.log('Отправка сообщения:', inputMessage);
            ws.current.send(inputMessage);
            setInputMessage(''); // Очищаем поле ввода
        } else {
            console.warn('WebSocket не подключен.');
        }
    };

    const handleInputChange = (event) => {
        setInputMessage(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="chat-container theme-terminal"> {/* Применяем тематические классы */}
            <h2>Терминал Межзвездных Аукционов</h2>
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                Статус: {isConnected ? 'Подключено' : 'Отключено'}
            </div>
            <div className="messages-window theme-window"> {/* Применяем тематические классы */}
                {messages.map((msg, index) => (
                    <p key={index} className="message">{msg}</p>
                ))}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Сделать ставку или отправить сообщение..."
                    className="theme-input" {/* Применяем тематический класс */}
                />
                <button onClick={sendMessage} disabled={!isConnected} className="theme-button"> {/* Применяем тематический класс */}
                    Отправить
                </button>
            </div>
        </div>
    );
}

export default WebSocketChat;