// Импортируем хук useState из библиотеки React.
import { useState, useEffect } from 'react';
// ссылки и навигация
// убрал Link (не использую ссылки в этом компоненте)
// добавил useLocation (нужно получать координаты с хома)
import { useLocation, useNavigate } from 'react-router-dom';
// всплывающие уведомления тоже могут пригодиться
import { toast } from 'react-toastify';
// запросы
import axios from 'axios';
// доступно только авторизированным пользователям
// получаем текущего пользователя
import { getCurrentUser } from '../auth';

function IncidentForm() {
  const navigate = useNavigate(); //хук для переброса на авторизацию
  const location = useLocation(); // хук для координат с хома

  // ============================================================================
  // ПЕРЕМЕННЫЕ СОСТОЯНИЙ
  // ============================================================================
  // {
  //     "id": uuid(универсальный уникальный идентификатор),
  //     "type": "accident",
  //     "title": "ДТП на перекрестке",
  //     "description": "Столкнулись две машины, перекрыта полоса.",
  //     "lat": 55.751244,
  //     "lng": 37.618423,
  //     "status": "active",
  //     "userId": 1,
  //     "time": "21.03.2026",
  //   },
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [userId, setUserId] = useState('');
  // загрузка
  // false - загрузки нет, кнопка активна
  // true - загрузка есть, кнопка не активна
  const [isLoading, setIsLoading] = useState(false);

  // на данную страницу можно попасть через адресную строку (я так и сюда и зашел)
  // но это означает, что пользователь может сломать мне карту (ранее я указал 0, 0 в таких случаях)
  // но это решение лишь ставит маркер в море рядом в Африкой, а там вообще не дорог
  // надо писать запрет добавления вовсе и переброс на главную

  useEffect(() => {
    // проверка
    const hasCoords = location.state && 'lat' in location.state && 'lng' in location.state;
    if (!hasCoords) {
      toast.warn('Координаты не выбраны. ');
      navigate('/');
      return;
    }
    setLat(location.state.lat);
    setLng(location.state.lng);
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserId(user.id);
      console.info('Current user: ', user);
    } else {
      console.warn('Пользователь не авторизован');
      toast.warn('Форма добавления инцидентов доступна только авторизированным пользователям!');
      navigate('/login');
    }
  }, []);
  // ============================================================================
  // ФУНКЦИЯ ОБРАБОТКИ ИЗМЕНЕНИЯ В ПОЛЕ TYPE
  // ============================================================================
  // Вызывается каждый раз, когда происходит изменение в поле
  const handleTypeChange = (e) => {
    // Берем текущий текст из поля с помощью e.target.value
    setType(e.target.value);
  };
  // ============================================================================
  // ФУНКЦИЯ ОБРАБОТКИ ИЗМЕНЕНИЯ В ПОЛЕ TITLE
  // ============================================================================
  // Вызывается каждый раз, когда происходит изменение в поле
  const handleTitleChange = (e) => {
    // Берем текущий текст из поля с помощью e.target.value
    setTitle(e.target.value);
  };
  // ============================================================================
  // ФУНКЦИЯ ОБРАБОТКИ ИЗМЕНЕНИЯ В ПОЛЕ DESCRIPTION
  // ============================================================================
  // Вызывается каждый раз, когда происходит изменение в поле
  const handleDescriptionChange = (e) => {
    // Берем текущий текст из поля с помощью e.target.value
    setDescription(e.target.value);
  };
  // ============================================================================
  // ФУНКЦИЯ СБРОСА ПОЛЕЙ
  // ============================================================================
  const handleReset = () => {
    setType('');
    setDescription('');
    setTitle('');
    setIsLoading(false);
  };
  // ============================================================================
  // ФУНКЦИЯ ОТПРАВКИ ФОРМЫ
  // ============================================================================
  const handleSubmit = async (e) => {
    // Нужно запретить перезагрузку страницы при отправке формы
    e.preventDefault();
    // Нужно заблокировать повторные запросы при тыканье на кнопку
    // Пока нет ответа. Новый запрос не будет отправлен
    setIsLoading(true);
    try {
      const now = new Date().toLocaleString('ru-RU');
      // буду генерировать id cам (безопасность, не нужен GET-запрос, чтобы достать id,
      // которое придумает json-server для переброса на детализацию
      const uuid = crypto.randomUUID();
      // ============================================================================
      // POST-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
      // ============================================================================
      await axios.post('http://localhost:3001/incidents', {
        id: uuid,
        type,
        title,
        description,
        status: 'active',
        // оставим (Африка лучше, чем сломанная карта)
        lat: lat ? parseFloat(lat) : 0, // Преобразуем в число (чтобы карта не ломалась)
        lng: lng ? parseFloat(lng) : 0, // Преобразуем в число
        time: now,
        userId,
      });

      toast.success(`Инцидент добавлен!`);
      // нужна задержка, чтобы пользователь посмотрел уведомление (3000)
      // поставим 4000
      setTimeout(() => {
        // не нужно направлять пользователя на главную (это вообще не user friendly)
        // надо стразу на детализацию инцидента
        navigate(`/incident/${uuid}`);
      }, 4000);
      // try
    } catch (err) {
      // Будем выводить ошибки в консоль
      // Первый параметр это префикс. Так удобнее
      console.error('Form error: ', err);
      // Выведем уведомление (3000)
      // Если что-то не так, то выведет второе (дефолтное)
      toast.error(err.message || 'Не удалось добавить инцидент. Проверьте правильность данных.');
    } finally {
      // меняем состояние кнопки
      setTimeout(() => {
        setIsLoading(false); // нужно добавить переменную состояния
      }, 1000);
    }
  };
  // Пишем интерфейс на JSX
  return (
    <div className="page">
      <div className="card">
        <div className="first-block">
          <button
            className="home-btn"
            onClick={() => {
              navigate('/');
            }}
            title="Главная"
          >
            <img src="https://s.kontur.ru/common-v2/icons-ui/black/building-home/building-home-32-Regular.svg" />
          </button>
          {/* home-btn */}
          <h2>Форма</h2>
          <div className='subtitle'>Добавьте новый инцидент</div>
          {/* subtitle */}
        </div>
        {/* first-block */}
        <div className="second-block">
          <form onSubmit={handleSubmit}>
            <select className="input" value={type} onChange={handleTypeChange} required>
              <option value="" disabled></option>
              <option value="accident">ДТП</option>
              <option value="hazard">Опасный участок</option>
              <option value="other">Другое</option>
            </select>
            <input
              className="input"
              type="text"
              value={title}
              // Надо зафиксировать изменения
              onChange={handleTitleChange}
              // Добавлю подсказку (исчезнет при вводе)
              placeholder="Заголовок"
              required //Обязательно для заполнения
            />
            <input
              className="input"
              type="text"
              value={description}
              // Надо зафиксировать изменения
              onChange={handleDescriptionChange}
              // Добавлю подсказку (исчезнет при вводе)
              placeholder="Описание"
              required //Обязательно для заполнения
            />
            <div className="group-btn">
              <button type="button" className="btn" onClick={handleReset}>
                Очистить
              </button>
              <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? (
                  <div className="loading-button">
                    <div className="spinner-mini"></div>
                  </div>
                ) : (
                  'Сохранить'
                )}
              </button>
              {/* btn*/}
            </div>
            {/* group-btn */}
          </form>
        </div>
        {/* second-block */}
      </div>
      {/* card */}
    </div>
    // form-page
  );
}
export default IncidentForm;
