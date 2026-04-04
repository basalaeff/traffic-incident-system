// стили
import './IncidentDetail.css';
//  Нужен хук, чтобы доставать id из ссылки
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// добавлю любимые всплывающие уведомления
import { toast } from 'react-toastify';
// запросы
import axios from 'axios';
// нужен текущий юзер в системе
import { getCurrentUser } from '../auth';

function IncidentDetail() {
  // Достаем id c помощью хука
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Создадим массив для хранения инцидента
  const [incident, setIncident] = useState(null);
  // храним юзера-владельца
  // только этому юзеру можно редактировать
  const [owner, setOwner] = useState(null);

  // загрузка
  const [isLoading, setIsLoading] = useState(false);
  // состояние для подтверждения удаления
  const [showDelete, setShowDelete] = useState(false);

  // Режим редактирования
  const [isEditing, setIsEditing] = useState(false);

  // состояния для редактируемых полей (разрешено только 3 поля)
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    const fetchIncidents = async () => {
      setIsLoading(true);
      try {
        // ============================================================================
        // GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
        // ============================================================================
        const responseIncidents = await axios.get(`http://localhost:3001/incidents/${id}`);
        setIncident(responseIncidents.data);

        // Нужно, чтобы при редактировании в полях был текст
        setEditTitle(responseIncidents.data?.title || '');
        setEditDescription(responseIncidents.data?.description || '');
        setEditStatus(responseIncidents.data?.status || '');

        // проверка перед запросом
        if (responseIncidents.data?.userId) {
          // ============================================================================
          // GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/user
          // ============================================================================
          const responseOwner = await axios.get(
            `http://localhost:3001/users/${responseIncidents.data.userId}`
          );
          setOwner(responseOwner.data);
        } else {
          toast.error(`Ошибка загрузки пользователя: ${error.message}`);
        }
        setIsLoading(false);
      } catch (err) {
        console.error(`Ошибка загрузки инцидента:`, err.response?.data?.message);
        toast.error(`Ошибка загрузки инцидента: ${err.response?.data?.message}`);
        if (err.response?.status === 404) navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncidents();
  }, [id]);
  // перезапускается при изменении id

  // ============================================================================
  // ОБРАБОТЧИК ДЛЯ СОХРАНЕНИЯ ИЗМЕНЕНИЯ
  // ============================================================================
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // put меняет все поля целиком, поэтому словив несколько ошибок при отображении
      // координат, я вспомнил про patch (частичное обновление)
      // ============================================================================
      // PATCH-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
      // ============================================================================
      await axios.patch(`http://localhost:3001/incidents/${id}`, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
      });

      // копируем старые свойства в новый объект
      setIncident((prev) => ({
        ...prev,
        title: editTitle,
        description: editDescription,
        status: editStatus,
      }));
      toast.success('Инцидент успешно обновлён!');
      setIsEditing(false);
    } catch (err) {
      toast.error(`Не удалось сохранить изменения: ${err.response?.data?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // ОБРАБОТЧИК ДЛЯ УДАЛЕНИЯ
  // ============================================================================
  // Основная проблема: моментальное удаление без подтверждения от пользователя.
  // Кажется через toast это можно сделать

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
                setIsLoading(true);
                // ============================================================================
                // DELETE-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
                // ============================================================================
                await axios.delete(`http://localhost:3001/incidents/${id}`);

                toast.success('Инцидент успешно удален!', {
                  onClose: () => navigate('/'),
                });
                setIsEditing(false);
              } catch (err) {
                toast.error(`Не удалось удалить инцидент: ${err.response?.data?.message}`);
              } finally {
                setIsLoading(false);
                setShowDelete(false);
                toast.dismiss();
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

  // ============================================================================
  // РЕНДЕРИНГ
  // ============================================================================
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
      </div>
    );
  }

  // Пишем интерфейс на JSX
  return (
    <div className="detail-page">
      <div className="detail-home-btn-container">
        <button
          className="detail-home-btn"
          onClick={() => {
            navigate('/');
          }}
          title="Главная"
        >
          <img src="https://s.kontur.ru/common-v2/icons-ui/black/building-home/building-home-32-Regular.svg" />
        </button>
        {/* detail-home-btn */}
      </div>
      {/* detail-home-btn-container */}
      <div className="detail-card">
        <div className="detail-header">
          <h2>Детали инцидента </h2>
          <div className="detail-btn">
            {/* Кнопка редактировать */}
            {user?.id === incident?.userId && !isEditing && !showDelete && (
              // скрываем во время редактирования
              <button
                className="detail-circle-btn"
                title="Редактировать"
                onClick={() => setIsEditing(true)}
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                <img src="https://s.kontur.ru/common-v2/icons-ui/black/tool-pencil-line/tool-pencil-line-32-Regular.svg" />
              </button>
            )}

            {/* Кнопка отмена */}
            {user?.id === incident?.userId && isEditing && !showDelete && (
              <button
                className="detail-circle-btn"
                title="Отмена"
                onClick={() => setIsEditing(false)}
                style={{ backgroundColor: 'var(--danger-color)' }}
              >
                <img src="https://s.kontur.ru/common-v2/icons-ui/black/x-circle/x-circle-32-Regular.svg" />
              </button>
            )}

            {/* Кнопка удалить */}
            {user?.id === incident?.userId && !isEditing && !showDelete && (
              <button
                className="detail-circle-btn"
                title="Удалить"
                onClick={handleDelete}
                style={{ backgroundColor: 'var(--danger-color)' }}
              >
                <img src="https://s.kontur.ru/common-v2/icons-ui/black/trash-can/trash-can-32-Regular.svg" />
              </button>
            )}
          </div>
          {/* detail-btn */}
        </div>
        {/* detail-header */}
        <div className="detail">
          <div className="detail-title">
            {isEditing ? (
              <input
                type="text"
                className="edit-input detail-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Введите название инцидента"
              />
            ) : (
              incident?.title
            )}
          </div>
          {/* edit-input detail-title */}
          <div className="detail-description">
            {isEditing ? (
              <textarea
                type="text"
                className="edit-input detail-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Опишите ситуацию"
                rows={4}
              />
            ) : (
              incident?.description
            )}
          </div>
          {/* edit-input detail-description */}
          <table className="detail-table">
            <tbody>
              <tr>
                <td>Тип инцидента</td>
                <td>{incident?.type}</td>
              </tr>
              <tr>
                <td>Широта</td>
                <td>{incident?.lat}</td>
              </tr>
              <tr>
                <td>Долгота</td>
                <td>{incident?.lng}</td>
              </tr>
              <tr>
                <td>Пользователь</td>
                <td>{owner?.login}</td>
              </tr>
              <tr>
                <td>Время</td>
                <td>
                  {incident?.time}
                  {/* detail-time */}
                </td>
              </tr>
              <tr>
                <td>Статус</td>
                <td>
                  {isEditing ? (
                    <select
                      className="edit-select"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="active">Активный</option>
                      <option value="inactive">Неактивный</option>
                    </select>
                  ) : (
                    <span>{incident?.status === 'active' ? 'Активный' : 'Неактивный'}</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          {/* detail-table */}
          {/* Кнопка сохранить */}
          {user?.id === incident?.userId && isEditing && !showDelete && (
            <button className="btn" title="Сохранить" onClick={handleSave}>
              Сохранить
            </button>
          )}
        </div>
        {/* detail */}
      </div>
      {/* detail-card */}
    </div>
    // detail-page
  );
}

export default IncidentDetail;
