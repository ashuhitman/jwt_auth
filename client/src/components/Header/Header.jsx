import React from "react";
import "./Header.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import useNetwork from "../../hooks/useNetwork";

function Header() {
  const { user, token, setToken } = useAuth();
  const { handleRequest, loading } = useNetwork();
  const logout = async () => {
    try {
      await handleRequest("/auth/logout", "DELETE", null, true);
      setToken(null);
    } catch (error) {
      console.log("logout error: ", error);
    }
  };
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
        <ul>{token && <li onClick={logout}>Logout</li>}</ul>
      </nav>
    </header>
  );
}

export default Header;
