// Добавлю компоненты карты
// Контейнер карты, улицы, маркеры, всплывающее окно
// useMapEvents добавил для того чтобы ставить метку на карту
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { RecenterAutomatically } from '@/features/home/model/RecenterAutomatically';
import { getCustomMarker } from '@/features/home/model/getCustomMarker';
import { MapClickHandler } from '@/features/home/model/MapClickHandler';
import { PopupMarker } from '@/features/home/ui/PopupMarker';
import { PopupTempMarker } from '@/features/home/ui/PopupTempMarker';

export const Map = ({
  userLocation,
  currentZoom,
  incidents,
  users,
  tempMarker,
  setTempMarker,
  isAddingMode,
  handleConfirmCreateIncident,
  setIsCentering,
}) => {
  return (
    <main className="map-container">
      {/* Нужно настроить отрисовку пустой карты */}
      {/* Это компонент карты от библиотеки react-leaflet. */}
      <MapContainer
        // Здесь настроим центрирование карты (на Москве или на пользователе)
        center={userLocation}
        // Установим масштаб. Доступно от 1 до 19.
        // 1 - Планета, 19 - Крыша дома
        // Поставим пока 13
        zoom={currentZoom}
        // Крч планета это слишком много
        // Мне пока лень делать кластеризацию, поэтому просто ограничу масштаб
        maxZoom={18}
        // Временно выключен
        // minZoom={12}

        // скрыл кнопки
        zoomControl={false}
        // Нужно указать стиль карты
        // Ширина (настроили по всей области)
        // 867px на глазок
        style={{ height: '100%', width: '100%' }}
      >
        {/* Подгрузка плиточек карты */}
        {/* Используем OpenStreetMap */}
        <TileLayer
          className="dark-tiles"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterAutomatically
          location={userLocation}
          zoom={currentZoom}
          setIsCentering={setIsCentering}
        />
        {/* Отрисовка маркеров */}
        {incidents?.map((incident) => {
          return (
            <Marker
              key={incident?.id}
              position={[incident?.lat, incident?.lng]}
              icon={getCustomMarker(incident?.type, incident?.status)}
              // хочу реализовать, чтобы открывался при наведении
              eventHandlers={{
                mouseover: (e) => {
                  e.target.openPopup();
                },
                mouseout: (e) => {
                  // решил проблему с быстрым закрыванием
                  setTimeout(() => {
                    e.target.closePopup();
                  }, 2000);
                },
              }}
            >
              <PopupMarker incident={incident} users={users} />
            </Marker>
          );
        })}
        {/* Компонент для обработки кликов по карте */}
        <MapClickHandler setTempMarker={setTempMarker} isAddingMode={isAddingMode} />
        {/* Добавление инцидента */}
        {tempMarker && (
          <Marker
            position={tempMarker}
            icon={getCustomMarker('new', 'active')}
            eventHandlers={{
              mouseover: (e) => {
                e.target.openPopup();
              },
              mouseout: (e) => {
                // решил проблему с быстрым закрыванием
                setTimeout(() => {
                  e.target.closePopup();
                }, 2000);
              },
            }}
          >
            <PopupTempMarker
              tempMarker={tempMarker}
              handleConfirmCreateIncident={handleConfirmCreateIncident}
            />
          </Marker>
        )}
      </MapContainer>
    </main>
    // map-container
  );
};
export default Map;
