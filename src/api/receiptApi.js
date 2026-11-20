import api from './api';

export function uploadReceipt(file, onUploadProgress) {
  const formData = new FormData();
  formData.append('file', file);
  return api
    .post('/receipts/upload', formData, { timeout: 120000, onUploadProgress })
    .then((r) => r.data);
}
