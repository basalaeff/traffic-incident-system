import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useHandleSubmit } from '@/features/authentication/model/useHandleSubmit';

export const SecondBlock = () => {
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

  const { handleSubmit } = useHandleSubmit(setIsLoading, login, password);

  return (
    <div className="second-block">
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="login"
          value={login}
          // Надо зафиксировать изменения
          onChange={(e) => setLogin(e.target.value)}
          // Добавлю подсказку (исчезнет при вводе)
          placeholder="Логин"
          required //Обязательно для заполнения
        />
        <input
          className="input"
          type="password"
          value={password}
          // Надо зафиксировать изменения
          onChange={(e) => setPassword(e.target.value)}
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
    // second-block
  );
};
export default SecondBlock;
