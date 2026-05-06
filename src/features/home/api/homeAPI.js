import axios from 'axios';
import { API_URL } from '@/app/api/globalAPI';
// ============================================================================
// GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
// ============================================================================
// Promise (убрал await)
export const loadIncidentCards = (requestPage, limit) =>
  axios.get(`${API_URL}/incidents`, {
    params: {
      _page: requestPage,
      _limit: limit,
    },
  });
export const loadIncidents = () => axios.get(`${API_URL}/incidents`);
// ============================================================================
// GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/users
// ============================================================================
export const loadUsers = () => axios.get(`${API_URL}/users`);