// для того чтобы получить ссылку на DOM-элемент нужен useRef
import { useState, useEffect, useRef } from 'react';

// Нужен хук для роутинга
import { useNavigate } from 'react-router-dom';

import { Spinner } from '@/widgets/spinner';
import { useIncidentsAndUsers } from '@/features/home/model/fetchData';
import { useHandleAuthClick } from '@/features/home/ui/handleAuthClick';
import { useCreateIncident } from '@/features/home/model/handleCreateIncident';
import { useLocation } from '@/features/home/model/getLocation';
import { useIncidentCards } from '@/features/home/model/fetchIncidentCards';
import { useScroll } from '@/features/home/model/handleScroll';
import { FloatingActions } from '@/features/home/ui/floatingActions';
import { Map } from '@/features/home/ui/Map';
import { SheetIncidentsList } from '@/features/home/ui/SheetIncidentsList';
import { getGeoData } from '@/features/home/model/geo';

function Home() {
  // Напишем массивы для хранения данных с использованием деструкционализации

  // для переключения между страницами
  const navigate = useNavigate();

  const [displayFloatingBtn, setDisplayFloatingBtn] = useState(true);

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

  // Синхронизируем рефы с состояниями
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
  const [userLocation, setUserLocation] = useState(getGeoData());
  // для хранения флага загрузки
  const [loading, setLoading] = useState(false);
  const { getLocation } = useLocation({ setLoading, setUserLocation });

  const { incidents, users } = useIncidentsAndUsers();

  const { handleAuthClick, displayLogout, user } = useHandleAuthClick();

  // состояние для центрирования карты
  const [isCentering, setIsCentering] = useState(false);

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
  const [incidentCard, setIncidentCard] = useState(null);

  useEffect(() => {
    const el = incidentCard;
    if (!el) return;

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [incidentCard, handleScroll]);

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
  // if (loading || !userLocation) {
  //   return <Spinner />;
  // }

  // ============================================================================
  // ЦЕНТРИРУЕТ КАРТУ ПО КООРДИНАТАМ ИНЦИДЕНТА
  // ============================================================================
  const handleViewOnMap = (incident) => {
    setUserLocation([incident.lat, incident.lng]);
    setCurrentZoom(18);
  };

  // ============================================================================
  // ДЕТАЛИЗАЦИЯ ИНЦИДЕНТА
  // ============================================================================

  const handleViewDetails = (id) => navigate(`/incident/${id}`);

  // ============================================================================
  // ОСНОВНОЙ ИНТЕРФЕЙС
  // ============================================================================
  return (
    // Внешний контейнер для всей страницы
    <div className="page-home">
      <FloatingActions
        displayFloatingBtn={displayFloatingBtn}
        setDisplayFloatingBtn={setDisplayFloatingBtn}
        isAddingMode={isAddingMode}
        user={user}
        displayLogout={displayLogout}
        handleAuthClick={handleAuthClick}
        handleCreateIncident={handleCreateIncident}
        handleCancelCreateIncident={handleCancelCreateIncident}
        getLocation={getLocation}
        loading={loading}
        isCentering={isCentering}
        setCurrentZoom={setCurrentZoom}
      />
      <SheetIncidentsList
        listRef={setIncidentCard}
        incidentCards={incidentCards}
        onViewOnMap={handleViewOnMap}
        onViewDetails={handleViewDetails}
        incidents={incidents}
        showProgressForIncidentCards={showProgressForIncidentCards}
      />

      <Map
        userLocation={userLocation}
        currentZoom={currentZoom}
        incidents={incidents}
        users={users}
        tempMarker={tempMarker}
        setTempMarker={setTempMarker}
        isAddingMode={isAddingMode}
        handleConfirmCreateIncident={handleConfirmCreateIncident}
        setIsCentering={setIsCentering}
      />
    </div>
    // page-home
  );
}

export default Home;
