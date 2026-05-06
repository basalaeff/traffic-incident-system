// ============================================================================
// ЦЕНТРИРОВАНИЕ КАРТЫ ПО КООРДИНАТАМ ПОЛЬЗОВАТЕЛЯ
// ============================================================================
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
export const RecenterAutomatically = ({ location, zoom, setIsCentering }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      setIsCentering(true);
      map.flyTo(location, zoom);
      // Когда движение закончится, сбросить флаг
      map.once('moveend', () => setIsCentering(false));
    }
  }, [location, zoom, map]);

  return null;
};
