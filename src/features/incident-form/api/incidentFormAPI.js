import axios from 'axios';
import { API_URL } from '@/app/api/globalAPI';

// ============================================================================
// GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
// ============================================================================
// Promise (убрал await)
export const loadIncidentById = (id) => axios.get(`${API_URL}/incidents/${id}`);
// ============================================================================
// PATCH-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
// ============================================================================
export const editIncidentById = (id, { title, description, type, status }) =>
  axios.patch(`${API_URL}/incidents/${id}`, {
    title,
    description,
    type,
    status,
  });
// ============================================================================
// PUSH-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
// ============================================================================
export const pushIncident = ({ id, type, title, description, lat, lng, time, userId }) =>
  axios.post(`${API_URL}/incidents`, {
    id,
    type,
    title,
    description,
    status: 'active',
    // оставим (Африка лучше, чем сломанная карта)
    lat: lat ? parseFloat(lat) : 0, // Преобразуем в число (чтобы карта не ломалась)
    lng: lng ? parseFloat(lng) : 0, // Преобразуем в число
    time,
    userId,
  });
