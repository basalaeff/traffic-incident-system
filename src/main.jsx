import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* Нужно обязательно создать контейнер для toast */}
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick={true}
      rtl={false} // Не трогай, если не араб!
      pauseOnFocusLoss={false} //переключение на другую вкладку
      draggable={true} //Смахнуть разрешаю
      theme="colored" //еще есть light, dark, auto, colored (используется)
    />
  </StrictMode>
);
