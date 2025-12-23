import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { PaymentProvider } from "./context/PaymentContext";
import { ReportProvider } from "./context/ReportContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <OrderProvider>
          <PaymentProvider>
            <ReportProvider>
              <App />
            </ReportProvider>
          </PaymentProvider>
        </OrderProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
