import React, { useRef, useState } from "react";
import { validateUser } from "../../utils/validateUser";
import Loader from "../../components/Loader/Loader";
import axios from "axios";
import { alertStatus, useAlert } from "../../components/context/AlertContext";
import useNetwork from "../../hooks/useNetwork";

function Register({ setLoginPage }) {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const psdRef = useRef(null);
  const rePsdRef = useRef(null);
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    rePassword: "",
    username: "",
  });
  const { setAlertStateFromComponent } = useAlert();
  const { handleRequest, loading } = useNetwork();
  const registerUser = async (e) => {
    e.preventDefault();

    // get input data
    const email = emailRef.current.value;
    const password = psdRef.current.value;
    const rePassword = rePsdRef.current.value;
    const username = usernameRef.current.value;

    const data = { email, password, rePassword, username };

    // validate login data
    const [isError, errors] = validateUser(data, "reg");
    console.log(isError, errors);
    // set error if there is an error
    if (isError) {
      setFormErrors(errors);
      return;
    }
    // else register
    try {
      const result = await handleRequest("/auth/register", "POST", data);
      console.log(result);
      const { status, message } = result;
      setAlertStateFromComponent({
        message,
        status: alertStatus.SUCCESS,
      });

      setLoginPage(true);
    } catch (error) {
      console.error("register error: ", error);
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
    <form className="register" onSubmit={registerUser}>
      <div className="loader-group">
        <Loader visibility={loading ? "visible" : "hidden"} />
      </div>
      <div className="form-group">
        <h2>Signup</h2>
      </div>
      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          ref={emailRef}
          onChange={onInputChange}
        />
        <p className="error">{formErrors.email}</p>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          ref={usernameRef}
          onChange={onInputChange}
        />
        <p className="error">{formErrors.username}</p>
      </div>

      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          ref={psdRef}
          onChange={onInputChange}
        />
        <p className="error">{formErrors.password}</p>
      </div>
      <div className="form-group">
        <input
          type="password"
          name="rePassword"
          placeholder="Re-enter password"
          ref={rePsdRef}
          onChange={onInputChange}
        />
        <p className="error">{formErrors.rePassword}</p>
      </div>
      <div className="form-group">
        <button>{loading ? "Signing up..." : "Sign Up"}</button>
      </div>
      <div className="link-group">
        <a onClick={() => setLoginPage(true)}>Go to Login Page</a>
      </div>
    </form>
  );
}

export default Register;
