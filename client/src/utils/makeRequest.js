import axios from "axios";

let isRefreshing = false;

const API_BASE_URL = "http://localhost:8000";
// create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

const makeRequest = async (
  url,
  method,
  data = null,
  requiresCredentials = false
) => {
  console.log("sending request....");
  axiosInstance.interceptors.request.use(
    async (config) => {
      console.log("axios interceptors running...");
      // Check if the request is for /auth/login, /auth/register, /auth/reset-password/:id/:token, or /auth/send-reset-password-email
      if (
        config.url === "/auth/login" ||
        config.url === "/auth/register" ||
        config.url.includes("/auth/reset-password") ||
        config.url === "/auth/send-reset-password-email"
      ) {
        return config; // Skip interceptors for login and signup
      }
      if (isRefreshing) return;

      // Token refresh logic before fetching data
      try {
        // add credentials
        axios.defaults.withCredentials = true;
        // make request to get refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`);
        console.log(response);
        // get the refresh token
        const { token } = response.data;
        // throw error if not token
        if (!token) throw new Error("No valid token found!");
        // add token to header
        config.headers.Authorization = "Bearer " + token;
        console.log("refreshed...");
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

  try {
    const config = {
      url,
      method: method.toLowerCase(),
      data,
    };
    // Add credentials only if requiresCredentials is true
    if (requiresCredentials) {
      config.withCredentials = true;
    }
    const response = await axiosInstance(config);
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("useNetwork: ", error);
    if (error.code === "ERR_NETWORK") {
      throw Error("Network error");
    } else {
      throw Error(error.response.data.message);
    }
  }
};

export default makeRequest;
