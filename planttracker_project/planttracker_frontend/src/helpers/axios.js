import axios from 'axios';
export const axios_inst = axios.create({
    baseURL: 'http://localhost:8000/api/',
    timeout: 5000,
  });
