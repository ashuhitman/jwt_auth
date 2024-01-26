import React, { createContext, useContext, useState } from "react";

export const alertStatus = {
  NONE: "none",
  ERROR: "error",
  SUCCESS: "success",
};

const AlertContext = createContext();

export const useAlert = () => {
  return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    status: alertStatus.NONE,
    message: "",
  });

  // const showAlert = () => {
  //   setIsAlertVisible({ ...alertState, show: true });
  // };
  const setAlertStateFromComponent = ({
    status = alertState.status,
    message = alertState.message,
    show = alertState.show,
  }) => {
    setAlertState({ status, message, show });
  };
  const hideAlert = () => {
    setAlertState({ ...alertState, status: alertStatus.NONE });
  };

  return (
    <AlertContext.Provider
      value={{ alertState, setAlertStateFromComponent, hideAlert }}
    >
      {children}
    </AlertContext.Provider>
  );
};
