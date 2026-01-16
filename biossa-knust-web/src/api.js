import axios from 'axios';
import { getToken } from './utils/auth';

const API = axios.create({
  baseURL: 'https://biossaknust.onrender.com/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default API;
