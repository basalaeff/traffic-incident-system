// ============================================================================
// ЦЕНТРИРОВАНИЕ КАРТЫ ПО КООРДИНАТАМ ПОЛЬЗОВАТЕЛЯ
// ============================================================================
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
export const RecenterAutomatically = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      // Перемещает камеру к новым координатам
      map.flyTo(location, map.getZoom());
    }
  }, [location, map]);

  return null;
};
