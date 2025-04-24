import React, { useState } from 'react';
import '../styles/theme.css'; // Импортируем стили

function TCPClient() {
    const [contractData, setContractData] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendContract = async () => {
        if (!contractData.trim()) { // Проверяем, что поле ввода не пустое
            setResponse('Введите условия контракта.');
            return;
        }

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
                // Попытаемся прочитать ошибку из тела ответа, если доступно
                const errorText = await res.text().catch(() => res.statusText);
                throw new Error(`HTTP error! Status: ${res.status}. Details: ${errorText}`);
            }

            const data = await res.text(); // Читаем ответ как текст
            setResponse(`Ответ Терминала Контрактов: ${data}`);
            console.log('Получен ответ по контракту:', data);
            setContractData(''); // Очищаем поле ввода после успешной отправки

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
         if (event.key === 'Enter' && !event.shiftKey) { // Отправляем по Enter, но не по Shift+Enter
             event.preventDefault(); // Предотвращаем ввод новой строки в textarea
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
                    className="theme-input"
                /> {/* Применяем тематический класс */}
            </div>
            <button onClick={sendContract} disabled={isLoading || contractData.trim() === ''} className="theme-button">
                {isLoading ? 'Подписание...' : 'Подписать Контракт'} {/* Применяем тематический класс */}
            </button>
            {/* Область вывода ответа */}
            {response && (
                <div className="response-area theme-window">
                    <h3>Статус Контракта:</h3>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}

export default TCPClient;