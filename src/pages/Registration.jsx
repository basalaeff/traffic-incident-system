// Импортируем хук useState из библиотеки React.
import { useState, useEffect } from 'react';
// навигация
import { useNavigate } from 'react-router-dom';
// всплывающие уведомления тоже могут пригодиться
import { toast } from 'react-toastify';
// запросы
import axios from 'axios';
// доступно только авторизированным пользователям
// получаем текущего пользователя
import { getCurrentUser } from '../auth';
import bcrypt from 'bcryptjs';

function Registration() {
  const navigate = useNavigate(); //хук для переброса на авторизацию
  // {
  //     "id": 1,
  //     "login": "test",
  //     "password": "12345"
  //   },

  const [login, setLogin] = useState('');
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
    setLogin('');
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
    // 1) Логин может быть не уникальным
    // 2) Пароль может быть любым (даже один символ)
    // 3) Поля пароль и повторить пароль не связаны
    // 4) Пользователь вводит почту и пароль, однако он узнает, что почта уже существует
    // только после того как введет пароль и пройдет все проверки,
    //  т.е сначала происходит проверка 2 и 3 поля, а только потом 1. Это не последовательно
    // 5) Пароли хранятся в db.json и их можно увидеть. Добавим хеширование пароля и будем сравнивать хеши.
    // Хеширование это как превращать яблоки в яблочный сок (получать из сока яблоко будет сложновато)
    // npm install bcryptjs

    // Нужно заблокировать повторные запросы при тыканье на кнопку
    // Пока нет ответа. Новый запрос не будет отправлен
    setIsLoading(true);
    try {
      // Сделаем так чтобы логин был уникальным
      // ============================================================================
      // GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/users
      // ============================================================================
      // делаем максимально просто
      // запрашиваем введенный логин у сервера из db.json
      // если получили данные, значит логин уже существует, тогда выводим ошибку
      const checkResponse = await axios.get(`http://localhost:3001/users?login=${login}`);
      // если длина > 0, тогда данные есть
      if (checkResponse.data.length > 0) {
        throw new Error('Этот пользователь уже зарегистрирован!');
      }
      if (password.length < 8) {
        throw new Error('Пароль должен содержать минимум 8 символов!');
        return;
        // обязательно finally
      }
      if (password != repeatPassword) {
        throw new Error('Пароли не совпадают!');
        return;
        // обязательно finally
      }
      // Хеширование пароля
      // это соль. Нужна, чтобы подсолить в пароль случайных символов
      // делает хеши одинаковых паролей разными
      // у каждого пользователя своя уникальная соль
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const uuid = crypto.randomUUID();

      // ============================================================================
      // POST-ЗАПРОС НА СЕРВЕР http://localhost:3001/users
      // ============================================================================
      await axios.post('http://localhost:3001/users', {
        id: uuid,
        login,
        password: hashedPassword,
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
    <div className="page">
      <div className="card">
        <div className="first-block">
          <button
            className="home-btn"
            onClick={() => {
              navigate('/');
            }}
            title="Главная"
          >
            <img src="https://s.kontur.ru/common-v2/icons-ui/black/building-home/building-home-32-Regular.svg" />
          </button>
          {/* home-btn */}
          <h2>Регистрация</h2>
          <div className="subtitle ">Зарегистрируйте ваш новый аккаунт</div>
          {/* subtitle  */}
        </div>
        {/* form-header */}
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
            <input
              className="input"
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
        {/* second-block */}
      </div>
      {/* card */}
    </div>
    // page
  );
}
export default Registration;
