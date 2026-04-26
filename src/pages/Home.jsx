// для того чтобы получить ссылку на DOM-элемент нужен useRef
import { useState, useEffect, useRef, useCallback } from 'react';

import { Progress, ProgressLabel, ProgressValue } from '@/shared/ui/progress';

// Добавлю компоненты карты
// Контейнер карты, улицы, маркеры, всплывающее окно
// useMapEvents добавил для того чтобы ставить метку на карту
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// Нужен хук для роутинга
import { useNavigate } from 'react-router-dom';
import '../css/components/map.css';
import 'leaflet/dist/leaflet.css';

import Avatar from 'react-avatar';

import { RecenterAutomatically } from '@/features/home/model/RecenterAutomatically';
import { getCustomMarker } from '@/features/home/model/getCustomMarker';
import { MapClickHandler } from '@/features/home/model/MapClickHandler';
import { AnimationFadeInUp } from '../shared/ui/animation';
import { renderBadge } from '@/features/home/ui/renderBadge';
import { Spinner } from '@/widgets/spinner';
import { useIncidentsAndUsers } from '@/features/home/model/fetchData';
import { useHandleAuthClick } from '@/features/home/ui/handleAuthClick';
import { useCreateIncident } from '@/features/home/model/handleCreateIncident';
import { useLocation } from '@/features/home/model/getLocation';
import { useIncidentCards } from '@/features/home/model/fetchIncidentCards';
import { useScroll } from '@/features/home/model/handleScroll';
import { FloatingActions } from '@/features/home/ui/floatingActions';

