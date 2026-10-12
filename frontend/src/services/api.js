import axios from 'axios';

// Uses relative endpoint so Vite proxy handles forwarding to http://localhost:5252
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/students';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const studentApi = {
  // Get all students (with optional search filter)
  getAll: async (search = '') => {
    const params = search ? { search } : {};
    const res = await apiClient.get('', { params });
    return res.data;
  },

  // Get single student by ID
  getById: async (id) => {
    const res = await apiClient.get(`/${id}`);
    return res.data;
  },

  // Create new student
  create: async (student) => {
    const res = await apiClient.post('', student);
    return res.data;
  },

  // Update existing student
  update: async (id, student) => {
    const res = await apiClient.put(`/${id}`, student);
    return res.data;
  },

  // Delete student by ID
  delete: async (id) => {
    const res = await apiClient.delete(`/${id}`);
    return res.data;
  },
};

export default apiClient;
