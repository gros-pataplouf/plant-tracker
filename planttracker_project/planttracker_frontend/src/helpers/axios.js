import axios from 'axios';
const baseURL = 'http://localhost:8000/api/'
const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 20000,
  });

axiosInstance.interceptors.request.use(function(config) {
  const accessToken = localStorage.getItem('planttrackerAccess');
  const refreshToken = localStorage.getItem('planttrackerRefresh');
  config.headers.Authorization = accessToken? `JWT ${accessToken}`: null;
  config.headers['Content-Type'] = 'multipart/form-data';
 
  return config;
  });


  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
  
      if (typeof error.response === 'undefined') {
        console.timeLog(
          'A server/network error occurred. ' +
            'Looks like CORS might be the problem. ' +
            'Sorry about this - we will get it fixed shortly.'
        );
        console.log("original", originalRequest);
        return Promise.reject(error);
      }
  
      if (
        error.response.status === 401 &&
        originalRequest.url === baseURL + 'token/refresh/'
      ) {
        window.location.href = '/login/';
        return Promise.reject(error);
      }
  
      if (
        error.response.data.code === 'token_not_valid' &&
        error.response.status === 401 &&
        error.response.statusText === 'Unauthorized'
      ) {
        const refreshToken = localStorage.getItem('refresh_token');
  
        if (refreshToken) {
          const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
  
          // exp date in token is expressed in seconds, while now() returns milliseconds:
          const now = Math.ceil(Date.now() / 1000);
          console.log(tokenParts.exp);
  
          if (tokenParts.exp > now) {
            return axiosInstance
              .post('/token/refresh/', { refresh: refreshToken })
              .then((response) => {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
  
                axiosInstance.defaults.headers['Authorization'] =
                  'JWT ' + response.data.access;
                originalRequest.headers['Authorization'] =
                  'JWT ' + response.data.access;
  
                return axiosInstance(originalRequest);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            console.log('Refresh token is expired', tokenParts.exp, now);
            window.location.href = '/login/';
          }
        } else {
          console.log('Refresh token not available.');
          window.location.href = '/login/';
        }
      }
  
      // specific error handling done elsewhere
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;  
axiosInstance.interceptors.response.use(function(response) {
  return response;
},
async function(error) {


    if (typeof error.response === 'undefined') {
      alert(
        'A server/network error occurred. ' +
          'Looks like CORS might be the problem. ' +
          'Sorry about this - we will get it fixed shortly.'
      );
      return Promise.reject(error);
    }
  switch(error.response.status) {
    case 400:
      window.alert("Bad request ⛔ ");
      return;
    case 401:
      const initialRequest = error.config;
      if (initialRequest.url === 'http://localhost:8000/api/token/refresh/') {
        return axiosInstance.post('token/refresh/', {
        refresh: localStorage.getItem('planttrackerRefresh')
        })
        .then(res => {
          localStorage.setItem('planttrackerAccess', res.data.access);
          axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
          originalRequest.headers['Authorization'] = 'JWT ' + response.data.access;
          return axiosInstance(originalRequest);
        })
        //this part still generates redirects to login page ???!!!
        .catch(err => {
          console.error(err);
          return window.location.href = '/login/' 
          
        })

      } 
      console.log(initialRequest);
      break;


      // window.alert("Please log in to perform this action!");
           
      // return window.location.href = `http://localhost:5173/login?${window.location.pathname.slice(1,)}`;


    // case 404:
    //   return window.location.href = "http://localhost:5173/notfound";
      
    default:
      return error;

      
  

  }


});


export {axiosInstance};