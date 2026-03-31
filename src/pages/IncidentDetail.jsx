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
  const [incident, setIncident] = useState([]);
  // храним юзера-владельца
  // только этому юзеру можно редактировать
  const [owner, setOwner] = useState([]);

  // загрузка
  const [isLoading, setIsLoading] = useState(false);

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
          toast.error('Ошибка загрузки данных во втором запросе');
        }
        setIsLoading(false);
      } catch (err) {
        console.error(`Ошибка загрузки данных:`, err);
        toast.error('Ошибка загрузки данных');
        toast.error(err.message);
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
      // ============================================================================
      // PUT-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
      // ============================================================================
      await axios.put(`http://localhost:3001/incidents/${id}`, {
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
      toast.error('Не удалось сохранить изменения');
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
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
      <div className="detail-floating-btns">
        {user?.id === incident?.userId && !isEditing && (
          // скрываем во время редактирования
          <button
            className="circle-btn"
            title="Редактировать"
            onClick={() => setIsEditing(true)}
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            <img src="https://s.kontur.ru/common-v2/icons-ui/black/tool-pencil-line/tool-pencil-line-32-Regular.svg" />
          </button>
        )}
      </div>
      {/* detail-floating-btns */}
      <div className="detail-card">
        <div className="detail-header">
          <h2>Детали инцидента </h2>
        </div>
        {/* detail-header */}
        <div className="detail">
          <div className="detail-title">
            {isEditing ? (
              <input
                type="text"
                className="edit-input, detail-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Введите название инцидента"
              />
            ) : (
              incident?.title
            )}
          </div>
          {/* detail-title */}
          <div className="detail-description">
            {isEditing ? (
              <textarea
                type="text"
                className="edit-input, detail-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Опишите ситуацию"
                rows={4}
              />
            ) : (
              incident?.description
            )}
          </div>
          {/* detail-description */}
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
                <td>{owner?.email}</td>
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
                    <span>
                      {incident?.status === 'active' ? 'Активный' : 'Неактивный'}
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          {/* detail-table */}
        </div>
        {/* detail */}
      </div>
      {/* detail-card */}
    </div>
    // detail-page
  );
}
export default IncidentDetail;
