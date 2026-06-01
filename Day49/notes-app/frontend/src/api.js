import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const hydrateNote = (note) => {
  if (!note || typeof note !== 'object') return note;
  return {
    ...note,
    pinned: note.isPinned ?? note.pinned ?? false,
  };
};

const unwrap = (payload) => {
  const data = payload?.data ?? payload;
  if (Array.isArray(data)) return data.map(hydrateNote);
  if (data && typeof data === 'object') return hydrateNote(data);
  return data;
};

// Request interceptor
API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap data
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const getNotes = (params = {}) => API.get('/notes', { params }).then(unwrap);
export const getNoteById = (id) => API.get(`/notes/${id}`).then(unwrap);
export const createNote = (data) => API.post('/notes', data).then(unwrap);
export const updateNote = (id, data) => API.put(`/notes/${id}`, data).then(unwrap);
export const deleteNote = (id) => API.delete(`/notes/${id}`).then(unwrap);
export const togglePin = (id) => API.patch(`/notes/${id}/pin`).then(unwrap);

export default API;