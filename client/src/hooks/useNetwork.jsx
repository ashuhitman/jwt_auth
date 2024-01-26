import { useState, useEffect } from "react";
import axios from "axios";

export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://jwt-auth-ugqm.onrender.com"
    : "http://localhost:8000";
// create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

let isRefreshing = false;

// Interceptor for token refreshing before fetching data
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("axios interceptors running...");

    if (
      config.url === "/auth/login" ||
      config.url === "/auth/register" ||
      config.url.includes("/auth/reset-password") ||
      config.url === "/auth/send-reset-password-email"
    ) {
      return config;
    }
    if (isRefreshing) return config;

    // Token refresh logic before fetching data
    try {
      // add credentials
      axios.defaults.withCredentials = true;
      // make request to get refresh token
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`);
      // console.log(response);
      // get the refresh token
      const { token } = response.data;
      // throw error if not token
      if (!token) throw new Error("No valid token found!");
      // add token to header
      config.headers.Authorization = "Bearer " + token;
      // console.log("token refreshed...");
    } catch (error) {
      console.error("useNetwork:Interceptors ", error);

      // Handle token refresh error, e.g., clear stored token and redirect to login
      // localStorage.removeItem("token");
      // history.push("/login");
    } finally {
      isRefreshing = false;
    }
    return config;
  },
  (error) => {
    isRefreshing = false;
    return Promise.reject(error);
  }
);

const useNetwork = () => {
  const [loading, setLoading] = useState(false);
  const handleRequest = async (
    url,
    method,
    data = null,
    requiresCredentials = false
  ) => {
    console.log("sending request....");
    setLoading(true);
    try {
      const config = {
        url,
        method: method.toLowerCase(),
        data,
      };

      config.withCredentials = true;

      const response = await axiosInstance(config);
      // console.log(response);

      return response.data;
    } catch (error) {
      console.error("useNetwork: ", error);
      if (error.code === "ERR_NETWORK") {
        throw Error("Network error");
      } else {
        throw Error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleRequest, loading };
};

export default useNetwork;
