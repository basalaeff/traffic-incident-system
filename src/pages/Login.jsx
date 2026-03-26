import './Login.css';
// Импортируем хук useState из библиотеки React.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {toast} from 'react-toastify';

function Login() {
  // ============================================================================
  // ПЕРЕМЕННЫЕ СОСТОЯНИЙ
  // ============================================================================
  // Создам переменную состояния для хранения почты
  const [email, setEmail] = useState('');
  // ...и пароля
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Попытка входа:', { email, password });
    toast.info(`Попытка входа!\nEmail: ${email}\nПароль: ${password}`);
    // Нужно написать условия
    
    // Если всё норм, очищаем ошибку
    setError('');
    toast.success(`Вход: ${email}`);
    // Нужно написать логику отправки на сервер
  };
  // ============================================================================
  // ОСНОВНОЙ ИНТЕРФЕЙС
  // ============================================================================
  // Пишем интерфейс на JSX
  return (
    <div className="login-page">
      <div className="login-card">
        <h2>🔐 Вход в систему</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">
              Email
            </label>
            <input
              // Свяжем поле ввода с заголовком. Теперь можно тыкнуть на название поля и курсор перепрыгнет в поле
              id="email-input"
              className="form-input"
              type="email"
              value={email}
              // Надо зафиксировать изменения
              onChange={handleEmailChange}
              // Добавлю подсказку (исчезнет при вводе)
              placeholder="user@test.com"
              required //Обязательно для заполнения
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              Password
            </label>
            <input
              id="password-input"
              className="form-input"
              type="password"
              value={password}
              // Надо зафиксировать изменения
              onChange={handlePasswordChange}
              // Добавлю подсказку (исчезнет при вводе)
              placeholder="********"
              required //Обязательно для заполнения
            />
          </div>
          {/* Нужно добавить кнопку отправки */}
          <button type="submit" className="btn-primary">
            Войти
          </button>
        </form>
        <div className="login-footer">
          {/* Ссылка ведет на страницу регистрации */}
          Нет аккаунта? <Link to="/create-account">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}
export default Login;
