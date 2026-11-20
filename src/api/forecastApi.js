import api from './api';

export const getForecast = () => api.get('/forecast').then((r) => r.data);

export const getForecastInsight = () => api.get('/forecast/insight').then((r) => r.data);
