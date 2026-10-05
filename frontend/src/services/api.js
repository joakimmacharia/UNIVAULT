import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const logoutUser = () => API.post('/auth/logout');

// Storage Units
export const getStorageUnits = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  return API.get(`/storage?${params.toString()}`);
};
export const getStorageUnit = (id) => API.get(`/storage/${id}`);

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings/me');
export const getBooking = (id) => API.get(`/bookings/${id}`);
export const cancelBooking = (id) => API.patch(`/bookings/${id}/cancel`);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminBookings = () => API.get('/admin/bookings');
export const getAdminUsers = () => API.get('/admin/users');
export const getAdminUnits = () => API.get('/admin/units');
export const updateBookingStatus = (id, status) => API.patch(`/admin/bookings/${id}/status`, { status });

export default API;
