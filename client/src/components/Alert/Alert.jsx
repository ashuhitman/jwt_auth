import React, { useEffect, useState } from "react";
import "./Alert.scss";
import { RiErrorWarningFill } from "react-icons/ri";
import { GiCheckMark } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { alertStatus, useAlert } from "../context/AlertContext";
import Loader from "../Loader/Loader";

function Alert() {
  const { alertState, setAlertState, hideAlert } = useAlert();
  useEffect(() => {
    let timeoutId;

    if (alertState.status !== alertStatus.NONE) {
      // Set a timeout to hide the alert after 3000 milliseconds (3 seconds)
      timeoutId = setTimeout(() => {
        hideAlert();
      }, 3000);
    }

    // Clear the timeout if the component unmounts or the alert is hidden manually
    return () => clearTimeout(timeoutId);
  }, [alertState.status]);
  if (alertState.status === alertStatus.NONE) {
    return <div></div>;
  }
  return (
    <div
      className="alert"
      style={{
        backgroundColor:
          alertState.status === alertStatus.ERROR
            ? "#e84118"
            : alertState.status === alertStatus.PROCESSING
            ? "#7f8c8d"
            : "green",
      }}
    >
      <div className="alert-icon">
        {alertState.status === alertStatus.ERROR ? (
          <RiErrorWarningFill size={20} />
        ) : alertState.status === alertStatus.PROCESSING ? (
          <Loader visibility="visible" size="20px" />
        ) : (
          <GiCheckMark size={20} />
        )}
      </div>
      <div className="alert-message">{alertState.message}</div>
      <div className="alert-btn">
        <ImCross
          color={
            alertState.status === alertStatus.ERROR
              ? "rgb(78, 11, 11)"
              : "#009432"
          }
          onClick={hideAlert}
          className="cancelIcon"
        />
      </div>
    </div>
  );
}

export default Alert;
