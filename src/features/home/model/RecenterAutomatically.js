// ============================================================================
// ЦЕНТРИРОВАНИЕ КАРТЫ ПО КООРДИНАТАМ ПОЛЬЗОВАТЕЛЯ
// ============================================================================
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
export const RecenterAutomatically = ({ location, setIsCentering }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      setIsCentering(true);
      map.flyTo(location, 13);
      // map.flyTo(location, map.getZoom());
      // Когда движение закончится, сбросить флаг
      map.once('moveend', () => setIsCentering(false));
    }
  }, [location, map]);

  return null;
};
