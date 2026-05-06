// нужно подключить метод для сохранения данных пользователя
import { loginUser } from '@/features/authentication/model/auth';
import { findUserByLogin } from '@/features/authentication/api/authAPI';
import bcrypt from 'bcryptjs';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const useHandleSubmit = (setIsLoading, login, password) => {
  const navigate = useNavigate(); //хук для переброса на главную
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
  return { handleSubmit };
};
