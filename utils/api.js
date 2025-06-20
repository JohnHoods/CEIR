import axios from "axios";
const API_BASE = "https://committed-purpose-bfc9c6671d.strapiapp.com";
export const API_URL = `${API_BASE}/api`;

// Регистрация нового пользователя
export const registerUser = async (payload) =>
  axios.post(`${API_URL}/auth/local/register`, payload);

// Авторизация
export const loginUser = async (payload) =>
  axios.post(`${API_URL}/auth/local`, payload);

// Добавление кастомных полей к пользователю после регистрации
export const updateUser = async (id, payload, jwt) =>
  axios.put(`${API_URL}/users/${id}`, payload, {
    headers: { Authorization: `Bearer ${jwt}` },
  });

// Добавление товара (авторизация обязательна)
export const addProduct = async (formData, jwt) =>
  axios.post(`${API_URL}/products`, formData, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
