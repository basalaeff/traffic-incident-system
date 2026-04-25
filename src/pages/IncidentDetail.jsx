//  Нужен хук, чтобы доставать id из ссылки
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// добавлю любимые всплывающие уведомления
import { toast } from 'react-toastify';
// запросы
import axios from 'axios';
// нужен текущий юзер в системе
import { getCurrentUser } from '../features/authentication/model/auth';

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

  useEffect(() => {
    const fetchIncidents = async () => {
      setIsLoading(true);
      try {
        // ============================================================================
        // GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
        // ============================================================================
        const responseIncidents = await axios.get(`http://localhost:3001/incidents/${id}`);
        setIncident(responseIncidents.data);

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
                toast.dismiss();
                setIsLoading(true);
                // ============================================================================
                // DELETE-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
                // ============================================================================
                await axios.delete(`http://localhost:3001/incidents/${id}`);

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
  const incidentLabels = {
    accident: 'ДТП',
    hazard: 'Опасный участок',
  };

  // Пишем интерфейс на JSX
  return (
    <div className="page-detail">
      <div className="card">
        <div className="first-block-detail">
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
          <h2>Детали инцидента </h2>
          <div className="ud-btn">
            {/* Кнопка редактировать */}
            {user?.id === incident?.userId && !showDelete && (
              <button
                className="circle-btn"
                title="Редактировать"
                onClick={() => {
                  navigate(`/editing-incident/${id}`);
                }}
              >
                <img src="https://s.kontur.ru/common-v2/icons-ui/black/tool-pencil-line/tool-pencil-line-32-Regular.svg" />
              </button>
            )}

            {/* Кнопка удалить */}
            {user?.id === incident?.userId && !showDelete && (
              <button className="circle-btn" title="Удалить" onClick={handleDelete}>
                <img src="https://s.kontur.ru/common-v2/icons-ui/black/trash-can/trash-can-32-Regular.svg" />
              </button>
            )}
          </div>
          {/* ud-btn */}
        </div>
        {/* first-block-detail */}
        <div className="second-block">
          <div className="detail-title">{incident?.title}</div>
          {/* detail-title */}
          <div className="detail-description">{incident?.description}</div>
          {/* detail-description */}
          <table className="detail-table">
            <tbody>
              <tr>
                <td>Тип инцидента</td>
                <td>
                  <span>{incidentLabels[incident?.type] || 'Другое'}</span>
                </td>
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
                  <span>{incident?.status === 'active' ? 'Активный' : 'Неактивный'}</span>
                </td>
              </tr>
            </tbody>
          </table>
          {/* detail-table */}
        </div>
        {/* second-block */}
      </div>
      {/* card */}
    </div>
    // page
  );
}

export default IncidentDetail;
