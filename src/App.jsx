// Это инструменты из библиотеки
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Компоненты
import Home from './pages/Home';
import IncidentDetail from './pages/IncidentDetail';
// import IncidentForm from './pages/IncidentForm';
// import Login from './pages/Login';
// import Registration from './pages/Registration';

// Основная функция приложения

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Если http://localhost:5173/ тогда отобразится Home(); */}
        <Route path='/' element={<Home />} />
        {/* Если http://localhost:5173/incident/:id тогда отобразится IncidentDetail(); */}
        <Route path='/incident/:id' element={<IncidentDetail />} />
        {/* Если http://localhost:5173/create-incident тогда отобразится IncidentForm(); */}
        {/* <Route path='/create-incident' element={<IncidentForm />} /> */}
        {/* Если http://localhost:5173/login тогда отобразится Login(); */}
        {/* <Route path='/login' element={<Login />} /> */}
        {/* Если http://localhost:5173/create-account тогда отобразится Registration(); */}
        {/* <Route path='/create-account' element={<Registration />} /> */}
      </Routes>
    </Router>
  );
};

export default App;