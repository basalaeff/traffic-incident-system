// ============================================================================
// ЗАГРУЗКА ДАННЫХ С СЕРВЕРА (API)
// ============================================================================
// Нужен хук useEffect()
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { loadIncidents, loadUsers } from '@/features/home/api/homeAPI';

export const useIncidentsAndUsers = () => {
  // Создадим массив для хранения инцидентов
  const [incidents, setIncidents] = useState([]);

  // Создадим массив для хранения юзеров
  const [users, setUsers] = useState(null);

  useEffect(() => {

    // Нужно написать асинхронную функцию для запроса данных с сервера
    // Данные могут приходить с задержкой.
    //Буду использовать ключевое слово async, из него буду брать await (для ожидания)
    const fetchData = async () => {
      // так при запросе серверу все может упасть. нужна обработка ошибок
      try {
        // GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
        const responseIncidents = await loadIncidents();
        // Теперь нужно добавить данные в массив для хранения инцидентов
        setIncidents(responseIncidents.data);
        // ============================================================================
        // GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/user
        // ============================================================================
        const responseUsers = await loadUsers();
        setUsers(responseUsers.data);
      } catch (err) {
        // Выводим ошибку в консоль разработчика
        // Будем выводить ошибки в консоль
        // Первый параметр это префикс. Так удобнее
        console.error('Ошибка загрузки инцидентов: ', err);
        // Выведем уведомление (3000)
        // Если что-то не так, то выведет второе (дефолтное)
        toast.error(err.message || 'Ошибка загрузки инцидентов');
      }
    };
    // Нужно запустить функцию
    fetchData();
    return () => {
      // Очистка данных при размонтировании компонента
      setIncidents([]);
      setUsers(null);
    };
  }, []);
  return { incidents, users };
};
