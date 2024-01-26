import React, { useRef, useState } from "react";
import "./ForgotPassword.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import { alertStatus, useAlert } from "../../components/context/AlertContext";
import useNetwork from "../../hooks/useNetwork";

function ForgotPassword() {
  const emailRef = useRef(null);
  const [error, setError] = useState("");
  const { handleRequest, loading } = useNetwork();
  const { setAlertStateFromComponent } = useAlert();
  const submit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    if (!email) {
      return setError("Email is required");
    }
    try {
      const result = await handleRequest(
        "/auth/send-reset-password-email",
        "POST",
        { email }
      );
      if (result) {
        const { status, message } = result;
        if (status === alertStatus.SUCCESS) {
          setAlertStateFromComponent({
            message,
            status: alertStatus.SUCCESS,
          });
        } else {
          setAlertStateFromComponent({
            message,
            status: alertStatus.ERROR,
          });
        }
      }
      console.log(result);
    } catch (error) {
      console.error("error: ", error);
      setAlertStateFromComponent({
        message: error.message,
        status: alertStatus.ERROR,
      });
    }
  };
  return (
    <div className="container">
      <form onSubmit={submit}>
        <div className="form-group" style={{ textAlign: "start" }}>
          <h3 style={{ fontSize: "1.6rem" }}>Forgot your password</h3>
        </div>
        <div className="form-group">
          <p>
            Please enter email address where you want password reset link to be
            sent.
          </p>
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Enter Email here"
            ref={emailRef}
            onChange={() => setError("")}
          />
          <p className="error">{error}</p>
        </div>
        <div className="form-group">
          <button type="submit">
            {loading ? "Sending request link..." : "Request reset link"}
          </button>
        </div>
        <div className="link-group">
          <Link to="/">Back to Login</Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
