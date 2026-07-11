const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const appsettings = {
  apiUrl: isLocal ? 'http://localhost:5048/api' : '/api',
};
