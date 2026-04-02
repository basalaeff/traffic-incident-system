// Это инструменты из библиотеки
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ============================================================================
// КОМПОНЕНТЫ
// ============================================================================
import Home from './pages/Home';
import IncidentDetail from './pages/IncidentDetail';
import IncidentForm from './pages/IncidentForm';
import Login from './pages/Login';
import Registration from './pages/Registration';

// ============================================================================
// ОСНОВНАЯ ФУНКЦИЯ ПРИЛОЖЕНИЯ
// ============================================================================
const App = () => {
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
        {/* page D */}
        {/* Если http://localhost:5173/login тогда отобразится Login(); */}
        <Route path="/login" element={<Login />} />
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
