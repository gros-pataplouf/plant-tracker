import axios from "axios";
const baseURL = "https://planttracker-be.onrender.com/";
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 120000,
  timeoutErrorMessage: "We are gently waking up our backend service. Please have a little more patient."
});

axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("planttrackerAccess");
  const refreshToken = localStorage.getItem("planttrackerRefresh");
  config.headers.Authorization = accessToken ? `JWT ${accessToken}` : null;
  config.headers["Content-Type"] = "multipart/form-data";
  console.log(config.data);

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    console.log(error, originalRequest.url);

    if (typeof error.response === "undefined") {
      console.timeLog(
        "A server/network error occurred. " +
          "Looks like CORS might be the problem. " +
          "Sorry about this - we will get it fixed shortly."
      );
      console.log("original", originalRequest);
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === baseURL + "token/refresh/"
    ) {
      window.alert("got 401 instead of access token from token/refresh");
      window.location.href = "/#/login/";
      return Promise.reject(error);
    }

    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401
    ) {
      const refreshToken = localStorage.getItem("planttrackerRefresh");
      console.log(refreshToken);

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);
        console.log(tokenParts.exp);

        if (tokenParts.exp > now) {
          return axiosInstance
            .post("accounts/token/refresh/", { refresh: refreshToken })
            .then((response) => {
              localStorage.setItem("planttrackerAccess", response.data.access);
              localStorage.setItem(
                "planttrackerRefresh",
                response.data.refresh
              );

              axiosInstance.defaults.headers["Authorization"] =
                "JWT " + response.data.access;
              originalRequest.headers["Authorization"] =
                "JWT " + response.data.access;

              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          window.alert("Refresh token is expired", tokenParts.exp, now);
          window.location.href = "#/login/";
        }
      } else {
        console.log("Refresh token not available.");
        window.location.href = "#/login/";
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export default axiosInstance;
