import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../hooks/useNetwork";

export const AuthContext = createContext();

export const AuthState = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const refreshToken = async () => {
    console.log("refreshong token...");
    try {
      axios.defaults.withCredentials = true;
      const url = `${API_BASE_URL}/auth/refresh-token`;
      const result = await axios.post(url);
      // Assuming your server returns user and token data

      setToken(result.data.token);
    } catch (error) {
      console.error("Error refreshing token", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      refreshToken();
    }
  }, []);

  // Make sure to return the values from the context provider
  return (
    <AuthContext.Provider value={{ loading, user, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
