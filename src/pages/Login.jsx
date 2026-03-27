import './Login.css';
// Импортируем хук useState из библиотеки React.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
// ============================================================================
// ФУНКЦИЯ ДЛЯ ЛОГИНА
// ============================================================================
// ({JS})
function Login({}) {
  // ============================================================================
  // ПЕРЕМЕННЫЕ СОСТОЯНИЙ
  // ============================================================================
  // Создам переменную состояния для хранения почты
  const [email, setEmail] = useState('');
  // ...и пароля
  const [password, setPassword] = useState('');
  // ...а еще ошибок
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
            <button type="submit" className="btn-primary">
              Войти
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
