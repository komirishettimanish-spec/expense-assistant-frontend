const STATUS_MESSAGES = {
  400: 'The request was not valid. Please check your input.',
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to do that.',
  404: 'The requested item was not found.',
  409: 'This conflicts with existing data.',
  413: 'The file is too large. Maximum size is 10 MB.',
  422: 'The receipt could not be processed.',
  500: 'Something went wrong on the server. Please try again.',
  502: 'The AI service is temporarily unavailable. Please try again later.',
  503: 'The service is temporarily unavailable. Please try again later.',
};

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;
  if (!error.response) {
    if (error.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
    return 'Cannot reach the server. Make sure the backend is running on http://localhost:8080.';
  }
  const { status, data } = error.response;
  if (data && typeof data.message === 'string' && data.message.trim()) {
    return data.message;
  }
  return STATUS_MESSAGES[status] || fallback;
}
