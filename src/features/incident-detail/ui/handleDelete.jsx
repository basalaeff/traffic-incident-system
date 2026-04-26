// ============================================================================
// ОБРАБОТЧИК ДЛЯ УДАЛЕНИЯ
// ============================================================================
// Основная проблема: моментальное удаление без подтверждения от пользователя.
// Кажется через toast это можно сделать

import { toast } from 'react-toastify';
import { deleteIncidentById } from '@/features/incident-detail/api/incidentDetailAPI';

export const useDelete = (id, setIsLoading, navigate, setShowDelete) => {
  const handleDelete = async () => {
    setShowDelete(true);
    toast(
      <div className="toast-notification">
        <p>Вы уверены, что хотите удалить инцидент?</p>
        <div className="toast-action">
          <button
            className="toast-btn toast-btn-cancel"
            // при нажатии отмены нужно просто закрыть уведомление
            // toast.dismiss() без аргументов закрывает последнее/активное уведомление
            onClick={() => {
              toast.dismiss();
              setShowDelete(false);
            }}
          >
            Отмена
          </button>
          <button
            className="toast-btn toast-btn-delete"
            onClick={async () => {
              try {
                toast.dismiss();
                setIsLoading(true);
                // ============================================================================
                // DELETE-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
                // ============================================================================
                await deleteIncidentById(id);

                toast.success('Инцидент успешно удален!', {
                  onClose: () => navigate('/'),
                });
              } catch (err) {
                toast.error(`Не удалось удалить инцидент: ${err.response?.data?.message}`);
              } finally {
                setIsLoading(false);
                setShowDelete(false);
              }
            }}
          >
            Удалить
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
      }
    );
  };
  return { handleDelete };
};

export default useDelete;
