// Импортируем хук useState из библиотеки React.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// нужно подключить метод для сохранения данных пользователя
import { getCurrentUser } from '@/features/authentication/model/auth';
import { FirstBlock } from '@/features/authentication/ui/FirstBlock';
import { SecondBlock } from '@/features/authentication/ui/SecondBlock';

// ============================================================================
// ФУНКЦИЯ ДЛЯ ЛОГИНА
// ============================================================================
// ({JS})
function Authentication({}) {
  const navigate = useNavigate(); //хук для переброса на главную
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
  // ОСНОВНОЙ ИНТЕРФЕЙС
  // ============================================================================
  // Пишем интерфейс на JSX
  return (
    <div className="page">
      <div className="card">
        <FirstBlock />
        <SecondBlock />
      </div>
      {/* card */}
    </div>
    // page
  );
}
export default Authentication;
