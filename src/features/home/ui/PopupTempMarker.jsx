import { Popup } from 'react-leaflet';

export const PopupTempMarker = ({ tempMarker, handleConfirmCreateIncident }) => {
  return (
    <Popup>
      <div className="popup-content">
        <h3>Новый инцидент</h3>
        <p>
          Координаты: {tempMarker[0]}, {tempMarker[1]}
        </p>
        <button className="popup-btn" onClick={handleConfirmCreateIncident}>
          Создать
        </button>
        {/* popup-btn */}
      </div>
      {/* popup-content */}
    </Popup>
  );
};
export default PopupTempMarker;
