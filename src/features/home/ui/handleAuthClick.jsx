// ============================================================================
// ДЛЯ АВТОРИЗАЦИИ/ВЫХОДА ПОЛЬЗОВАТЕЛЯ
// ============================================================================
import { getCurrentUser, logoutUser } from '@/features/authentication/model/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const useHandleAuthClick = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  // Состояние для отображения уведомления о выходе
  const [displayLogout, setDisplayLogout] = useState(false);

  const handleAuthClick = () => {
    if (user) {
      setDisplayLogout(true);
      toast(
        <div className="toast-notification">
          <p>Вы уверены, что хотите выйти?</p>
          <div className="home-toast-action">
            <button
              className="toast-btn toast-btn-cancel"
              // при нажатии отмены нужно просто закрыть уведомление
              // toast.dismiss() без аргументов закрывает последнее/активное уведомление
              onClick={() => {
                toast.dismiss();
                setDisplayLogout(false);
              }}
            >
              Отмена
            </button>
            <button
              className="toast-btn toast-btn-logout"
              onClick={() => {
                logoutUser();
                setDisplayLogout(false);
                window.location.reload();
              }}
            >
              Выйти
            </button>
          </div>
          {/* toast-action */}
        </div>, // дальше второй аргумент
        // toast-notification
        // Далее нужно настроить настройки поведения уведомления
        {
          // закрытие по таймеру выключено
          autoClose: false,
          // по клику закрыть нельзя
          closeOnClick: false,
          // и перетаскиванием тоже
          draggable: false,
          // крестик убрал тоже
          closeButton: false,
          // выведу снизу справа (по приколу)
          position: 'bottom-right',
          theme: 'dark',
        }
      );
    } else {
      navigate('/login'); // Если не вошел идем на логин
    }
  };
  return { handleAuthClick, displayLogout, user};
};
