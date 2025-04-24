import React, { useState } from 'react';
import '../styles/theme.css'; // Импортируем стили

function TCPClient() {
    const [contractData, setContractData] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendContract = async () => {
        setIsLoading(true);
        setResponse('Отправка контракта...');
        try {
            // Отправляем POST запрос на наш Go бэкенд эндпоинт
            const res = await fetch('/sign-contract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain', // Отправляем как простой текст
                },
                body: contractData, // Тело запроса - данные контракта
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.text(); // Читаем ответ как текст
            setResponse(`Ответ Терминала Контрактов: ${data}`);
            console.log('Получен ответ по контракту:', data);

        } catch (error) {
            console.error("Ошибка при отправке контракта:", error);
            setResponse(`Ошибка при отправке контракта: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (event) => {
        setContractData(event.target.value);
    };

    const handleKeyPress = (event) => {
         if (event.key === 'Enter') {
             sendContract();
         }
     };

    return (
        <div className="tcp-container theme-terminal"> {/* Применяем тематические классы */}
            <h2>Терминал Межгалактических Контрактов</h2>
            <div className="input-area">
                <textarea
                    value={contractData}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Введите условия контракта..."
                    rows="4"
                    cols="50"
                    className="theme-input" {/* Применяем тематический класс */}
                />
            </div>
            <button onClick={sendContract} disabled={isLoading} className="theme-button"> {/* Применяем тематический класс */}
                {isLoading ? 'Подписание...' : 'Подписать Контракт'}
            </button>
            {response && (
                <div className="response-area theme-window"> {/* Применяем тематические классы */}
                    <h3>Статус Контракта:</h3>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}

export default TCPClient;