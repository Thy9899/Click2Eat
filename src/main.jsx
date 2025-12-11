import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PaymentProvider } from "./context/PaymentContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <PaymentProvider>
          <App />
        </PaymentProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
