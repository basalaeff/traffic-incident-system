import axios from 'axios';
const API_URL = 'http://localhost:3001/';
// ============================================================================
// GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/users
// ============================================================================
// Promise (убрал await)
export const findUserByLogin = (login) => axios.get(`${API_URL}/users?login=${login}`);

// ============================================================================
// POST-ЗАПРОС НА СЕРВЕР http://localhost:3001/users
// ============================================================================
export const registerUser = ({ id, login, password }) =>
  axios.post(`${API_URL}/users`, {
    id,
    login,
    password,
  });
