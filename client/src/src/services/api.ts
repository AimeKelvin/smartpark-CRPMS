import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  // Important for sessions
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for error handling
api.interceptors.response.use(response => response, error => {
  if (error.response && error.response.status === 401) {
    // Redirect to login if 401 Unauthorized (except for auth routes)
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});
export default api;