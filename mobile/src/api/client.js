import axios from 'axios';
import { API_BASE_URL } from './config';

const client = axios.create({ baseURL: API_BASE_URL, timeout: 10000, headers: { 'Content-Type': 'application/json' } });

export function setAuthToken(token) {
  if (token) client.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete client.defaults.headers.common.Authorization;
}

export default client;
