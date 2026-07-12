const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const appsettings = {
  apiUrl: import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:5048/api' : '/api'),
};
