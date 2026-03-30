import './Home.css';
import { useState, useEffect } from 'react';

// Добавлю компоненты карты
// Контейнер карты, улицы, маркеры, всплывающее окно
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Нужен хук для роутинга
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Нужна библиотека для работы с иконками
import L from 'leaflet';
import Avatar from 'react-avatar';

// всплывающие уведомления тоже могут пригодиться
import { toast } from 'react-toastify';

import { getCurrentUser, logoutUser } from '../auth';

// ============================================================================
// НАСТРОЙКА МАРКЕРОВ
// ============================================================================
// Есть несколько типов инцидентов (пока ДТП и опасные участки, но может придумаю еще)
// У каждого типа инцидента будет свой маркер
// Напишу функцию, которая будет возвращать маркеры по типу инцидента
// Взял с GitHub: https://github.com/pointhi/leaflet-color-markers

const getCustomIcon = (type, status) => {
  // Пропишу иконки
  // Красный маркер (для ДТП)
  const redIconUrl = '/markers/marker-icon-2x-red.png';
  // Оранжевый маркер (для опасных участков)
  const orangeIconUrl = '/markers/marker-icon-2x-orange.png';
  // возьмем серый для "Устранено"
  const grayIconUrl = '/markers/marker-icon-2x-grey.png';
  // Синий по умолчанию
  const blueIconUrl = '/markers/marker-icon-2x-blue.png';

  let chosenUrl = blueIconUrl; // По умолчанию ставим синюю

  // Реализую логику выбора цвета
  if (status === 'inactive') {
    // Если инцидент устранен - ставим серую
    chosenUrl = grayIconUrl;
  } else if (type === 'accident') {
    // Если тип accident - ставим красную
    chosenUrl = redIconUrl;
  } else if (type === 'hazard') {
    // Если тип hazard - ставим оранжевую
    chosenUrl = orangeIconUrl;
  }
  // А теперь просто возвращаем созданный объект
  // Размеры взял с того же гит хаб
  // Создал общую конструкцию для вывода иконок
  return L.icon({
    iconUrl: chosenUrl, // Ссылка на выбранный маркер
    iconSize: [25, 41], // Размер иконки [ширина, высота] в пикселях.
    iconAnchor: [12, 41], // Точка привязки
    // 20 - это центр по горизонтали, 40 - это высота.
    popupAnchor: [1, -34], // Отсюда открывается попап.
  });
};

