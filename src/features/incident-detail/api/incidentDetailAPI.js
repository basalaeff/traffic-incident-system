import axios from 'axios';
const API_URL = 'http://localhost:3001/';
// ============================================================================
// GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
// ============================================================================
// Promise (убрал await)
export const loadIncidentById = (id) => axios.get(`${API_URL}/incidents/${id}`);
export const loadUserById = (id) => axios.get(`${API_URL}/users/${id}`);
export const deleteIncidentById = (id) => axios.delete(`${API_URL}/incidents/${id}`);