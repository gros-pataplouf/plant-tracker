import axios from 'axios';
const accessToken = localStorage.getItem('planttrackerAccess');
const refreshToken = localStorage.getItem('planttrackerRefresh');
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    timeout: 5000,
    Authorization: accessToken? `JWT ${accessToken}`: null,
    'Content-Type': 'application/json'
  });

axios.interceptors.request.use(function(config) {
    // modify the config object
    console.log(config.data)
    return config;
  });

export {axiosInstance};