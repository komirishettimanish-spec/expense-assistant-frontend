import api from './api';

function clean(params = {}) {
  return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null));
}

export const getExpenses = (filters) =>
  api.get('/expenses', { params: clean(filters) }).then((r) => r.data);

export const getExpense = (id) => api.get(`/expenses/${id}`).then((r) => r.data);

export const createExpense = (payload) => api.post('/expenses', payload).then((r) => r.data);

export const updateExpense = (id, payload) => api.put(`/expenses/${id}`, payload).then((r) => r.data);

export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
