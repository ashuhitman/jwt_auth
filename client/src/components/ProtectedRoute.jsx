import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/authContext";
import Loader from "./Loader/Loader";

function ProtectedRoute() {
  const { loading, token } = useAuth();

  // If the authentication is still loading, you can optionally show a loading indicator.
  if (loading) {
    return (
      <div
        style={{
          position: absolute,
          inset: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Loader display="visible" />
      </div>
    );
  }

  // If there is no token (user is not authenticated), redirect to the login page.
  if (!token) {
    return <Navigate to="/" />;
  }

  // If the user is authenticated, render the protected content.
  return <Outlet />;
}

export default ProtectedRoute;
