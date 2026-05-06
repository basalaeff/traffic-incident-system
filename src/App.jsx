// Это инструменты из библиотеки
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// ============================================================================
// КОМПОНЕНТЫ
// ============================================================================
import Home from './pages/Home';
import IncidentDetail from './pages/IncidentDetail';
import IncidentForm from './pages/IncidentForm';
import Authentication from './pages/Authentication';
import Registration from './pages/Registration';

// ============================================================================
// ОСНОВНАЯ ФУНКЦИЯ ПРИЛОЖЕНИЯ
// ============================================================================
const App = () => {
  // В моем приложении есть карта, которая зависит от интернета
  // Когда я запускаю приложение локально и оно не грузиться, я и сам не сразу понимаю,
  // когда пропал интернет. Решил написать простой трекер для отслеживания

  useEffect(() => {
    // Проверка при старте
    if (!navigator.onLine) {
      handleOffline;
    }
    // Функции для установки состояния true/false
    const handleOnline = () => {
      toast.dismiss();
      toast.success('Подключение восстановлено!');
    };
    const handleOffline = () => {
      toast.warn('Упс! Кажется у вас пропал интернет. Восстановите подключение к интернету!', {
        // закрытие по таймеру выключено
        autoClose: false,
        // по клику закрыть нельзя
        closeOnClick: false,
        // и перетаскиванием тоже
        draggable: false,
        // крестик убрал тоже
        closeButton: false,
        theme: 'dark',
      });
    };
    // создадим трекер для проверки
    // вызовет функцию при событии
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // очищаем трекер, когда закрываем приложение
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Вызывает один раз при запуске

  return (
    <Router>
      <Routes>
        {/* page A */}
        {/* Если http://localhost:5173/ тогда отобразится Home(); */}
        <Route path="/" element={<Home />} />
        {/* page B */}
        {/* Если http://localhost:5173/incident/:id тогда отобразится IncidentDetail(); */}
        <Route path="/incident/:id" element={<IncidentDetail />} />
        {/* page C */}
        {/* Если http://localhost:5173/create-incident тогда отобразится IncidentForm(); */}
        <Route path="/create-incident" element={<IncidentForm />} />
        {/* Если http://localhost:5173/editing-incident/:id тогда отобразится IncidentForm(); */}
        <Route path="/editing-incident/:id" element={<IncidentForm />} />
        {/* page D */}
        {/* Если http://localhost:5173/login тогда отобразится Login(); */}
        <Route path="/login" element={<Authentication />} />
        {/* page E */}
        {/* Если http://localhost:5173/create-account тогда отобразится Registration(); */}
        <Route path="/create-account" element={<Registration />} />
        {/* если пользователь вводит в строку какую-то фигню, то возвращаем его на главную */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
