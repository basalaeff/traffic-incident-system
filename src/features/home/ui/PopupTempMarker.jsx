import { Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

export const PopupTempMarker = ({ incident, users }) => {
  const navigate = useNavigate();
  return (
    <Popup>
      <div className="popup-content">
        <h3>{incident?.title}</h3>
        <p>{incident?.description}</p>
        Тип: <b>{incident?.type}</b> | Статус: <b>{incident?.status}</b>
        <p></p>
        {/* юзеров много в этот раз. поэтому буду использовать find */}
        {/* работает как фильтр: пробегает по массиву и находит подходящего юзера */}
        Пользователь:
        <b>{users?.find((users) => users.id === incident?.userId)?.login || ''}</b>
        <p></p>
        <button className="popup-btn" onClick={() => navigate(`/incident/${incident.id}`)}>
          Подробнее
        </button>
        {/* popup-btn */}
      </div>
      {/* popup-content */}
    </Popup>
  );
};
export default PopupTempMarker;