function Home() {
  // Напишем массивы для хранения данных с использованием деструкционализации
  // Создадим массив для хранения инцидентов
  const [incidents, setIncidents] = useState([]);
  // для хранения координат
  const [userLocation, setUserLocation] = useState(null);
  // для хранения флага загрузки
  const [loading, setLoading] = useState(true);
  // для переключения между страницами
  const navigate = useNavigate();

  // ============================================================================
  // ПОЛУЧЕНИЕ ГЕОЛОКАЦИИ
  // ============================================================================
  // Пишем useEffect() - это хук, который выполняет код после того как компонент
  // отобразится на экране
  useEffect(() => {
    // буду использовать объект navigator
    // Он встроен в браузер и дает доступ к функциям устройства
    // geolocation это его свойство. Я буду использовать его для определения местоположения
    // Некоторые браузеры могут не поддерживать эту функцию (либо старый браузер, либо чел параноик)
    // Если не поддерживает геолокацию?
    if (!navigator.geolocation) {
      toast.info('Ваш браузер не поддерживает геолокацию');
      // Это флаг загрузки. Позиция false указывает, что загрузка завершена успешно.
      setLoading(false);
      return;
    }

    // Нужна функция, которая будет запрашивать местоположение у пользователя
    // К счастью она уже встроена в браузер и считывает GPS или Wi-Fi устройства

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Вызывается если успешно
        // Используем объект position.coords (есть долгота, широта, высота, и другое всякое)
        // Нужны только углы
        // Получим значения и положим в массив
        // Если геолокация обновляется, то Home перезапускается
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setLoading(false);
      },
      // А если не получится? Тогда просто будем устанавливать исходную точку
      // Делаем приложение, которое будет использоваться внутри страны
      // Пусть это будет центр Москвы (55.751244, 37.618423). Так в самокате (украл идейку)
      () => {
        setUserLocation([55.751244, 37.618423]); // Москва
        setLoading(false);
        // Закинем в консоль разработчика
        console.warn(
          'Пользователь запретил доступ к геолокации или произошла ошибка. Использованы координаты по умолчанию.'
        );
      }
    );
  }, []); //Работает только при старте

  // ============================================================================
  // ЗАГРУЗКА ДАННЫХ С СЕРВЕРА (API)
  // ============================================================================
  // Нужен хук useEffect()
  useEffect(() => {
    // Нужно написать асинхронную функцию для запроса данных с сервера
    // Данные могут приходить с задержкой.\
    //Буду использовать ключевое слово async, из него буду брать await (для ожидания)
    const fetchIncidents = async () => {
      // так при запросе серверу все может упасть. нужна обработка ошибок
      try {
        const response = await axios.get('http://localhost:3001/incidents');
        // Теперь нужно добавить данные в массив для хранения инцидентов
        setIncidents(response.data);
      } catch (err) {
        // Выводим ошибку в консоль разработчика
        // Будем выводить ошибки в консоль
        // Первый параметр это префикс. Так удобнее
        console.error('Ошибка загрузки инцидентов: ', err);
        // Выведем уведомление (3000)
        // Если что-то не так, то выведет второе (дефолтное)
        toast.error(err.message || 'Ошибка загрузки инцидентов');
      }
    };
    // Нужно запустить функцию
    fetchIncidents();
  }, []);
  // ============================================================================
  // ДЛЯ АВТОРИЗАЦИИ/ВЫХОДА ПОЛЬЗОВАТЕЛЯ
  // ============================================================================
  const user = getCurrentUser();
  const handleAuthClick = () => {
    if (user) {
      logoutUser(); // Если вошел — выходим
      window.location.reload(); // Перезагружаем страницу для обновления состояния
    } else {
      navigate('/login'); // Если не вошел идем на логин
    }
  };
  // ============================================================================
  // РЕНДЕРИНГ
  // ============================================================================
  if (loading || !userLocation) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
      </div>
    );
  }

  // ============================================================================
  // ОСНОВНОЙ ИНТЕРФЕЙС
  // ============================================================================
  return (
    // Внешний контейнер для всей страницы
    // Нужно добавить отступ в 20 пикселей, чтобы было красивенько и не прилипало
    <div className="home-page">
      <div className="floating-btns">
        {user && (
          <button
            className="circle-btn"
            onClick={() => alert('Нажата круглая кнопка!')}
            title="Добавить инцидент"
          >
            <img src="https://s.kontur.ru/common-v2/icons-ui/black/plus-circle/plus-circle-32-Regular.png" />
          </button>
        )}

        <button className="circle-btn" onClick={handleAuthClick} title={user ? 'Выйти' : 'Войти'}>
          {user ? (
            <Avatar name={user?.email} size="46" round={true} src={false} />
          ) : (
            <img src="https://s.kontur.ru/common-v2/icons-ui/black/arrow-ui-auth-login/arrow-ui-auth-login-32-Regular.svg" />
          )}
        </button>
      </div>
      {/* floating-btns */}
      <main className="map-container">
        {/* Нужно настроить отрисовку пустой карты */}
        {/* Это компонент карты от библиотеки react-leaflet. */}
        <MapContainer
          // Здесь настроим центрирование карты (на Москве или на пользователе)
          center={userLocation}
          // Установим масштаб. Доступно от 1 до 19.
          // 1 - Планета, 19 - Крыша дома
          // Поставим пока 13
          zoom={13}
          // Крч планета это слишком много
          // Мне пока лень делать кластеризацию, поэтому просто ограничу масштаб
          maxZoom={19}
          minZoom={12}
          // Нужно указать стиль карты
          // Ширина (настроили по всей области)
          // 867px на глазок
          style={{ height: '867px', width: '100%' }}
        >
          {/* Подгрузка плиточек карты */}
          {/* Используем OpenStreetMap */}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Отрисовка маркеров */}
          {incidents.map((incident) => {
            return (
              <Marker
                key={incident.id}
                position={[incident.lat, incident.lng]}
                icon={getCustomIcon(incident.type, incident.status)}
              >
                <Popup>
                  {/* Нужно написать стили для всплывающего окна  */}
                  <div style={{ minWidth: '200px' }}>
                    <h3 style={{ margin: '0 0 5px 0' }}>{incident.title}</h3>
                    <p style={{ margin: 0, fontSize: '14px' }}>{incident.description}</p>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#555' }}>
                      Тип: <b>{incident.type}</b> | Статус: <b>{incident.status}</b>
                    </div>
                    <button
                      onClick={() => navigate(`/incident/${incident.id}`)}
                      style={{ marginTop: '8px', cursor: 'pointer' }}
                    >
                      Подробнее
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </main>
      {/* map-container */}
    </div>
    // home-page
  );
}

export default Home;
