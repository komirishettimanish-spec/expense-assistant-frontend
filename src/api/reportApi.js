import api from './api';

export const getMonthlyReport = ({ month, year }) =>
  api.get('/reports/monthly', { params: { month, year } }).then((r) => r.data);
