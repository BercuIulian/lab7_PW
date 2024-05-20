import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const API_URL = 'http://localhost:5000';

let token = localStorage.getItem('token');
let decodedToken = token ? jwtDecode(token) : null;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : '',
  },
});

export const login = async (username, role) => {
  const response = await api.post('/auth', { username, role });
  token = response.data.token;
  localStorage.setItem('token', token);
  decodedToken = jwtDecode(token);
  api.defaults.headers.Authorization = `Bearer ${token}`;
};

export const getMovies = async () => {
  const response = await api.get('/movies');
  return response.data;
};

export const addMovie = async (movie) => {
  const response = await api.post('/movies', movie);
  return response.data;
};

export const updateMovie = async (id, movie) => {
  const response = await api.put(`/movies/${id}`, movie);
  return response.data;
};

export const deleteMovie = async (id) => {
  await api.delete(`/movies/${id}`);
};

export const isAuthenticated = () => !!token;
export const getPermissions = () => decodedToken ? decodedToken.permissions : [];
