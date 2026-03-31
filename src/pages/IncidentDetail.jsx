// стили
import './IncidentDetail.css';
//  Нужен хук, чтобы доставать id из ссылки
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// добавлю любимые всплывающие уведомления
import { toast } from 'react-toastify';
// запросы
import axios from 'axios';

function IncidentDetail() {
  // Достаем id c помощью хука
  const { id } = useParams();
  const navigate = useNavigate();

  // Создадим массив для хранения инцидента
  const [incident, setIncident] = useState([]);
  const [user, setUser] = useState([]);

  // загрузка
  const [isLoading, setIsLoading] = useState(false);

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
          const responseUser = await axios.get(
            `http://localhost:3001/users/${responseIncidents.data.userId}`
          );
          setUser(responseUser.data);
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

  // Пишем интерфейс на JSX
  return (
    <div className="detail-page">
      <div className="detail-card">
        <div className="detail-header">
          <h2>Детали инцидента </h2>
        </div>
        {/* detail-header */}
        <div className="detail">
          <div className="detail-title">{incident?.title}</div>
          {/* detail-title */}
          <div className="detail-description">{incident?.description}</div>
          {/* detail-description */}
          <div className="detail-type">{incident?.type}</div>
          {/* detail-type */}
          <div className="detail-position">
            {incident?.lat}, {incident?.lng}
          </div>
          {/* detail-position */}
          <div className="detail-user">{user?.email}</div>
          {/* detail-user */}
          <div className="detail-time">
            {incident?.date}, {incident?.time}
          </div>
          {/* detail-time */}
          <div className="detail-status">{incident?.status}</div>
          {/* detail-status */}
        </div>
        {/* detail */}
      </div>
      {/* detail-card */}
    </div>
    // detail-page
  );
}
export default IncidentDetail;
