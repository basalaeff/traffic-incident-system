// Импортируем хук useState из библиотеки React.
import { useState, useEffect } from 'react';
// ссылки и навигация
// убрал Link (не использую ссылки в этом компоненте)
// добавил useLocation (нужно получать координаты с хома)
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// всплывающие уведомления тоже могут пригодиться
import { toast } from 'react-toastify';
// доступно только авторизированным пользователям
// получаем текущего пользователя
import { getCurrentUser } from '../features/authentication/model/auth';
import {
  editIncidentById,
  pushIncident,
} from '../features/incident-form/api/incidentFormAPI';
import { HomeBtn } from '@/shared/ui/HomeBtn';
import { useIncidentEdit } from '@/features/incident-form/model/fetchIncidentEdit';
import { useHandleChange } from '@/features/incident-form/model/handleChange';
import { FIELD_LIMITS } from '@/features/incident-form/model/fieldLimits';

import Swal from 'sweetalert2';

function IncidentForm() {
  const { id } = useParams();
  const navigate = useNavigate(); //хук для переброса на авторизацию
  const location = useLocation(); // хук для координат с хома
  const user = getCurrentUser();

  // ============================================================================
  // ПЕРЕМЕННЫЕ СОСТОЯНИЙ
  // ============================================================================
  // {
  //     "id": uuid(универсальный уникальный идентификатор),
  //     "type": "accident",
  //     "title": "ДТП на перекрестке",
  //     "description": "Столкнулись две машины, перекрыта полоса.",
  //     "lat": 55.751244,
  //     "lng": 37.618423,
  //     "status": "active",
  //     "userId": 1,
  //     "time": "21.03.2026",
  //   },
  const [incident, setIncident] = useState(null);
  const [incidentId, setIncidentId] = useState('');
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [userId, setUserId] = useState('');
  // загрузка
  // false - загрузки нет, кнопка активна
  // true - загрузка есть, кнопка не активна
  const [isLoading, setIsLoading] = useState(false);

  // ФЛАГ ДЛЯ РЕЖИМА РЕДАКТИРОВАНИЯ
  const [isEditMode, setIsEditMode] = useState(false);

  // добавлю возможность отмену сохранения данных при редактировании (новая фича)
  // СОСТОЯНИЕ ДЛЯ ХРАНЕНИЯ ИСХОДНЫХ ДАННЫХ
  const [originalIncident, setOriginalIncident] = useState(null);

  const { fetchIncidentEdit } = useIncidentEdit(
    id,
    setIsLoading,
    setIsEditMode,
    setIncident,
    setOriginalIncident,
    setTitle,
    setDescription,
    setStatus,
    setType,
    user
  );

  const {
    handleTypeChange,
    handleStatusChange,
    handleTitleChange,
    handleDescriptionChange,
  } = useHandleChange(setTitle, setDescription, setStatus, setType);

  // на данную страницу можно попасть через адресную строку (я так и сюда и зашел)
  // но это означает, что пользователь может сломать мне карту (ранее я указал 0, 0 в таких случаях)
  // но это решение лишь ставит маркер в море рядом в Африкой, а там вообще не дорог
  // надо писать запрет добавления вовсе и переброс на главную

  useEffect(() => {
    // проверка
    if (!id) {
      const hasCoords = location.state && 'lat' in location.state && 'lng' in location.state;
      if (!hasCoords) {
        toast.warn('Координаты не выбраны. ');
        navigate('/');
        return;
      }
      setLat(location.state.lat);
      setLng(location.state.lng);
    } else {
      fetchIncidentEdit();
    }
    // добавил условия для перезапуска
  }, [id, location.state, navigate]);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    } else {
      console.warn('Пользователь не авторизован');
      toast.warn('Форма добавления инцидентов доступна только авторизированным пользователям!');
      navigate('/login');
    }
  }, []);

  // ============================================================================
  // ФУНКЦИЯ СБРОСА ПОЛЕЙ
  // ============================================================================
  const handleReset = () => {
    // добавил сброс к оригинальным значениям
    if (isEditMode && originalIncident) {
      setType(originalIncident.type || '');
      setStatus(originalIncident.status || '');
      setTitle(originalIncident.title || '');
      setDescription(originalIncident.description || '');
      toast.info('Изменения отменены');
    } else {
      setType('');
      setDescription('');
      setTitle('');
    }
    setIsLoading(false);
  };

  const showSuccess = async () => {
    const result = await Swal.fire({
      icon: 'success',
      title: 'Успешно',
      showCancelButton: true,
      confirmButtonText: 'На главную',
      cancelButtonText: 'Вернуться к инциденту',
      confirmButtonColor: 'var(--status-normal)',
      cancelButtonColor: 'var(--status-danger)',
      allowOutsideClick: false, // Закрыть можно только кнопкой
      backdrop: 'rgba(0,0,0,0.4)', // Затемнение фона
      background: 'var(--bg-app)',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      navigate('/');
      setIsEditMode(false);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      navigate(`/incident/${incidentId ? incidentId : id}`);
      setIsEditMode(false);
    }
  };

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

  // Пишем интерфейс на JSX
  return (
    <div className="page">
      <div className="card">
        <div className="first-block">
          <HomeBtn />
          <h2>{isEditMode ? 'Редактирование' : 'Форма'}</h2>
          <div className="subtitle">
            {isEditMode ? 'Обновите информацию об инциденте' : 'Добавьте новый инцидент'}
          </div>
          {/* subtitle */}
        </div>
        {/* first-block */}
        <div className="second-block">
          <form onSubmit={handleSubmit}>
            <select className="input" value={type} onChange={handleTypeChange} required>
              <option value="">Тип инцидента</option>
              <option value="accident">ДТП</option>
              <option value="hazard">Опасный участок</option>
              <option value="other">Другое</option>
            </select>
            {isEditMode && (
              <select className="input" value={status} onChange={handleStatusChange} required>
                <option value="">Статус</option>
                <option value="active">Активный</option>
                <option value="inactive">Неактивный</option>
              </select>
            )}
            <textarea
              className="input"
              type="text"
              value={title}
              // Надо зафиксировать изменения
              onChange={handleTitleChange}
              // Добавлю подсказку (исчезнет при вводе)
              placeholder="Заголовок"
              required //Обязательно для заполнения
              // добавил ограничение максимального и минимального количества символов
              maxLength={FIELD_LIMITS.title.max}
              minLength={FIELD_LIMITS.title.min}
              title={`От ${FIELD_LIMITS.title.min} до ${FIELD_LIMITS.title.max} символов`}
            />
            <div className="char-counter">
              {title.length} / {FIELD_LIMITS.title.max}
            </div>
            <textarea
              className="input-description"
              type="text"
              value={description}
              // Надо зафиксировать изменения
              onChange={handleDescriptionChange}
              // Добавлю подсказку (исчезнет при вводе)
              placeholder="Описание"
              required //Обязательно для заполнения
              // добавил ограничение максимального и минимального количества символов
              maxLength={FIELD_LIMITS.description.max}
              minLength={FIELD_LIMITS.description.min}
              title={`От ${FIELD_LIMITS.description.min} до ${FIELD_LIMITS.description.max} символов`}
            />
            <div className="char-counter">
              {description.length} / {FIELD_LIMITS.description.max}
            </div>
            <div className="group-btn">
              <button type="button" className="btn" onClick={handleReset}>
                {isEditMode ? 'Отмена' : 'Очистить'}
              </button>
              <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? (
                  <div className="loading-button">
                    <div className="spinner-mini"></div>
                  </div>
                ) : isEditMode ? (
                  'Обновить'
                ) : (
                  'Сохранить'
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
    // form-page
  );
}
export default IncidentForm;
