import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/authContext";

function ProtectedRoute() {
  const { loading, token } = useAuth();

  // If the authentication is still loading, you can optionally show a loading indicator.
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there is no token (user is not authenticated), redirect to the login page.
  if (!token) {
    return <Navigate to="/" />;
  }

  // If the user is authenticated, render the protected content.
  return <Outlet />;
}

export default ProtectedRoute;
