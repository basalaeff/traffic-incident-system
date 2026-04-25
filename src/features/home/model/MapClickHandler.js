//  Нужно придумать как ловить клики по карте
// ============================================================================
// КОМПОНЕНТ ДЛЯ ОБРАБОТКИ КЛИКОВ ПО КАРТЕ
// ============================================================================
import { useMapEvents } from 'react-leaflet';
import { toast } from 'react-toastify';

export const MapClickHandler = ({ setTempMarker, isAddingMode }) => {
  // нужен хук useMapEvents для доступа к объекту карты
  useMapEvents({
    // обработчик клика
    click: (e) => {
      if (isAddingMode) {
        toast.dismiss();
        // e.latlng - объект, содержит координаты
        // передаем в функцию
        setTempMarker([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
};
