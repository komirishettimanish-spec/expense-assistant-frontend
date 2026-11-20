import api from './api';

export const getSavingSuggestions = () => api.get('/ai/saving-suggestions').then((r) => r.data);
