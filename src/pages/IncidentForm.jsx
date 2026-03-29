// стили
import './IncidentForm.css';
// Импортируем хук useState из библиотеки React.
import { useState } from 'react';
// ссылки и навигация
import { Link, useNavigate } from 'react-router-dom';
// всплывающие уведомления тоже могут пригодиться
import { toast } from 'react-toastify';
// запросы
import axios from 'axios';
// доступно только авторизированным пользователям
// получаем текущего пользователя
import { getCurrentUser } from '../auth';

function IncidentForm() {
  // ============================================================================
  // ПЕРЕМЕННЫЕ СОСТОЯНИЙ
  // ============================================================================
  // {
  //     "id": 1,
  //     "type": "accident",
  //     "title": "ДТП на перекрестке",
  //     "description": "Столкнулись две машины, перекрыта полоса.",
  //     "lat": 55.751244,
  //     "lng": 37.618423,
  //     "status": "active",
  //     "userId": 1,
  //     "date": "21.03.2026",
  //     "time": "10:00:00"
  //   },
  const [id, setId] = useState('');
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  // загрузка
  // false - загрузки нет, кнопка активна
  // true - загрузка есть, кнопка не активна
  const [isLoading, setIsLoading] = useState(false);
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
  }
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
      toast.success(`Инцидент добавлен!`);
      // нужна задержка, чтобы пользователь посмотрел уведомление (3000)
      // поставим 4000
      setTimeout(() => {
        setIsLoading(false);
        // нужно направить пользователя на главную (useNavigate)
        navigate('/');
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
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <h2>Добавьте новый инцидент</h2>
        </div>
        {/* form-header */}
        <div className="form">
          <input
            className="form-input"
            type="text"
            value={type}
            // Надо зафиксировать изменения
            onChange={handleTypeChange}
            // Добавлю подсказку (исчезнет при вводе)
            placeholder="Тип инцидента"
            required //Обязательно для заполнения
          />
          <input
            className="form-input"
            type="text"
            value={title}
            // Надо зафиксировать изменения
            onChange={handleTitleChange}
            // Добавлю подсказку (исчезнет при вводе)
            placeholder="Заголовок"
            required //Обязательно для заполнения
          />
          <input
            className="form-input"
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
        </div>
        {/* form */}
      </div>
      {/* form-card */}
    </div>
    // form-page
  );
}
export default IncidentForm;
