import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import { AlertProvider } from "./components/context/AlertContext.jsx";
import Alert from "./components/Alert/Alert.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AlertProvider>
      <Alert />
      <App />
    </AlertProvider>
  </React.StrictMode>
);
