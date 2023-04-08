import axios from 'axios';
import { redirect } from 'react-router-dom';
const accessToken = localStorage.getItem('planttrackerAccess');
const refreshToken = localStorage.getItem('planttrackerRefresh');
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    timeout: 5000,
    headers: {
    Authorization: accessToken? `JWT ${accessToken}`: null,
    'Content-Type': 'application/json',
}
  });

axiosInstance.interceptors.request.use(function(config) {
  const accessToken = localStorage.getItem('planttrackerAccess');

    // modify the config object
    config.headers.Authorization = accessToken? `JWT ${accessToken}`: null;
    return config;
  });

axiosInstance.interceptors.response.use(function(response) {
  // modify the response object
  console.log(response.status);

  return response;
},
function(error) {
  switch(error.response.status) {
    case 401:
      window.alert("Please log in to perform this action!");
      return window.location.href = `http://localhost:5173/login?${window.location.pathname.slice(1,)}`;
    case 404:
      return window.location.href = "http://localhost:5173/notfound";
    default:
      return error;

      
  

  }


});


export {axiosInstance};