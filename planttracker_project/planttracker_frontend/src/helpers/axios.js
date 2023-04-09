import axios from 'axios';
const accessToken = localStorage.getItem('planttrackerAccess');
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
  const refreshToken = localStorage.getItem('planttrackerRefresh');
    config.headers.Authorization = accessToken? `JWT ${accessToken}`: null;
    console.log(config.headers)
    return config;
  });

axiosInstance.interceptors.response.use(function(response) {
  // modify the response object
  console.log(response.status);

  return response;
},
async function(error) {
  switch(error.response.status) {
    case 401:
      const initialRequest = error.config;
      if (initialRequest.url === 'http://localhost:8000/api/token/refresh/') {
        window.location.href = '/login/' 
        return Promise.reject(error)
      }
      if (error.response.data.code === 'token_not_valid') {
        return axiosInstance.post('token/refresh/', {
        refresh: localStorage.getItem('planttrackerRefresh')
        })
        .then(res => {
          localStorage.setItem('planttrackerAccess', res.data.access);
          axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
          originalRequest.headers['Authorization'] = 'JWT ' + response.data.access;
          return axiosInstance(originalRequest);
        })
        .catch(err => {
          console.err(err);
          window.location.href = '/login/' 

        })

      }

      window.alert("Please log in to perform this action!");
      
      
      return window.location.href = `http://localhost:5173/login?${window.location.pathname.slice(1,)}`;

    case 404:
      return window.location.href = "http://localhost:5173/notfound";
    default:
      return error;

      
  

  }


});


export {axiosInstance};