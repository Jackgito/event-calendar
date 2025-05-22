import api from './axiosConfig';

export async function login(username: string, password: string) {
  const { data } = await api.post('/auth/login', { username, password });
  localStorage.setItem('authToken', data);
  return data;
}

export async function register(username: string, email: string, password: string) {
  const { data } = await api.post('/auth/register', { username, email, password });
  return data;
}

export function logout() {
  localStorage.removeItem('authToken');
}
