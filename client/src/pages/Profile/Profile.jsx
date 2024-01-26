import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Profile.scss";
import Header from "../../components/Header/Header";
import { validateChangePasswordData } from "../../utils/validateUser";
import Loader from "../../components/Loader/Loader";
import Alert from "../../components/Alert/Alert";
import { alertStatus, useAlert } from "../../components/context/AlertContext";
import useNetwork from "../../hooks/useNetwork";

function Profile({ page = "reset" }) {
  // get params from url
  const { id, token } = useParams();
  const psdRef = useRef(null);
  const confirmationPsd = useRef(null);
  const [inputType, setInputType] = useState("password");
  const [formErrors, setFormErrors] = useState({
    password: "",
    password_confirmation: "",
  });
  const { handleRequest, loading } = useNetwork();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const { setAlertStateFromComponent } = useAlert();
  const navigate = useNavigate();
  const handleShowAlert = () => {
    setIsAlertVisible(true);
  };

  const handleHideAlert = () => {
    setIsAlertVisible(false);
  };

  const changeInputType = () => {
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    handleShowAlert();
    const password = psdRef.current.value;
    const password_confirmation = confirmationPsd.current.value;
    const data = { password, password_confirmation };
    const [isError, errors] = validateChangePasswordData(data);

    if (isError) {
      setFormErrors(errors);
      return;
    }

    if (page === "reset") {
      console.log("reset password");
      const url = `/auth/reset-password/${id}/${token}`;
      await makeNetworkRequest(url, "POST", data);
    } else {
      const url = `/auth/changepassword`;
      await makeNetworkRequest(url, "POST", data, true);
    }
  };

  const makeNetworkRequest = async (
    url,
    method,
    data,
    requiresCredentials = false
  ) => {
    try {
      const result = await handleRequest(
        url,
        method,
        data,
        requiresCredentials
      );

      const { status, message } = result;
      setAlertStateFromComponent({
        message,
        status: alertStatus.SUCCESS,
      });
    } catch (error) {
      console.error("profile error: ", error);
      setAlertStateFromComponent({
        message: error.message,
        status: alertStatus.ERROR,
      });
    }
  };

  return (
    <div className="profile-container">
      <Header />

      <main>
        <form onSubmit={submit}>
          <div className="form-input">
            <Loader visibility={loading ? "visible" : "hidden"} />
          </div>
          <div className="form-input">
            <input
              type={inputType}
              placeholder={page === "reset" ? "New Password" : "Password"}
              ref={psdRef}
              onChange={() => setFormErrors({ ...formErrors, password: "" })}
            />
            <p className="error">{formErrors.password}</p>
          </div>
          <div className="form-input">
            <input
              type={inputType}
              placeholder={
                page === "reset"
                  ? "New Confirmation Password"
                  : "Confirmation Password"
              }
              ref={confirmationPsd}
              onChange={() =>
                setFormErrors({ ...formErrors, password_confirmation: "" })
              }
            />
            <p className="error">{formErrors.password_confirmation}</p>
          </div>

          <div className="form-checkbox">
            <input
              type="checkbox"
              id="show_password"
              onChange={changeInputType}
            />
            <label htmlFor="show_password">Show Password</label>
          </div>
          <div className="form-input">
            <button type="submit">
              {!loading
                ? page === "reset"
                  ? "Reset Password"
                  : "Change Password"
                : page === "reset"
                ? "Resetting Password..."
                : "Change Password..."}
            </button>
          </div>
        </form>
      </main>
      <footer>@copyrights; designed by Ashutosh Singh</footer>
    </div>
  );
}

export default Profile;
