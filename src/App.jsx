import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./pages/Auth/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Dashboard from "./pages/DashboardPage/DashboardPage";
import CustomersPage from "./pages/CustomersPage/CustomersPage";
import PaymentPage from "./pages/PaymentPage/PaymentPage";
import StockPage from "./pages/StockPage/StockPage";
import OrderPage from "./pages/OrderPage/OrderPage";
import Receipt from "./pages/ReceiptPage/ReceiptPage";
import ReportPage from "./pages/ReportPage/ReportPage";
import Setting from "./pages/SettingPage/SettingPage";
import Profile from "./pages/ProfilePage/ProfilePage";
import User from "./pages/UsersPage/UsersPage";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Layout (login only) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          {/* ADMIN ONLY */}
          <Route
            index
            element={
              <ProtectedRoute roles={["admin", "cashier"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ADMIN + USER */}
          <Route
            path="customers"
            element={
              <ProtectedRoute roles={["admin", "cashier", "user"]}>
                <CustomersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="payment"
            element={
              <ProtectedRoute roles={["admin", "cashier", "user"]}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="stock"
            element={
              <ProtectedRoute roles={["admin", "cashier", "user"]}>
                <StockPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="order/view-order"
            element={
              <ProtectedRoute roles={["admin", "cashier", "user"]}>
                <OrderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="order/receipt"
            element={
              <ProtectedRoute roles={["admin", "cashier", "user"]}>
                <Receipt />
              </ProtectedRoute>
            }
          />

          {/* ADMIN ONLY */}
          <Route
            path="report"
            element={
              <ProtectedRoute roles={["admin", "cashier"]}>
                <ReportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="setting"
            element={
              <ProtectedRoute roles={["cashier", "user"]}>
                <Setting />
              </ProtectedRoute>
            }
          />

          <Route
            path="setting/profile"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="setting/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <User />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
