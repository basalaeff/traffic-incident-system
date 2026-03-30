import './Login.css';
// Импортируем хук useState из библиотеки React.
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
// нужно подключить метод для сохранения данных пользователя
import { loginUser, getCurrentUser } from '../auth';
import bcrypt from 'bcryptjs';

// ============================================================================
// ФУНКЦИЯ ДЛЯ ЛОГИНА
// ============================================================================
// ({JS})
function Login({}) {
  const navigate = useNavigate(); //хук для переброса на главную
  // ============================================================================
  // ПЕРЕМЕННЫЕ СОСТОЯНИЙ
  // ============================================================================
  // Создам переменную состояния для хранения почты
  const [email, setEmail] = useState('');
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
  // ФУНКЦИЯ ОБРАБОТКИ ИЗМЕНЕНИЯ В ПОЛЕ EMAIL
  // ============================================================================
  // Вызывается каждый раз, когда происходит изменение в поле
  const handleEmailChange = (e) => {
    // Берем текущий текст из поля с помощью e.target.value
    setEmail(e.target.value);
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
      // Пользователь ввел email
      // Нужно найти данные пользователя на сервере
      // ============================================================================
      // GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/users
      // ============================================================================
      const response = await axios.get(`http://localhost:3001/users?email=${email}`);
      // ============================================================================
      // ПРОВЕРКА ПОЧТЫ И ПАРОЛЯ
      // ============================================================================
      // если длина нулевая, значит ничего не нашлось
      if (response.data.length === 0) {
        throw new Error('Пользователь с таким email не найден');
      }
      const user = response.data[0];
      const isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) {
        throw new Error('Неверный пароль');
      }
      // сохранение
      loginUser(user);

      toast.success(`Успешный вход: ${email}`);
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
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>🔐 Вход </h2>
          <p className="login-subtitle">Используйте ваш аккаунт</p>
          <div className="one-footer">
            <Link to="/">На главную</Link>
          </div>
          {/* one-footer */}
        </div>
        {/* login-header */}
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <input
              className="form-input"
              type="email"
              value={email}
              // Надо зафиксировать изменения
              onChange={handleEmailChange}
              // Добавлю подсказку (исчезнет при вводе)
              placeholder="Электронная почта"
              required //Обязательно для заполнения
            />
            <input
              className="form-input"
              type="password"
              value={password}
              // Надо зафиксировать изменения
              onChange={handlePasswordChange}
              // Добавлю подсказку (исчезнет при вводе)
              placeholder="Пароль"
              required //Обязательно для заполнения
            />
            <p
              className="login-subtitle"
              onClick={() =>
                toast.info(
                  'Пока вы не можете восстановить доступ к аккаунту. У нас недостаточно информации для того, чтобы определить, принадлежит ли он вам.'
                )
              }
              style={{ cursor: 'pointer' }} // чтобы было видно, что можно кликнуть
            >
              Забыли пароль?
            </p>
            {/* login-subtitle */}
            {/* Нужно добавить кнопку отправки */}
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <div className="loading-button">
                  <div className="spinner-mini"></div>
                </div>
              ) : (
                'Войти'
              )}
            </button>
            {/* btn-primary */}
          </form>
          <div className="two-footer">
            {/* Ссылка ведет на страницу регистрации */}
            Нет аккаунта? <Link to="/create-account">Зарегистрироваться</Link>
          </div>
          {/* two-footer */}
        </div>
        {/* login-form */}
      </div>
      {/* login-card */}
    </div>
    // login-page
  );
}
export default Login;
