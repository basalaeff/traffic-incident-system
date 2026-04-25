import axios from 'axios';
const API_URL = 'http://localhost:3001';
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