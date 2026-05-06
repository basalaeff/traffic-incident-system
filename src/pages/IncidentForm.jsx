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
import { HomeBtn } from '@/shared/ui/HomeBtn';
import { useIncidentEdit } from '@/features/incident-form/model/fetchIncidentEdit';
import { useHandleChange } from '@/features/incident-form/model/handleChange';
import { FIELD_LIMITS } from '@/features/incident-form/model/fieldLimits';
import { useHandleReset } from '@/features/incident-form/model/handleReset';
import { useHandleSubmit } from '@/features/incident-form/model/handleSubmit';

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

  const { handleTypeChange, handleStatusChange, handleTitleChange, handleDescriptionChange } =
    useHandleChange(setTitle, setDescription, setStatus, setType);

  const { handleReset } = useHandleReset(
    isEditMode,
    originalIncident,
    setType,
    setStatus,
    setTitle,
    setDescription,
    setIsLoading
  );

  const { handleSubmit } = useHandleSubmit(
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
  );

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
