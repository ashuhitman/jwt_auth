import React, { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./auth.scss";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/context/authContext";

function Auth() {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const { token, loading } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      console.log(token);
      navigate("/user/profile");
    }
  }, []);
  return (
    <div className="container">
      {isLoginPage ? (
        <Login setLoginPage={setIsLoginPage} />
      ) : (
        <Register setLoginPage={setIsLoginPage} />
      )}
    </div>
  );
}

export default Auth;
