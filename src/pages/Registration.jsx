// стили
import './Registration.css';
// Импортируем хук useState из библиотеки React.
import { useState, useEffect } from 'react';
// ссылки и навигация
import { Link, useNavigate } from 'react-router-dom';
// всплывающие уведомления тоже могут пригодиться
import { toast } from 'react-toastify';
// запросы
import axios from 'axios';
// доступно только авторизированным пользователям
// получаем текущего пользователя
import { getCurrentUser } from '../auth';

function Registration() {
  const navigate = useNavigate(); //хук для переброса на авторизацию
  // {
  //     "id": 1,
  //     "email": "test@user.com",
  //     "password": "12345"
  //   },

  // id добавляется автоматически
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

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
  // ФУНКЦИЯ ОБРАБОТКИ ИЗМЕНЕНИЯ В ПОЛЕ PASSWORD REPEAT
  // ============================================================================
  // Вызывается каждый раз, когда происходит изменение в поле
  const handleRepeatPasswordChange = (e) => {
    // Берем текущий текст из поля с помощью e.target.value
    setRepeatPassword(e.target.value);
  };

  // ============================================================================
  // ФУНКЦИЯ СБРОСА ПОЛЕЙ
  // ============================================================================
  const handleReset = () => {
    setEmail('');
    setPassword('');
    setRepeatPassword('');
    setIsLoading(false);
  };
  // ============================================================================
  // ФУНКЦИЯ ОТПРАВКИ ФОРМЫ
  // ============================================================================
  const handleSubmit = async (e) => {
    // Нужно запретить перезагрузку страницы при отправке формы
    e.preventDefault();
    // При регистрации пользователя выявлены следующие проблемы:
    // 1) Почта может быть не уникальной
    // 2) Пароль может быть любым (даже один символ)
    // 3) Поля пароль и повторить пароль не связаны
    if (password.length < 8) {
      toast.error('Пароль должен содержать минимум 8 символов!');
      return;
    }
    if (password != repeatPassword) {
      toast.error('Пароли не совпадают!');
      return;
    }

    // Нужно заблокировать повторные запросы при тыканье на кнопку
    // Пока нет ответа. Новый запрос не будет отправлен
    setIsLoading(true);
    try {
      // Сделаем так чтобы почта была уникальной
      // ============================================================================
      // GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/users
      // ============================================================================
      // делаем максимально просто
      // запрашиваем введенную почту у сервера из db.json
      // если получили данные, значит почта уже существует, тогда выводим ошибку
      const checkResponse = await axios.get(`http://localhost:3001/users?email=${email}`);
      // если длина > 0, тогда данные есть
      if (checkResponse.data.length > 0) {
        throw new Error('Этот пользователь уже зарегистрирован!');
      }
      // ============================================================================
      // POST-ЗАПРОС НА СЕРВЕР http://localhost:3001/users
      // ============================================================================
      await axios.post('http://localhost:3001/users', {
        email,
        password,
      });

      toast.success(`Пользователь зарегистрирован!`);
      // нужна задержка, чтобы пользователь посмотрел уведомление (3000)
      // поставим 4000
      setTimeout(() => {
        // нужно направить пользователя на главную (useNavigate)
        navigate('/login');
      }, 4000);
      // try
    } catch (err) {
      // Будем выводить ошибки в консоль
      // Первый параметр это префикс. Так удобнее
      console.error('Form error: ', err);
      // Выведем уведомление (3000)
      // Если что-то не так, то выведет второе (дефолтное)
      toast.error(err.message || 'Не удалось добавить инцидент. Проверьте правильность данных.');
    } finally {
      // меняем состояние кнопки
      setTimeout(() => {
        setIsLoading(false); // нужно добавить переменную состояния
      }, 1000);
    }
  };
  // Пишем интерфейс на JSX
  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <h2>Зарегистрируйте ваш новый аккаунт</h2>
        </div>
        {/* form-header */}
        <div className="form">
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
            <input
              className="form-input"
              type="password"
              value={repeatPassword}
              // Надо зафиксировать изменения
              onChange={handleRepeatPasswordChange}
              // Добавлю подсказку (исчезнет при вводе)
              placeholder="Повторите пароль"
              required //Обязательно для заполнения
            />
            <div className="group-btn">
              <button type="button" className="btn" onClick={handleReset}>
                Очистить
              </button>
              <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? (
                  <div className="loading-button">
                    <div className="spinner-mini"></div>
                  </div>
                ) : (
                  'Зарегистрироваться'
                )}
              </button>
              {/* btn*/}
            </div>
            {/* group-btn */}
          </form>
        </div>
        {/* form */}
      </div>
      {/* form-card */}
    </div>
    // form-page
  );
}
export default Registration;
