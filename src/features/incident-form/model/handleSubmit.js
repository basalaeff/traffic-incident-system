import { editIncidentById, pushIncident } from '@/features/incident-form/api/incidentFormAPI';
import { toast } from 'react-toastify';
import { useShowSuccess } from '@/features/incident-form/model/showSuccess';
import { FIELD_LIMITS } from '@/features/incident-form/model/fieldLimits';

export const useHandleSubmit = (
  setIsLoading,
  setIsEditMode,
  isEditMode,
  title,
  description,
  type,
  status,
  lat,
  lng,
  userId,
  id,
  incidentId,
  setIncidentId,
  setIncident
) => {
  const { showSuccess } = useShowSuccess(id, incidentId, setIsEditMode);
  // ============================================================================
  // ФУНКЦИЯ ОТПРАВКИ ФОРМЫ
  // ============================================================================
  const handleSubmit = async (e) => {
    // Нужно запретить перезагрузку страницы при отправке формы
    e.preventDefault();
    // Нужно заблокировать повторные запросы при тыканье на кнопку
    // Пока нет ответа. Новый запрос не будет отправлен
    setIsLoading(true);
    try {
      // Добавил валидация полей перед отправкой с лимитом
      if (title.length < FIELD_LIMITS.title.min) {
        throw new Error(`Заголовок должен содержать не менее ${FIELD_LIMITS.title.min} символов`); // [НОВОЕ] выброс ошибки
      }
      if (description.length < FIELD_LIMITS.description.min) {
        throw new Error(
          `Описание должно содержать не менее ${FIELD_LIMITS.description.min} символов`
        );
      }
      const now = new Date().toLocaleString('ru-RU');
      // буду генерировать id cам (безопасность, не нужен GET-запрос, чтобы достать id,
      // которое придумает json-server для переброса на детализацию
      // добавил условия сохранения текущего uuid при редактировании
      const uuid = isEditMode ? id : crypto.randomUUID();
      setIncidentId(uuid);
      if (isEditMode) {
        // put меняет все поля целиком, поэтому словив несколько ошибок при отображении
        // координат, я вспомнил про patch (частичное обновление)
        // ============================================================================
        // PATCH-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
        // ============================================================================
        await editIncidentById(id, { title, description, type, status });
        // копируем старые свойства в новый объект
        setIncident((prev) => ({
          ...prev,
          title: title,
          description: description,
          type: type,
          status: status,
        }));

        toast.success('Инцидент успешно обновлён!');
        showSuccess();
      } else {
        // ============================================================================
        // POST-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
        // ============================================================================
        await pushIncident({ id: uuid, type, title, description, lat, lng, time: now, userId });
        toast.success(`Инцидент добавлен!`);
        showSuccess();
      }
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

  return { handleSubmit };
};
