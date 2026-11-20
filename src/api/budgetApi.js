import api from './api';

export const getBudgets = () => api.get('/budgets').then((r) => r.data);

export const getBudgetStatus = ({ month, year }) =>
  api.get('/budgets/status', { params: { month, year } }).then((r) => r.data);

export const createBudget = (payload) => api.post('/budgets', payload).then((r) => r.data);

export const updateBudget = (id, payload) => api.put(`/budgets/${id}`, payload).then((r) => r.data);

export const deleteBudget = (id) => api.delete(`/budgets/${id}`);
