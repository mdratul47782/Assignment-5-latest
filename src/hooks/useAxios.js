import axios from "axios";
import { useEffect } from "react";
import { api } from "../api"; // Your Axios instance
import { useAuth } from "./useAuth";

const useAxios = () => {
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    // Request Interceptor
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        if (auth?.accessToken) {
          config.headers.Authorization = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    const responseIntercept = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const response = await axios.post(
              "http://localhost:5000/api/auth/refresh-token",
              { refreshToken: auth?.refreshToken }
            );

            const newToken = response.data?.data?.token;
            if (newToken) {
              // Save token in state and local storage
              setAuth((prev) => {
                const updatedAuth = { ...prev, accessToken: newToken };
                localStorage.setItem("auth", JSON.stringify(updatedAuth));
                return updatedAuth;
              });

              // Retry the original request with the new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);

            // Clear auth and local storage on token refresh failure
            setAuth(null);
            localStorage.removeItem("auth");
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [auth, setAuth]);

  return api;
};

export default useAxios;
