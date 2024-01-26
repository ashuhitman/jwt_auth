import React, { useRef, useState } from "react";
import { validateLoginData } from "../../utils/validateUser";
import Loader from "../../components/Loader/Loader";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/context/authContext";
import { alertStatus, useAlert } from "../../components/context/AlertContext";
import useNetwork from "../../hooks/useNetwork";

function Login({ setLoginPage }) {
  const identifierRef = useRef();
  const psdRef = useRef();
  const [formErrors, setFormErrors] = useState({
    identifier: "",
    password: "",
  });

  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { setAlertStateFromComponent } = useAlert();
  const { handleRequest, loading } = useNetwork();

  const loginUser = async (e) => {
    // prevent deault process
    e.preventDefault();
    // get input data
    const identifier = identifierRef.current.value;
    const password = psdRef.current.value;
    const data = { identifier, password };
    // validate login data
    const [isError, errors] = validateLoginData(data);

    // set error if there is an error
    if (isError) {
      setFormErrors(errors);
      return;
    }
    // else login
    try {
      const result = await handleRequest("/auth/login", "POST", data);
      const { status, message, token } = result;
      // save token
      setToken(token);

      setAlertStateFromComponent({
        message,
        status: alertStatus.SUCCESS,
      });
      navigate("/user/profile");
    } catch (error) {
      console.error("login error: ", error);
      setAlertStateFromComponent({
        message: error.message,
        status: alertStatus.ERROR,
      });
    }
  };
  const onInputChange = (e) => {
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };
  return (
    <form onSubmit={loginUser}>
      <div className="loader-group">
        <Loader visibility={loading ? "visible" : "hidden"} />
      </div>
      <div className="form-group">
        <h2>Login</h2>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="identifier"
          placeholder="Email or Username"
          ref={identifierRef}
          onChange={onInputChange}
        />
        <p className="error">{formErrors.identifier}</p>
      </div>
      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="Password"
          ref={psdRef}
          onChange={onInputChange}
        />
        <p className="error">{formErrors.password}</p>
      </div>
      <div className="forgot-pass">
        <Link to="/user/forgot-password">forgot password?</Link>
      </div>
      <div className="form-group">
        <button>{loading ? "logging in..." : "Login"}</button>
      </div>
      <div className="link-group">
        <a onClick={() => setLoginPage(false)}>Go to Signup Page</a>
      </div>
    </form>
  );
}

export default Login;
