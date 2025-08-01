import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const register = (username, password) =>
  axios.post(`${API_URL}/register`, { username, password });

export const login = (username, password) =>
  axios.post(`${API_URL}/login`, { username, password });