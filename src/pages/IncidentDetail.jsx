//  Нужен хук, чтобы доставать id из ссылки
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// нужен текущий юзер в системе
import { getCurrentUser } from '@/features/authentication/model/auth';
import { useData } from '@/features/incident-detail/model/fetchData';
import { useDelete } from '@/features/incident-detail/ui/handleDelete';
import Spinner from '@/widgets/spinner';
import { DetailTable } from '@/features/incident-detail/ui/DetailTable';

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

  const { fetchData } = useData(id, setIncident, setOwner, setIsLoading);
  const { handleDelete } = useDelete(id, setIsLoading, navigate, setShowDelete);

  useEffect(() => {
    fetchData();
  }, [id]);
  // перезапускается при изменении id

  // ============================================================================
  // РЕНДЕРИНГ
  // ============================================================================
  if (isLoading) {
    return <Spinner />;
  }

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
          <DetailTable incident={incident} owner={owner} />
        </div>
        {/* second-block */}
      </div>
      {/* card */}
    </div>
    // page
  );
}

export default IncidentDetail;
