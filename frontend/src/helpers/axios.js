import axios from "axios";
import { baseURL } from "../constants";

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 120000,
  timeoutErrorMessage:
    "We are gently waking up our backend service. Please have a little more patient.",
});

axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("planttrackerAccess");
  const refreshToken = localStorage.getItem("planttrackerRefresh");
  config.headers.Authorization = accessToken ? `JWT ${accessToken}` : null;
  config.headers["Content-Type"] = "multipart/form-data";

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    console.log(error)
    const originalRequest = error.config;
    console.log("request was", originalRequest, baseURL);

    if (typeof error.response === "undefined") {
      console.timeLog(
        "A server/network error occurred. " +
          "Looks like CORS might be the problem. " +
          "Sorry about this - we will get it fixed shortly."
      );
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === "accounts/token/refresh/"
    ) {
      console.error(
        "got 401 instead of access token from accounts/token/refresh"
      );
      localStorage.removeItem("planttrackerRefresh");
      localStorage.removeItem("planttrackerAccess");
      window.location.href = "/login/";

      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === "accounts/me/"
    ) {
      console.error("got 401 from accounts/me");
      localStorage.removeItem("planttrackerRefresh");
      localStorage.removeItem("planttrackerAccess");
      window.location.href = "/login/";

      return Promise.reject(error);
    }

    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401
    ) {
      const refreshToken = localStorage.getItem("planttrackerRefresh");
      console.log("refresh token", refreshToken);

      if (refreshToken && refreshToken !== "undefined") {
        try {
          const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));
          // exp date in token is expressed in seconds, while now() returns milliseconds:
          const now = Math.ceil(Date.now() / 1000);
          console.log(tokenParts.exp);
        } catch {
          console.error("Corrupted refresh token.");
          localStorage.removeItem("planttrackerRefresh");
          localStorage.removeItem("planttrackerAccess");
          window.dispatchEvent(new Event("storage"));
          window.location.href = "/login/";
        }
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
          console.error("Refresh token is expired", tokenParts.exp, now);
          localStorage.removeItem("planttrackerRefresh");
          localStorage.removeItem("planttrackerAccess");
          window.location.href = "/login/";
        }
      } else {
        console.error("Refresh token not available.");
        localStorage.removeItem("planttrackerRefresh");
        localStorage.removeItem("planttrackerAccess");
        window.dispatchEvent(new Event("storage"));
        window.location.href = "/login/";
      }
    }
    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export default axiosInstance;
