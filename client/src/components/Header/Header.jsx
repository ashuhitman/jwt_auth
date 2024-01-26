import React from "react";
import "./Header.scss";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import useNetwork from "../../hooks/useNetwork";
import { alertStatus, useAlert } from "../context/AlertContext";

function Header() {
  const { user, token, setToken } = useAuth();
  const { handleRequest, loading } = useNetwork();
  const { setAlertStateFromComponent } = useAlert();
  const logout = async () => {
    try {
      setAlertStateFromComponent({
        message: "logging out...",
        status: alertStatus.PROCESSING,
      });
      const result = await handleRequest("/auth/logout", "DELETE", null, true);
      setToken(null);
      setAlertStateFromComponent({
        message: result.message,
        status: alertStatus.SUCCESS,
      });
    } catch (error) {
      console.log("logout error: ", error);
      setAlertStateFromComponent({
        message: error.message,
        status: alertStatus.ERROR,
      });
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