function Home() {
  // Напишем массивы для хранения данных с использованием деструкционализации

  // для переключения между страницами
  const navigate = useNavigate();

  const [displayMap, setDisplayMap] = useState(false);

  const [displayFloatingBtn, setDisplayFloatingBtn] = useState(false);

  // переменная для управления масштабом карты
  const [currentZoom, setCurrentZoom] = useState(13);

  // ============================================================================
  // СОСТОЯНИЯ ДЛЯ ДИНАМИЧЕСКОЙ ЗАГРУЗКИ КАРТОЧЕК
  // ============================================================================
  // Создадим массив для хранения инцидентов (карточки)
  const [incidentCards, setIncidentCards] = useState([]);

  // Текущая страница для нумерации областей с карточками (начинаем с 1)
  const [page, setPage] = useState(1);

  // Количество карточек на странице (лимит)
  const [limit] = useState(3);

  // Флаг: есть ли ещё данные для загрузки
  const [hasMore, setHasMore] = useState(true);

  // Флаг загрузки следующей порции данных (чтобы не дублировать запросы)
  const [loadingMore, setLoadingMore] = useState(false);

  // ============================================================================
  // РЕФЫ (всегда актуальные значения)
  // ============================================================================
  const pageRef = useRef(1); // текущая страница для API
  const hasMoreRef = useRef(true); // есть ли ещё данные
  const loadingRef = useRef(false); // идет ли загрузка

  // Синхронизируем рефы со стейтом
  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);
  useEffect(() => {
    loadingRef.current = loadingMore;
  }, [loadingMore]);

  const { fetchIncidentCards } = useIncidentCards(
    limit,
    pageRef,
    hasMoreRef,
    loadingRef,
    setIncidentCards,
    setPage,
    setHasMore,
    setLoadingMore
  );

  // Состояние для отображения прогресс бара при загрузке карточек
  const [showProgressForIncidentCards, setShowProgressForIncidentCards] = useState(false);

  const { handleScroll } = useScroll(
    loadingRef,
    hasMoreRef,
    pageRef,
    fetchIncidentCards,
    setShowProgressForIncidentCards
  );

  // для хранения координат
  const [userLocation, setUserLocation] = useState(null);
  // для хранения флага загрузки
  const [loading, setLoading] = useState(true);
  const { getLocation } = useLocation({ setLoading, setUserLocation });

  const { incidents, users } = useIncidentsAndUsers();

  const { handleAuthClick, displayLogout, user } = useHandleAuthClick();

  // для хранения состояния кнопки добавления инцидента
  const [isAddingMode, setIsAddingMode] = useState(false);
  // временный маркер для отображения на карте
  const [tempMarker, setTempMarker] = useState(null);
  const { handleCreateIncident, handleConfirmCreateIncident, handleCancelCreateIncident } =
    useCreateIncident(isAddingMode, setIsAddingMode, tempMarker, setTempMarker);

  // Вызываем один раз при старте
  useEffect(() => {
    getLocation();
  }, []);

  // ============================================================================
  // ПЕРВИЧНАЯ ЗАГРУЗКА
  // ============================================================================
  useEffect(() => {
    fetchIncidentCards(true, false);
  }, []);

  // ============================================================================
  // СКРОЛЛ
  // ============================================================================
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ============================================================================
  // ДЛЯ УПРАВЛЕНИЯ ОТОБРАЖЕНИЕМ ПРОГРЕСС БАРА
  // ============================================================================
  useEffect(() => {
    // Проверяем: если загрузка завершена (и данных больше 0)
    if (incidents.length > 0) {
      const timer = setTimeout(() => {
        setShowProgressForIncidentCards(false);
      }, 3000);

      return () => clearTimeout(timer); // Очистка таймера
    }
  }, [incidentCards.length, incidents.length]); // Срабатывает при изменении массивов

  // ============================================================================
  // РЕНДЕРИНГ
  // ============================================================================
  if (loading || !userLocation) {
    return <Spinner />;
  }

  // ============================================================================
  // ОСНОВНОЙ ИНТЕРФЕЙС
  // ============================================================================
  return (
    // Внешний контейнер для всей страницы
    <div className="page-home">
      <FloatingActions
        displayFloatingBtn={displayFloatingBtn}
        setDisplayFloatingBtn={setDisplayFloatingBtn}
        displayMap={displayMap}
        setDisplayMap={setDisplayMap}
        isAddingMode={isAddingMode}
        user={user}
        displayLogout={displayLogout}
        handleAuthClick={handleAuthClick}
        handleCreateIncident={handleCreateIncident}
        handleCancelCreateIncident={handleCancelCreateIncident}
        getLocation={getLocation}
      />

      {!displayMap && (
        <div className="main-card">
          <h1>Сервис мониторинга дорожных инцидентов</h1>
          <div className="incidents-list" ref={listRef}>
            {incidentCards.map((incidentCard) => {
              return (
                // Использую article
                // каждый инцидент самостоятельная единица данных
                <AnimationFadeInUp>
                  <article className="incident-card" key={incidentCard?.id}>
                    <div className="incident-card-first">
                      <header className="incident-card-header">
                        {renderBadge(incidentCard?.type)}
                        {renderBadge(incidentCard?.status)}
                      </header>
                      {/* incident-card-header */}
                      <h2 className="incident-card-title">{incidentCard?.title}</h2>
                      {/* incident-card-title */}
                      <p className="incident-card-description">{incidentCard?.description}</p>
                      {/* incident-card-description */}
                      <time className="incident-card-time">{incidentCard?.time}</time>
                      {/* incident-card-time */}
                      <footer className="incident-card-footer">
                        <span className="incident-card-coords">
                          {incidentCard?.lat}, {incidentCard?.lng}
                        </span>
                        {/* incident-card-coords */}
                      </footer>
                      {/* incident-card-footer */}
                    </div>
                    {/* incident-card-first  */}
                    <div className="incident-card-second">
                      <div className="ud-btn">
                        {/* Кнопка посмотреть на карте */}
                        <button
                          className="card-circle-btn"
                          title="Посмотреть на карте"
                          onClick={() => {
                            setUserLocation([incidentCard?.lat, incidentCard?.lng]);
                            setDisplayMap(true);
                            setCurrentZoom(18);
                          }}
                        >
                          <img src="https://s.kontur.ru/common-v2/icons-ui/black/location-pin/location-pin-32-Regular.svg" />
                        </button>

                        {/* Кнопка на страницу детализации */}
                        <button
                          className="card-circle-btn"
                          title="Подробнее"
                          onClick={() => navigate(`/incident/${incidentCard?.id}`)}
                        >
                          <img src="https://s.kontur.ru/common-v2/icons-ui/black/arrow-ui-corner-out-up-right/arrow-ui-corner-out-up-right-32-Regular.svg" />
                        </button>
                      </div>
                      {/* ud-btn */}
                    </div>
                    {/* incident-card-second */}
                  </article>
                  {/* incident-card */}
                </AnimationFadeInUp>
              );
            })}
          </div>
          {/* incidents-list */}
        </div>
        // main-card
      )}
      {showProgressForIncidentCards && (
        <div className="progress-position">
          <AnimationFadeInUp>
            <div className="progress-bar">
              <Progress
                value={incidents.length > 0 ? (incidentCards.length / incidents.length) * 100 : 0}
                className="w-full"
              >
                <ProgressLabel>
                  Загрузка инцидентов: {incidentCards.length}/{incidents.length}
                </ProgressLabel>
                <ProgressValue />
              </Progress>
            </div>
            {/* progress-bar */}
          </AnimationFadeInUp>
        </div>
        // progress-position
      )}

      {displayMap && (
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
            minZoom={12}
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
            <RecenterAutomatically location={userLocation} />
            {/* Отрисовка маркеров */}
            {incidents.map((incident) => {
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
                      <button
                        className="popup-btn"
                        onClick={() => navigate(`/incident/${incident.id}`)}
                      >
                        Подробнее
                      </button>
                      {/* popup-btn */}
                    </div>
                    {/* popup-content */}
                  </Popup>
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
                {/* у Popup пока нет css, написал только функциональность */}
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
              </Marker>
            )}
          </MapContainer>
        </main>
        // map-container
      )}
    </div>
    // page-home
  );
}

export default Home;
