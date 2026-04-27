// Импортируем хук useState из библиотеки React.
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// нужно подключить метод для сохранения данных пользователя
import { loginUser, getCurrentUser } from '@/features/authentication/model/auth';
import { findUserByLogin } from '@/features/authentication/api/authAPI';
import bcrypt from 'bcryptjs';
import { FirstBlock } from '@/features/authentication/ui/FirstBlock';

// ============================================================================
// ФУНКЦИЯ ДЛЯ ЛОГИНА
// ============================================================================
// ({JS})
function Authentication({}) {
  const navigate = useNavigate(); //хук для переброса на главную
  // ============================================================================
  // ПЕРЕМЕННЫЕ СОСТОЯНИЙ
  // ============================================================================
  // Создам переменную состояния для хранения логина
  const [login, setLogin] = useState('');
  // ...и пароля
  const [password, setPassword] = useState('');
  // загрузка
  // false - загрузки нет, кнопка активна
  // true - загрузка есть, кнопка не активна
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      console.info('Current user: ', user);
      console.warn('Пользователь уже вошел');
      toast.warn('Вы уже вошли в аккаунт!');
      navigate('/');
    }
  }, []);

  // ============================================================================
  // ФУНКЦИЯ ОБРАБОТКИ ИЗМЕНЕНИЯ В ПОЛЕ LOGIN
  // ============================================================================
  // Вызывается каждый раз, когда происходит изменение в поле
  const handleLoginChange = (e) => {
    // Берем текущий текст из поля с помощью e.target.value
    setLogin(e.target.value);
  };
  // ============================================================================
  // ФУНКЦИЯ ОБРАБОТКИ ИЗМЕНЕНИЯ В ПОЛЕ PASSWORD
  // ============================================================================
  // Вызывается каждый раз, когда происходит изменение в поле
  const handlePasswordChange = (e) => {
    // Берем текущий текст из поля с помощью e.target.value
    setPassword(e.target.value);
  };
  // ============================================================================
  // ФУНКЦИЯ ОТПРАВКИ ФОРМЫ
  // ============================================================================
  const handleSubmit = async (e) => {
    // Нужно запретить перезагрузку страницы при отправке формы
    e.preventDefault();
    // Нужно заблокировать повторные запросы при тыканье на кнопку
    // Пока нет ответа. Новый запрос не будет отправлен
    setIsLoading(true);
    // Нужно написать запрос
    try {
      // Пользователь ввел логин
      // Нужно найти данные пользователя на сервере
      const response = await findUserByLogin(login);
      // ============================================================================
      // ПРОВЕРКА ЛОГИНА И ПАРОЛЯ
      // ============================================================================
      // если длина нулевая, значит ничего не нашлось
      if (response.data.length === 0) {
        throw new Error('Пользователь не найден!');
      }
      const user = response.data[0];
      const isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) {
        throw new Error('Неверный пароль!');
      }
      // сохранение
      loginUser(user);

      toast.success(`Успешный вход: ${login}`);
      // нужна задержка, чтобы пользователь посмотрел уведомление (3000)
      // поставим 4000
      setTimeout(() => {
        setIsLoading(false);
        // нужно направить пользователя на главную (useNavigate)
        navigate('/');
      }, 4000);

      // try
    } catch (err) {
      // Будем выводить ошибки в консоль
      // Первый параметр это префикс. Так удобнее
      console.error('Login error: ', err);
      // Выведем уведомление (3000)
      // Если что-то не так, то выведет второе (дефолтное)
      toast.error(err.message || 'Не удалось войти. Проверьте правильность данных.');
    }
    // catch
    // меняем состояние кнопки
    setTimeout(() => {
      setIsLoading(false); // нужно добавить переменную состояния
    }, 1000);
  };

  // ============================================================================
  // ОСНОВНОЙ ИНТЕРФЕЙС
  // ============================================================================
  // Пишем интерфейс на JSX
  return (
    <div className="page">
      <div className="card">
        <FirstBlock />
        <div className="second-block">
          <form onSubmit={handleSubmit}>
            <input
              className="input"
              type="login"
              value={login}
              // Надо зафиксировать изменения
              onChange={handleLoginChange}
              // Добавлю подсказку (исчезнет при вводе)
              placeholder="Логин"
              required //Обязательно для заполнения
            />
            <input
              className="input"
              type="password"
              value={password}
              // Надо зафиксировать изменения
              onChange={handlePasswordChange}
              // Добавлю подсказку (исчезнет при вводе)
              placeholder="Пароль"
              required //Обязательно для заполнения
            />

            {/* Нужно добавить кнопку отправки */}
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? (
                <div className="loading-button">
                  <div className="spinner-mini"></div>
                </div>
              ) : (
                'Войти'
              )}
            </button>
            {/* btn */}
          </form>
          <div className="footer">
            {/* Ссылка ведет на страницу регистрации */}
            Нет аккаунта? <Link to="/create-account">Зарегистрироваться</Link>
          </div>
          {/* footer */}
        </div>
        {/* second-block */}
      </div>
      {/* card */}
    </div>
    // page
  );
}
export default Authentication;
